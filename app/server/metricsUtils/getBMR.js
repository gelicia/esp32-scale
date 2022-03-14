const checkOverflow = require("./checkOverflow");

module.exports = function (sex, weight, height, age) {
    let bmr;
    if (sex === 'f') {
        bmr = 864.6 + weight * 10.2036
        bmr -= height * 0.39336
        bmr -= age * 6.204
        bmr = bmr > 2996 ? 5000 : bmr;
    } else if (sex === 'm') {
        bmr = 877.8 + weight * 14.916
        bmr -= height * 0.726
        bmr -= age * 8.976
        bmr = bmr > 2322 ? 5000 : bmr;
    }
    return checkOverflow(bmr, 500, 10000);
}