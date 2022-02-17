module.exports = function (height, weight, impedance, age) {
    let lbm = (height * 9.058 / 100) * (height / 100);
    lbm += weight * 0.32 + 12.226;
    console.log(lbm);
    lbm -= impedance * 0.0068;
    console.log(lbm);
    lbm -= age * 0.0542;
    console.log(age, lbm);
    return lbm;
}