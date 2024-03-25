const BookingSaved = require("../models/booking_saved");
const user = require("../models/user.js");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const dataName = "booking_saved";

exports.add = async (req, res, next) => {
    try {
      let data = await BookingSaved.findOne({
        'user' : req.user.user_id,
        'booking' : req.params.id,
      }); 

      if (data == null || data == undefined) {
        data = await BookingSaved.create({
          'user' : req.user.user_id,
          'booking' : req.params.id,
        });
      }
    
      
      return sendSuccess(res, `Add 1 ${dataName} successfully`, data);
    } catch (e) {
      console.log(e);
      return sendServerError(res);
    }
  };

exports.gets = async (req, res, next) => {
    try {
        let filter = {};
        let {page, pageSize, sortCreatedAt, sortUpdatedAt} = req.query;
        let skipNum = 0;
    
        if (page) page = Number(page);
        else page = 1
    
        if (pageSize) pageSize = Number(pageSize);
        else pageSize = 20;
    
        skipNum = (page - 1) * pageSize;
        if (skipNum < 0) skipNum = 0;
    
        let datas = await BookingSaved.find({})
        .skip(skipNum)
        .limit(pageSize)
        .populate({
          path : 'booking',
          populate : {
            path : 'authorId'
          }
        })

        datas = datas.map(function(obj)  { return obj.booking;});
        
        return sendSuccess(res,`Get ${dataName} succesfully`, datas, datas.length);
    
      } catch (e) {
        console.log(e);
        return sendServerError(res);
      }
};

exports.delete = async (req, res, next) => {
  try {
    const data = await BookingSaved.findOneAndRemove({
      booking: req.params.id,
      user: req.user.user_id,
    });
    return sendSuccess(res, `Delete 1 ${dataName} successfully`, data);
  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

