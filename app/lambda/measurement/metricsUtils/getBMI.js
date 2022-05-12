const checkOverflow = require("./checkOverflow");

// ugh
module.exports = function (weight, height) {
    return checkOverflow(weight/((height/100)*(height/100)), 10, 90);
}