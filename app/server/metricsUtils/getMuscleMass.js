const checkOverflow = require("./checkOverflow");

module.exports = function (weight, sex, fatPercentage, boneMass) {
    let muscleMass = weight - ((fatPercentage * 0.01) * weight) - boneMass;
    if ((sex === 'f' && muscleMass >= 84) || (sex === 'm' && muscleMass >= 93.5)) {
        muscleMass = 120;
    }

    return checkOverflow(muscleMass, 10 ,120);
}