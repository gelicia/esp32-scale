export function checkOverflow(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    } else { 
        return value;
    }
}