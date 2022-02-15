import {getLBMCoefficient} from './getLBMCoefficient';
import {checkOverflow} from './checkOverflowcheckOverflow';

function getFatPercentage(sex, age, weight, height, impedance) {
    let lbmModifier = 0.8;
    if (sex==="f") {
        if (age <= 49) {
            lbmModifier = 9.25;
        } else if (age > 49) {
            lbmModifier = 7.25;
        }
    }

    let coefficient = 1;
    if (sex ==="f") {
        // I don't understand why height doesn't matter only if youre between 50 and 60 kg but whatever?
        if (weight > 60) {
            coefficient = height > 160 ? 0.9888 : 0.96;
        } else if (weight < 50) {
            coefficient = height > 160 ? 1.0506 : 1.02;
        }
    } else if (sex === "m" && weight < 61) {
        coefficient = 0.98
    }

    const lbm = getLBMCoefficient( height, weight, impedance, age) - lbmModifier;
    const fatPercentage = (1.0 - (((lbm) * coefficient) / weight)) * 100;
    // changing everything above 63% to 75% seems weird...
    return checkOverflow(fatPercentage > 63 ? 75 : fatPercentage, 5, 75);
}