exports.handler = async (event, context, cb) => {
    const { Client } = require('pg');
    const AWS = require('aws-sdk');
    const getLBMCoefficient = require('./metricsUtils/getLBMCoefficient');
    const getBMR = require('./metricsUtils/getBMR');
    const getFatPercentage = require('./metricsUtils/getFatPercentage');
    const getWaterPercentage = require("./metricsUtils/getWaterPercentage");
    const getBoneMass = require("./metricsUtils/getBoneMass");
    const getMuscleMass = require("./metricsUtils/getMuscleMass");
    const getVisceralFat = require("./metricsUtils/getVisceralFat");
    const getBMI = require("./metricsUtils/getBMI");
    const getProteinPercentage = require("./metricsUtils/getProteinPercentage");

    const jsonHeaders = {
        'Content-Type': 'application/json',
    };

    try {
        const client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: 5432
        });
        await client.connect();
        const { weight, unit, impedance } = JSON.parse(event.body);
        let calcWeight;
        if (unit === "lbs") {
            calcWeight = Math.round(((weight * 0.4536) + Number.EPSILON) * 100) / 100;
        }
        else {
            calcWeight = weight;
        }

        const res = await client.query('select * from users');
        if (res.rows.length === 0) {
            client.end();
            return {
                statusCode: 400,
                body: JSON.stringify({ error: true, message: "User profile required to add measurements" }),
                headers: jsonHeaders
            };
        }

        const user = res.rows[0];
        const birthday = +new Date(user.dateOfBirth);
        const age = ~~((Date.now() - birthday) / (31557600000));

        const lbm = getLBMCoefficient(user.height, calcWeight, impedance, age);
        const bmr = getBMR(user.sex, calcWeight, user.height, age);
        const fatPercentage = getFatPercentage(user.sex, age, calcWeight, user.height, lbm);
        const boneMass = getBoneMass(lbm, user.sex);
        const muscleMass = getMuscleMass(calcWeight, user.sex, fatPercentage, boneMass);
        const visceralFat = getVisceralFat(user.sex, calcWeight, user.height, age);
        const bmi = getBMI(calcWeight, user.height);
        const waterPercentage = getWaterPercentage(fatPercentage);
        const proteinPercentage = getProteinPercentage(calcWeight, muscleMass, waterPercentage, fatPercentage, boneMass);

        const insertStmt = 'INSERT INTO measurements(weight, impedance, lbm, bmr, "fatPercentage", "waterPercentage", "boneMass", "muscleMass", "visceralFat", bmi, "proteinPercentage", "userId") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
        const values = [calcWeight, impedance, lbm, bmr, fatPercentage, waterPercentage, boneMass, muscleMass, visceralFat, bmi, proteinPercentage, user.userid];

        const insertRes = await client.query(insertStmt, values);
        client.end();
        return { statusCode: 200, body: JSON.stringify(insertRes.rows[0]), headers: jsonHeaders };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: err.message
        };
    }
};
