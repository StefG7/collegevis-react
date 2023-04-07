
// Given two arrays, calculate their edit distance
// Return -1 if there's no shared element between the two arrays
// Each add or delete from the array adds 1 to the distance
export default function EditDist(arr1, arr2) {
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