// const mongoose = require("mongoose");
// const Booking = require('../../../models/booking');
// const readXlsxFile = require('read-excel-file/node')


// const MONGODB_URI= "mongodb+srv://vercel-admin-user:xz3IckPXwH3uyR2t@cluster0.ynhdj.mongodb.net/test"

// function diff_minutes(dt2, dt1) 
//  {
//   // Calculate the difference in milliseconds between the two provided dates and convert it to seconds
//   var diff =(dt2.getTime() - dt1.getTime()) / 1000;
//   // Convert the difference from seconds to minutes
//   diff /= 60;
//   // Return the absolute value of the rounded difference in minutes
//   return Math.abs(Math.round(diff));
//  }

// async function main() {
//     let startTime = new Date();
//     await mongoose
//     .connect(MONGODB_URI, {});
//     console.log('connecting to mongodb successfully -> read booking xlsx...');
    
//     let rows = await readXlsxFile(process.cwd() + '/src/service/recommed_system/data/booking_data.xlsx');
//     console.log('Done read -> save booking ...');

//     rows.shift();
//     let datas = rows.map((row) => {
//         return new Booking({
//             authorId: new mongoose.Types.ObjectId('65333fefdc108ea16cb4007f'),
//             startPointMainText: row[0],
//             startPointAddress: row[1],
//             startPointLat: row[2],
//             startPointLong: row[3],
//             endPointMainText: row[4],
//             endPointAddress: row[5],
//             endPointLat: row[6],
//             endPointLong: row[7],
//             'distance' : row[8],
//             bookingType: row[9],
//             price: row[10],
//             applyNum: row[11],
//             watchedNum: row[12],
//             savedNum: row[13],
//             time: new Date(row[14]),
//             point: row[15],
//             diftAtribute: row[16],
//             interesestValue: row[16] *
//             (row[11] * 0.5 + row[12] * 0.2 + row[13] * 0.3),
//             // userFavorites: [],
//             // userMayFavorites: [],
//         })
//     })
//     let querys = [];
//     datas.forEach(async element =>  {
//         querys.push(element.save());
//     });
//     await Promise.all(querys);

//     // for (let i = 0; i < datas.length; i++) {
//     //     await  datas[i].save();
//     //     console.log(i);
//     // }


//     console.log(`Done: ${diff_minutes(new Date(), startTime)} minutes`);
// }

// // main()

