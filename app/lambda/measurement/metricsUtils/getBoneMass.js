const checkOverflow = require("./checkOverflow");

module.exports = function(lbm, sex) {
    let base;
    if (sex === 'f') {
        base = 0.245691014
    } else if (sex === 'm') {
        base = 0.18016894
    }
    
    let boneMass = (base - (lbm * 0.05158)) * -1;

    if (boneMass > 2.2) {
        boneMass += 0.1;
    } else {
        boneMass -= 0.1;
    }
    
    if ((sex === 'f' && boneMass > 5.1) || (sex === 'm' && boneMass > 5.2)) {
        boneMass = 8; // 🤷‍♂️
    }

return checkOverflow(boneMass, 0.5 , 8)
}