const mongoose = require("mongoose");
const { USER_GENDER, USER_ROLE } = require("../contrants.js");

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  avatarUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/dxoblxypq/image/upload/v1679984586/9843c460ff72ee89d791bffe667e451c_rzalqh.jpg",
    // default link save in cloudinary
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  online: {
    type: Boolean,
    default: false,
  },
  time: { type: Date },
  birthDate: { type: String },
  gender: { type: String, default: "male", enum : USER_GENDER }, // "male" or "female"
  locationId: { type: String, default: "" },
  locationMainText: { type: String, default: "" },
  locationAddress: { type: String, default: "" },
  address: {
    level1: { type: String, default: ""  },
    level2: { type: String, default: ""  },
    level3: { type: String, default: ""  },
    level4: { type: String, default: ""  },
  },
  role: { type: String, default: USER_ROLE.USER, enum : USER_ROLE },
  isCalling: {
    type: Boolean,
    default: false,
  },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
  priorityPoint: {
    type: Number,
    default: 100,
  }
},
{
  timestamps: true,
  toJSON: {
      transform: (doc, obj) => {
        obj.id = obj._id;
        delete obj.__v;
        delete obj._id;
        return obj;
    }
  }
}
);

module.exports = mongoose.model("user", userSchema);
