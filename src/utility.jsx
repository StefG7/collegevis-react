
// Given two arrays, calculate their edit distance
// Return -1 if there's no shared element between the two arrays
// Each add or delete from the array adds 1 to the distance
export function EditDist(arr1, arr2) {
    let dist = 0;

    for (let i = 0; i < arr1.length; i++){
        if (!arr2.includes(arr1[i])){
            dist++;
        }
    }
    
    for (let i = 0; i < arr2.length; i++){
        if (!arr1.includes(arr2[i])){
            dist++;
        }
    }

    if (dist == arr1.length + arr2.length) {
        return -1;
    }

    return dist;
}

// Interpolation for state transition page
// given [x1, x2] and [y1, y2] and y (between y1 and y2), provide x between x1 and x2 
export function linearInterpolation(x1, x2, y1, y2, y) {
    let percentage = (y - y1) / (y2 - y1);
    return (x2 - x1) * percentage + x1;
} 