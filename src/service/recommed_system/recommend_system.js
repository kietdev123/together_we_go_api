const { BOOKING_STATUS } = require('../../contrants');
const Booking = require('../../models/booking');
const { getBookingSimWithInput } = require('./utils');
let increaseFator = 0.01;
let decreaseFator = 0.01;
let minForDriftAtribute = -1;
let minICV = -1;

exports.recommedBookings = async (input) => {
    try {
        // startPointLat, startPointLong, endPointLat, endPointLong, time
        // get from kdTreeForRecommend
        let bookings = await Booking.aggregate([
            {
                $match:
                {
                    status: BOOKING_STATUS.available,
                }
            },
            {

                $project: {
                    'startPointLat': 1,
                    'startPointLong': 1,
                    'endPointLat': 1,
                    'endPointLong': 1,
                    'time': 1,
                }
            },
        ]);

        bookings = getBookingSimWithInput(bookings, input, 10);

        return bookings;
    } catch (err) {
        throw (err);
    }
}

exports.calculateICVForNewItem = async (booking) => {
    try {

        // retrive: get similarity case-base - booking
        let bookings = await Booking.aggregate([
            {
                $match:
                {
                    status: BOOKING_STATUS.complete,
                }
            },
            {
                $project: {
                    'startPointLat': 1,
                    'startPointLong': 1,
                    'endPointLat': 1,
                    'endPointLong': 1,
                    'time': 1,
                    'point': 1,
                    'price' :1,
                    'bookingType': 1,
                    'interesestValue' : 1,
                }
            },
        ]);
        bookings = getBookingSimWithInput(bookings, booking, 10);

        let sum_sim = 0, icv = 0;
        for (let i = 0; i < bookings.length; i++){
            icv += bookings[i].dis * bookings[i].interesestValue;
            sum_sim += bookings[i].dis;
        }
      
        // reuse: 
        booking.interesestConfidenceValue = icv / sum_sim;

        await booking.save();

        // Revise decreaseAllDriftAtribute
        await Booking.updateMany({
            status: BOOKING_STATUS.complete,
        }, {
            $inc: { diftAtribute: decreaseFator }
        });

    } catch (error) {
        throw error;
    }

}

// revise solution = user intrestest
exports.updateCaseBaseSolution = async (id, value) => {
    try {
        // check this booking is case before 
        let booking = await Booking.findById(id);
        // like - numWatch numSaved numApply always increanse
        // hate - ignore
        // increase/decrease drift Atribute
        if (value == "numWatch" || value == "numSaved" || value == "numApply") {
            booking.diftAtribute += increaseFator;
        }
        else {
            booking.diftAtribute -= decreaseFator;
        }

        // cal iv
        booking.interesestValue = booking.diftAtribute *
            (booking.applyNum * 0.5 + booking.watchedNum * 0.2 + booking.savedNum * 0.3);


        await booking.save();
    } catch (error) {
        throw error;
    }

}

// retain
exports.saveNewCaseBase = async (id) => {
    try {
        let booking = await Booking.findById(id);
        // cal iv
        booking.interesestValue = booking.diftAtribute *
            (booking.applyNum * 0.5 + booking.watchedNum * 0.2 + booking.savedNum * 0.3);
        await booking.save();
    } catch (error) {
        throw error;
    }

}


