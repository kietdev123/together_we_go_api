const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ERROR_MESSAGE } = require("../contrants");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");

exports.register = async (req, res, next) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name)) {
      return sendError(res, "All input is required")
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return sendError(res, "User Already Exist. Please Login")
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      // Add default avatar
      avatarUrl:
        "https://res.cloudinary.com/dxoblxypq/image/upload/v1679984586/9843c460ff72ee89d791bffe667e451c_rzalqh.jpg",
    });

    sendSuccess(res,"register successfully", user);
  } catch (err) {
    console.log(err);
    sendServerError(res);
  }
};

exports.login = async (req, res, next) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return sendError(res, "All input is required")
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const access_token = jwt.sign(
        { user_id: user._id, role : user.role },
        process.env.ACCESS_TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // Create token
      const refresh_token = jwt.sign(
        { user_id: user._id, role : user.role },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: "30d",
        }
      );

      return sendSuccess(res, "login successfully", {
        accsess_token: access_token,
        refresh_token: refresh_token,
      })

    } else {
      return sendError(res, "email or password not correct")
    }
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
  // Our register logic ends here
};

exports.loginWithGoogle = async (req, res, next) => {
  try {
    // Get user input
    const { email, name, avatar } = req.body;

    // Validate if user exist in our database
    let user = await User.findOne({ email });

    if (!user) {
      let encryptedPassword = await bcrypt.hash(
        "togerther_we_go_default_password",
        10
      );

      user = await User.create({
        email: email,
        first_name: name,
        password: encryptedPassword,
        avatarUrl: avatar,
      });
    }

    // Create token
    const access_token = jwt.sign(
      { user_id: user._id, role : user.role },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    // Create token
    const refresh_token = jwt.sign(
      { user_id: user._id, role : user.role },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );

    // user
    res.status(200).json({
      accsess_token: access_token,
      refresh_token: refresh_token,
      user_id: user.id,
      user_name: user.first_name,
      user_email: user.email,
      user_avatar: user.avatarUrl,
    });
    
  } catch (err) {
    console.log(err);
    return sendServerError(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.body.refresh_token;

    if (!token) {
      return res
        .status(403)
        .send("A refresh token is required for refresh access token");
    }
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      req.user = decoded;
      
      const access_token = jwt.sign(
        { user_id: req.user.user_id,  role : req.user.role },
        process.env.ACCESS_TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      return sendSuccess(res, "Refresh access token successfully", {
        accsess_token: access_token,
      });

    } catch (err) {
      return sendError(res,"Invalid Refresh Token" )
    }
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, new_password } = req.body;

    // Validate if user exist in our database
    let user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      let encryptedPassword = await bcrypt.hash(new_password, 10);

      user.password = encryptedPassword;
      await user.save();
   
      return sendSuccess(res, "Reset password successfully");
      
    }
    else {
      return sendError(res, "email or password not correct")
    }

  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};
