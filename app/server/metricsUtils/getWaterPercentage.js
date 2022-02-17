const checkOverflow = require("./checkOverflow");

module.exports = function (fatPercentage) {
    let waterPercentage = (100 - fatPercentage) * 0.7;
    let coefficient = 0.98
    if (waterPercentage <= 50) {
        coefficient = 1.02
    }
    let total =  waterPercentage * coefficient;
    total = total >= 65 ? 75 * coefficient : total;
    return checkOverflow(total, 35, 75);
}