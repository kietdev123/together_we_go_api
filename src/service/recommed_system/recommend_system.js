const readXlsxFile = require('read-excel-file/node')
const ubilabs = require()
class RecommendSystem {
    constructor(increaseFator, decreaseFator, minForDriftAtribute, minICV) {
        // use to update driftAttribute when user like item
        this.increaseFator = increaseFator;

        // use to update driftAttribute when user hate item
        this.decreaseFator = decreaseFator;

        this.minForDriftAtribute = minForDriftAtribute;
        this.minICV = minICV;
        this.isTraining = false;
    }
    
    async train() {
        console.log("Starting training...");
        this.isTraining = true;
        this.kdTreeForRecommmedNews = 1;
        this.kdTreeForRecommedOlds = 1;

        this.kdTreeCaseBase = 1;

        this.isTraining = false;
        console.log("Done training...");
    }

    recommed(startPointLat, startPointLong, endPointLat, endPointLong, time){
        let news = [];
        let olds = [];
        // get from kdTreeForRecommend
        
        
        return { news, olds };
    }

    calculateICVForNewItem(booking){
        // retrive: get similarity case-base - booking
        // reuse: 
    }
    // Manage case base
    // retrive - get
    // retain - add
    // revise - update
    // matain - delete
}


async function main(){
    const _recommedSystem = new RecommendSystem(0.97, 0.97, -1, -1);

    let rows = await readXlsxFile(process.cwd() + '/src/service/recommed_system/data/booking_data.xlsx');
    rows.shift();
    let datas = rows.map((row) => {
        return {
            startPointMainText: row[0],
            startPointAddress: row[1],
            startPointLat: row[2],
            startPointLong: row[3],
            endPointMainText: row[4],
            endPointAddress: row[5],
            endPointLat: row[6],
            endPointLong: row[7],
            'distance' : row[8],
            bookingType: row[9],
            price: row[10],
            applyNum: row[11],
            watchedNum: row[12],
            savedNum: row[13],
            time: new Date(row[14]),
            point: row[15],
        }
    })
    console.log(datas[0]);
}
main()
// exports.recommedSystem = _recommedSystem