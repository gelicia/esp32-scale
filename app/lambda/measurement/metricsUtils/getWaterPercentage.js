const checkOverflow = require("./checkOverflow");

module.exports = function (fatPercentage) {
    let waterPercentage = (100 - fatPercentage) * 0.7;
    let coefficient = 0.98
    if (waterPercentage <= 50) {
        coefficient = 1.02
    }

    if (waterPercentage * coefficient >=65) {
        waterPercentage = 75;
    }

    return checkOverflow(waterPercentage * coefficient, 35, 75);
}