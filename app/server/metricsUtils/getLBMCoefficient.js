export function getLBMCoefficient(height, weight, impedance, age) {
    let lbm = (height * 9.058 / 100) * (height / 100);
    lbm += weight * 0.32 + 12.226;
    lbm -= impedance * 0.0068;
    lbm -= age * 0.0542;
    return lbm;
}