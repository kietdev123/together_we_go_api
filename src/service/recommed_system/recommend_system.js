const { BOOKING_STATUS } = require('../../contrants');
const Booking = require('../../models/booking');
const { getBookingSimWithInput } = require('./utils');
let increaseFator = 0.97;
let decreaseFator = 0.97;
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
                    isReal: true,
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
                    'isCaseBased': 1
                }
            },
        ]);

        let news = bookings.filter((e) => { return e.isCaseBased == false });
        let olds = bookings.filter((e) => { return e.isCaseBased == true });

        let numNew = 7, numOld = 3;
        if (olds.length < numOld) {
            numNew += numOld - olds.length;
            numOld = olds.length;
        }
        if (news.length < numNew) numNew = news.length;

        news = getBookingSimWithInput(news, input, numNew);
        olds = getBookingSimWithInput(olds, input, numOld);

        return { news, olds };
    } catch (err) {
        throw (err);
    }
}

exports.calculateICVForNewItem = async (booking) => {
    try {

        // retrive: get similarity case-base - booking
        // booking : isCaseBased = true
        let bookings = await Booking.aggregate([
            {
                $match:
                {
                    isCaseBased: true,
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
            isCaseBased: true,
        }, {
            diftAtribute: { $multiply: ["$diftAtribute", decreaseFator] }
        });

        await Booking.deleteMany({
            diftAtribute: { $lt: minForDriftAtribute },
        })
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
            booking.diftAtribute /= increaseFator;
        }
        else {
            booking.diftAtribute *= decreaseFator;
        }

        // cal iv
        booking.interesestValue = booking.diftAtribute *
            (booking.applyNum * 0.5 + booking.watchedNum * 0.2 + booking.savedNum * 0.3);

        // if drift Atribute < minForDriftAtribute -> delete
        if (booking.diftAtribute < minForDriftAtribute) {
            if (booking.isReal == true) {
                booking.isCaseBased = false;
            }
            else {
                // delete
            }
        }

        await booking.save();
    } catch (error) {
        throw error;
    }

}

// retain
exports.saveNewCaseBase = async (id, value) => {
    try {
        let booking = await Booking.findById(id);
        booking.isCaseBased = true;
        // cal iv
        booking.interesestValue = booking.diftAtribute *
            (booking.applyNum * 0.5 + booking.watchedNum * 0.2 + booking.savedNum * 0.3);
        await booking.save();
    } catch (error) {
        throw error;
    }

}


