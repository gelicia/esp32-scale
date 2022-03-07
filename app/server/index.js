const express = require("express");
const bodyParser = require("body-parser");
const postgres = require('postgres')
const isCallAuthenticated = require('./authUtils/isCallAuthenticated');
const getLBMCoefficient = require('./metricsUtils/getLBMCoefficient');
const getBMR = require('./metricsUtils/getBMR');
const getFatPercentage = require('./metricsUtils/getFatPercentage');
const getWaterPercentage = require("./metricsUtils/getWaterPercentage");
const getBoneMass = require("./metricsUtils/getBoneMass");
const getMuscleMass = require("./metricsUtils/getMuscleMass");
const getVisceralFat = require("./metricsUtils/getVisceralFat");
const getBMI = require("./metricsUtils/getBMI");
const getProteinPercentage = require("./metricsUtils/getProteinPercentage");

const sql = postgres(process.env.POSTGRESURL);

const router = express.Router();
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key');
    next();
})

app.use("/", router);

router.post('/measurement', isCallAuthenticated, async(request,response) => {
    console.log(request.body);
    const { weight, unit, impedance } = request.body;
    let calcWeight;
    if (unit === "lbs") {
        calcWeight = Math.round(((weight * 0.4536) + Number.EPSILON) * 100) / 100;
    } else {
        calcWeight = weight;
    }

    const users = await sql`select * from users`
    const user = users[0]; // select our one user for now
    
    if (user === undefined) {
        response.status(500);
        response.send({error: true, message:"User profile required to add measurements"});
    } else {
        const birthday = +new Date(user.dateOfBirth);
        const age = ~~((Date.now() - birthday) / (31557600000));
    
        const lbm = getLBMCoefficient(user.height, calcWeight, impedance, age);
        const fatPercentage = getFatPercentage(user.sex, age, calcWeight, user.height, lbm);
        const boneMass = getBoneMass(lbm, user.sex);
        const muscleMass = getMuscleMass(calcWeight, user.sex, fatPercentage, boneMass);
        const waterPercentage = getWaterPercentage(fatPercentage);
    
        const [new_measurement] = await sql`INSERT INTO measurements(weight, impedance, lbm, bmr, "fatPercentage", "waterPercentage", "boneMass", "muscleMass", "visceralFat", bmi, "proteinPercentage", "userId")
            VALUES (${calcWeight}, ${impedance}, ${lbm}, ${getBMR(user.sex, calcWeight, user.height, age)}, ${fatPercentage}, ${waterPercentage}, ${boneMass}, ${muscleMass}, ${getVisceralFat(user.sex, calcWeight, user.height, age)}, ${getBMI(calcWeight, user.height)}, ${getProteinPercentage(calcWeight, muscleMass, waterPercentage, fatPercentage, boneMass)}, ${user.userid})
        
            returning *
            `;
        response.status(200);
        response.send(new_measurement);
    }
});

app.listen(3000,() => {
console.log("Started on PORT 3000");
})