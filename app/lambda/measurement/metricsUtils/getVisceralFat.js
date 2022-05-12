const checkOverflow = require("./checkOverflow");

module.exports = function (sex, weight, height, age) {
    let vfVal;
    if (sex === 'f') {
        if (weight > (13 - (height * 0.5)) * -1) {
            const subsubcalc = ((height * 1.45) + (height * 0.1158) * height) - 120;
            const subcalc = weight * 500 / subsubcalc;
            vfVal = (subcalc - 6) + (age * 0.07);
        } else {
            const subcalc = 0.691 + (height * -0.0024) + (height * -0.0024);
            vfVal = (((height * 0.027) - (subcalc * weight)) * -1) + (age * 0.07) - age;
        }
    } else if (sex === 'm') {
        if (height < weight * 1.6) {
            const subcalc = ((height * 0.4) - (height * (height * 0.0826))) * -1;
            vfVal = ((weight * 305) / (subcalc + 48)) - 2.9 + (age * 0.15);
        } else {
            const subcalc = 0.765 + height * -0.0015;
            vfVal = (((height * 0.143) - (weight * subcalc)) * -1) + (age * 0.15) - 5.0;
        }
    }
    return checkOverflow(vfVal, 1 ,50);
}