const Booking = require("../models/booking.js");
const BookingVector = require("../models/booking_vector.js");
const Apply = require("../models/apply.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const {splitAddress, stringToSlug,  geoHash,
  timeDifference,
  compareGeohashes,} = require("../utils/utils.js");
const {BOOKING_STATUS} = require("../contrants.js");

exports.create = async (req, res) => {
  try {
    let user = await User.findById(req.user.user_id);

    const booking = new Booking({
      authorId: req.user.user_id,
      price: req.body.price,
      status: BOOKING_STATUS.available,
      bookingType: req.body.bookingType,
      time: new Date(req.body.time),
      content: req.body.content,
      // startPoint
      startPointLat: Number(req.body.startPointLat),
      startPointLong: Number(req.body.startPointLong),
      startPointId: req.body.startPointId,
      startPointMainText: req.body.startPointMainText,
      startPointAddress: req.body.startPointAddress,
      // endPoint
      endPointLat: Number(req.body.endPointLat),
      endPointLong: Number(req.body.endPointLong),
      endPointLatLng: req.body.endPointLng,
      endPointId: req.body.endPointId,
      endPointMainText: req.body.endPointMainText,
      endPointAddress: req.body.endPointAddress,
      //
      duration: req.body.duration,
      distance: req.body.distance,
      startAddress: splitAddress(req.body.startPointMainText, req.body.startPointAddress),
      endAddress: splitAddress(req.body.endPointMainText, req.body.endPointAddress),
      point: user.priorityPoint
    });
    
    let result = await booking.save();
    user.booking = result.id;
    
    await Promise.all([
      user.save(),
      BookingVector.create({
        startPointGeoHash : geoHash(Number(req.body.startPointLat),Number(req.body.startPointLong),),
        endPointGeoHash : geoHash(Number(req.body.endPointLat),Number(req.body.endPointLong),),
        "time" :  new Date(req.body.time),
        booking: result.id,
      })
    ]);
    
    return sendSuccess(res,"Booking added succesfully", result);

  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.update = async (req, res) => {
  try {
    const {id} = req.params;
    let booking = null;
        await Promise.all([
      Booking.findByIdAndUpdate(id, {
        authorId: req.user.user_id,
        price: req.body.price,
        // status: req.body.status,
        bookingType: req.body.bookingType,
        time: new Date(req.body.time),
        content: req.body.content,
        // startPoint
        startPointLat: Number(req.body.startPointLat),
        startPointLong: Number(req.body.startPointLong),
        startPointId: req.body.startPointId,
        startPointMainText: req.body.startPointMainText,
        startPointAddress: req.body.startPointAddress,
        // endPoint
        endPointLat: Number(req.body.endPointLat),
        endPointLong: Number(req.body.endPointLong),
        endPointLatLng: req.body.endPointLng,
        endPointId: req.body.endPointId,
        endPointMainText: req.body.endPointMainText,
        endPointAddress: req.body.endPointAddress,
        //
        duration: req.body.duration,
        distance: req.body.distance,
        startAddress: splitAddress(req.body.startPointMainText, req.body.startPointAddress),
        endAddress: splitAddress(req.body.endPointMainText, req.body.endPointAddress),
        //point: user.priorityPoint
      }).populate("authorId").then((value) => {
        booking = value;
      }),
      BookingVector.findOneAndUpdate({
        'booking': new mongoose.Types.ObjectId(id),
      },{
        startPointGeoHash : geoHash(Number(req.body.startPointLat),Number(req.body.startPointLong),),
        endPointGeoHash : geoHash(Number(req.body.endPointLat),Number(req.body.endPointLong),),
        "time" :  new Date(req.body.time),
        // booking: result.id,
      })
     ]); 

    return sendSuccess(res,"Booking update succesfully", booking);

  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.getList = async (req, res) => {
  try {
    
    let filter = [];
    let {
      page, pageSize, 
      keyword,
      //sortCreatedAt, sortUpdatedAt, 
      status, authorId, 
      minPrice, maxPrice,
      startAddress, endAddress,
      startTime, endTime,
      bookingType,
      isFavorite,
      isMayFavorite,
      isMine,
      id,
    } = req.query;
    console.log(req.query);
    startAddress = stringToSlug(startAddress)
    endAddress = stringToSlug(endAddress)

    let skipNum = 0;

    if (page) page = Number(page);
    else page = 1

    if (pageSize) pageSize = Number(pageSize);
    else pageSize = 20;

    skipNum = (page - 1) * pageSize;
    if (skipNum < 0) skipNum = 0;
    
    if (id != null && id != undefined && id != '') 
      filter.push({  "_id": new mongoose.Types.ObjectId(id) });
    if (isFavorite != null && isFavorite != undefined && isFavorite != '') 
      filter.push({ 'isFavorite' : isFavorite === 'true'});
    if (isMayFavorite != null && isMayFavorite != undefined && isMayFavorite != '') 
      filter.push({ 'isMayFavorite' : isMayFavorite === 'true'});
    if (isMine != null && isMine != undefined && isMine != ''){
      if (isMine === 'true') {
        filter.push({
          'authorId' : new mongoose.Types.ObjectId(req.user.user_id)
        })
      }
      else {
        filter.push({
          $nor: [{
          'authorId' : new mongoose.Types.ObjectId(req.user.user_id)
        }]})
      }
    }
      
    if (bookingType != null && bookingType != undefined && bookingType != '') 
      filter.push({ 'bookingType' : bookingType});
    if (status != null && status != undefined && status != '') 
      filter.push({ 'status' : status});
    if (authorId != null && authorId != undefined && authorId != '') 
      filter.push({ 'authorId' : new mongoose.Types.ObjectId(authorId)});
    
    let priceRange = {}

    if (minPrice != null && minPrice != undefined && minPrice != '') {
        minPrice = Number(minPrice);
        priceRange["$gte"] = minPrice;
    }
       
   
    if (maxPrice != null && maxPrice != undefined && maxPrice != '') {
      maxPrice = Number(maxPrice);
      priceRange["$lte"] = maxPrice;
    }
      
   
    if ( Object.keys(priceRange).length > 0)
       filter.push({'price' : priceRange});


    if ( keyword != null &&  keyword != undefined &&  keyword != '') {
        filter.push({
          $text: {$search: keyword,  
            $caseSensitive: false,
            $diacriticSensitive: false}
        })
      } 
      
    if ( startAddress != null &&  startAddress != undefined &&  startAddress != '') {

      filter.push({
        $or: [
          {'startPointMainText' : { $regex: startAddress, $options: 'i' } },
          {'startPointAddress' : { $regex: startAddress, $options: 'i' } },
        ]
      })
    } 

    if ( endAddress != null &&  endAddress != undefined &&  endAddress != '') {
      filter.push({
        $or: [
          {'endPointMainText' : { $regex: endAddress, $options: 'i' } },
          {'endPointAddress' : { $regex: endAddress, $options: 'i' } },
        ]
      })
    } 
      
    let timeRange = {}

    if (startTime != null && startTime != undefined && startTime != '') {
        timeRange["$gte"] = new Date(startTime);
    }
          
    if (endTime != null && endTime != undefined && endTime != '') {
      timeRange["$lte"] = new Date(endTime);
    }
       

    if ( Object.keys(timeRange).length > 0)
      filter.push({'createdAt' : timeRange});
 
    let _sort = {
      'status': -1,
      'point' : -1,
      'createdAt' : -1,
    };

    // if (sortCreatedAt != null && sortCreatedAt != undefined && sortCreatedAt != '')
    //    _sort.createdAt = Number(sortCreatedAt);

    // if (sortUpdatedAt != null && sortUpdatedAt != undefined && sortUpdatedAt != '')
    //    _sort.updatedAt = Number(sortUpdatedAt);

    console.log(filter);

    if (filter.length == 0) filter = {};
    else filter = {
      $and: filter,
    }

    let bookings = await Booking.aggregate([
      {
        $addFields: {
          isFavorite: {
            $cond: { // Conditionally set isHave based on the presence of value_x in users
              if: { $in: [req.user.user_id, "$userFavorites"]}, // Check if value_x exists in the users array
              then: true, // Set isHave to true if value_x exists
              else: false // Set isHave to false otherwise
            }
          },
          isMayFavorite: {
            $cond: { // Conditionally set isHave based on the presence of value_x in users
              if: { $in: [req.user.user_id, "$userMayFavorites"]}, // Check if value_x exists in the users array
              then: true, // Set isHave to true if value_x exists
              else: false // Set isHave to false otherwise
            }
          }
        }
        
      },
    { $match: filter }, // Match documents based on the filter
    { $sort: _sort }, // Sort the matched documents
    { $skip: skipNum }, // Skip documents for pagination
    { $limit: pageSize }, // Limit the number of documents per page
    { $lookup: { // Populate the "authorId" field
        from: "users", // Assuming "authors" is the collection name
        localField: "authorId",
        foreignField: "_id",
        as: "authorId"
      }
    },
    { $unwind: "$authorId" } // Deconstruct the "author" array
  ]);
   
    // let user =  await User.findById(req.user.user_id).populate("booking")
    // if (bookings.length == 0) {
    //    // case-based knowledge-based recommender
       
    //    if (user.booking != null && user.booking != undefined) {
    //     filter = []
    //      // find similiar with booking that user last notice
    //     filter.push({
    //       $or: [
    //         {'startPointMainText' : { $regex: `/${user.booking.startAddress.level2}/`, $options: 'i' } },
    //         {'startPointAddress' : { $regex: `/${user.booking.startAddress.level2}/`, $options: 'i' } },

    //         {'startPointMainText' : { $regex: `/${user.booking.startAddress.level3}/`, $options: 'i' } },
    //         {'startPointAddress' : { $regex: `/${user.booking.startAddress.level3}/`, $options: 'i' } },

    //         {'endPointMainText' : { $regex: `/${user.booking.endAddress.level2}/`, $options: 'i' } },
    //         {'endPointAddress' : { $regex: `/${user.booking.endAddress.level2}/`, $options: 'i' } },

    //         {'endPointMainText' : { $regex: `/${user.booking.endAddress.level3}/`, $options: 'i' } },
    //         {'endPointAddress' : { $regex: `/${user.booking.endAddress.level3}/`, $options: 'i' } },
    //       ]
    //     })

    //     if (filter.length == 0) filter = {};
    //     else filter = {
    //       $and: filter,
    //     }
    //     bookings = await Booking
    //     .find(filter)
    //     .sort(_sort)
    //     .skip(skipNum)
    //     .limit(pageSize)
    //     .populate("authorId")
    //   }
    // }

    // const local = new Date().toLocaleString("en-US", {timeZone: 'Asia/Bangkok'});
    // const currentHour = new Date(local).getHours();  

    // if (bookings.length == 0) {
    //   // constraint-based knowledge-based recommender
    //   filter = []

    //   let address = user.address.level4;  
    //   if (currentHour >= 6 && currentHour <= 12) {
    //     address = user.address[user.addressArea.morning];
    //   }
    //   else if (currentHour > 12 && currentHour <= 18) {
    //     address = user.address[user.addressArea.afternoon];
    //   }
    //   else {
    //     address = user.address[user.addressArea.night];
    //   }

    //   filter.push({
    //     $or: [
    //       {'startPointMainText' : { $regex: `/${address}/`, $options: 'i' } },
    //       {'startPointAddress' : { $regex: `/${address}/`, $options: 'i' } },

    //       {'startPointMainText' : { $regex: `/${address}/`, $options: 'i' } },
    //       {'startPointAddress' : { $regex: `/${address}/`, $options: 'i' } },

    //       {'endPointMainText' : { $regex: `/${address}/`, $options: 'i' } },
    //       {'endPointAddress' : { $regex: `/${address}/`, $options: 'i' } },

    //       {'endPointMainText' : { $regex: `/${address}/`, $options: 'i' } },
    //       {'endPointAddress' : { $regex: `/${address}/`, $options: 'i' } },
    //     ]
    //   })
    //   if (filter.length == 0) filter = {};
    //   else filter = {
    //     $and: filter,
    //   }
    //   bookings = await Booking
    //   .find(filter)
    //   .sort(_sort)
    //   .skip(skipNum)
    //   .limit(pageSize)
    //   .populate("authorId")
    // }
    
    // // Critique Methods
    // let newLevel = "";

    // if ( startAddress.includes(user.address.level4) || 
    //   endAddress.includes(user.address.level4) ) newLevel = "level4"; 

    // if ( startAddress.includes(user.address.level3) || 
    //   endAddress.includes(user.address.level3) ) newLevel = "level3"; 

    // if ( startAddress.includes(user.address.level2) || 
    //   endAddress.includes(user.address.level2) ) newLevel = "level2";
    
    // if ( startAddress.includes(user.address.level1) || 
    //   endAddress.includes(user.address.level1) ) newLevel = "level1";
      
    // if (newLevel != "") {
    //   if (currentHour >= 6 && currentHour <= 12) {
    //     user.addressArea.morning = newLevel;
    //   }
    //   else if (currentHour > 12 && currentHour <= 18) {
    //     user.addressArea.afternoon = newLevel;
    //   }
    //   else {
    //     user.addressArea.night = newLevel;
    //   }
    //   await user.save();
    // }
    

    return sendSuccess(res,"Get bookings succesfully", bookings, bookings.length);

  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.getRecommend = async (req, res) => {
  try {
    let input = {
      // Đông Hòa Dĩ An, Bình Dương
      startPointGeoHash : geoHash(Number(req.query.startPointLat),Number(req.query.startPointLong),),
      endPointGeoHash : geoHash(Number(req.query.endPointLat),Number(req.query.endPointLong),),
      "time" : new Date(req.query.time),
    }

    let bookingVectors = await BookingVector.find().lean();

      // calculate distance between vectors
    for (let i = 0; i < bookingVectors.length; i++) {
      let startPointDis = compareGeohashes(input.startPointGeoHash,bookingVectors[i].startPointGeoHash );
      
      let endPointDis = compareGeohashes(input.endPointGeoHash, bookingVectors[i].endPointGeoHash);

      let timeDis = timeDifference(input.time, bookingVectors[i].time);

      // console.log(startPointDis, endPointDis, timeDis);

      let dis = startPointDis * startPointDis + endPointDis * endPointDis + timeDis * timeDis;

      dis = Math.sqrt(dis);

      bookingVectors[i].dis = dis;
    }


    bookingVectors.sort(function compare(a, b) {
      return a.dis < b.dis;
    })

   
    let bookingIds = bookingVectors.slice(0, 5).map((value) => {return value.booking;});
    console.log(bookingIds);
    let bookings = await Booking.find(
      {'_id':{$in: bookingIds}},
    ).populate("authorId");

    // return sendSuccess(res,"Get recommend bookings succesfully", bookings, bookings.length);

    res.status(200).json({
      success: true,
      message: "Get recommend bookings succesfully",
      distance: bookingVectors.slice(0, 5).map((value) => {return value.dis;}),
      data: bookings,
      total:  bookings.length,
    })
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};


exports.delete = async (req, res) => {
  try {
    const {id} = req.params;

    const applys = await Apply.find({'booking' : id}).lean();
    const applyIds = applys.map((apply) => apply._id);

    await Promise.all([
      Booking.findByIdAndDelete(id),
      BookingVector.findOneAndDelete({booking: id}),
      Apply.deleteMany({'_id':{'$in':applyIds}}),
      Review.deleteMany({'apply':{'$in':applyIds}}),
    ]);
    await Booking.findByIdAndDelete(id);
    return sendSuccess(res, "Delete 1 booking successfully");
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};