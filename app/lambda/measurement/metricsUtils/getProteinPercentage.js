const checkOverflow = require("./checkOverflow");

// the original source had an original algorithm and one the author guessed. OG one was defaulted so let's use that
// TODO store both to figure out which one you like better?
module.exports = function (weight, muscleMass, waterPercentage, fatPercentage, boneMass) {
    const useOriginalAlgorithm = true;
    let proteinPercentage;
    if (useOriginalAlgorithm) {
        proteinPercentage = (muscleMass / weight) * 100;
        proteinPercentage -= waterPercentage;
    } else {
        proteinPercentage = 100 - (floor(fatPercentage * 100) / 100);
        proteinPercentage -= floor(waterPercentage * 100) / 100;
        proteinPercentage -= floor((boneMass/weight*100) * 100) / 100;
    }

    return checkOverflow(proteinPercentage, 5, 32);
}