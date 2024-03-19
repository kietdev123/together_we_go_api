const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");
const { sendSuccess, sendError, sendServerError} = require("../utils/client.js");
const {splitAddress, stringToSlug} = require("../utils/utils.js");
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
      startPointLat: req.body.startPointLat,
      startPointLong: req.body.startPointLong,
      startPointId: req.body.startPointId,
      startPointMainText: req.body.startPointMainText,
      startPointAddress: req.body.startPointAddress,
      // endPoint
      endPointLat: req.body.endPointLat,
      endPointLong: req.body.endPointLong,
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

    await user.save();
    return sendSuccess(res,"Booking added succesfully", result);

  } catch (err) {
    console.log(err);
    return sendServerError(res);
  }
};

exports.getList = async (req, res) => {
  try {
    let user =  await User.findById(req.user.user_id).populate("booking")
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
       
    console.log(timeRange);
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

    // get my list
    if (req.body.type == 'my') {
      filter.push({
        'authorId' : new mongoose.Types.ObjectId(req.user.user_id)
      })
    }

    if (filter.length == 0) filter = {};
    else filter = {
      $and: filter,
    }

    let bookings = await Booking
      .find(filter)
      .sort(_sort)
      .skip(skipNum)
      .limit(pageSize)
      .populate("authorId")
   
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


exports.getMyList = async (req, res) => {
  try {
    let filter = {};
    let {page, pageSize, sortCreatedAt, sortUpdatedAt, status, authorId} = req.query;
    let skipNum = 0;

    if (page) page = Number(page);
    else page = 1

    if (pageSize) pageSize = Number(pageSize);
    else pageSize = 20;

    skipNum = (page - 1) * pageSize;
    if (skipNum < 0) skipNum = 0;

    filter.authorId = new mongoose.Types.ObjectId(req.user.user_id);

    let _sort = {};
    if (sortCreatedAt != null && sortCreatedAt != undefined && sortCreatedAt != '')
       _sort.createdAt = Number(sortCreatedAt);

    if (sortUpdatedAt != null && sortUpdatedAt != undefined && sortUpdatedAt != '')
       _sort.updatedAt = Number(sortUpdatedAt);

    const bookings = await Booking
    .find(filter)
    .sort(_sort)
    .skip(skipNum)
    .limit(pageSize)
    .populate("authorId")
    
    return sendSuccess(res,"Get bookings succesfully", bookings, bookings.length);

  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};

exports.getOne = async (req, res) => {
  try {
    const {id} = req.params;
    const booking = await Booking.findById(id).populate("authorId");
    return sendSuccess(res, "Get 1 booking successfully", booking);
  } catch (e) {
    console.log(e);
    return sendServerError(res);
  }
};