import {promises as fs} from "fs";

const lines = (await fs.readFile("./4.txt")).toString().trim().split("\n");
// const lines = `
// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
// `.trim().split("\n");

{
let points = 0;
for(let line of lines){
    let [l,r] = line.split(":")[1].split("|").map(v=>v.trim().split(/\s+/g)).map(v=>new Set(v));
    console.log(l,r);
    let score = 1;
    for(let val of l){
        if(r.has(val)){
            score *= 2;
        }
    }
    if(score !== 1){
        points += score/2;
        console.log(score/2);
    }else{
        console.log("no match");
    }
}
console.log(points);
}

{

const findMatches = function(n){
    const line = lines[n];
    let [l,r] = line.split(":")[1].split("|").map(v=>v.trim().split(/\s+/g)).map(v=>new Set(v));
    let cnt = 0;
    for(let val of l){
        if(r.has(val)){
            cnt++;
        }
    }
    return cnt;
};

let valmap = new Map;

const calculateMatchAt = function(n){
    if(valmap.has(n))return valmap.get(n);
    let cnt = findMatches(n);
    let sum = 0;
    for(let i = n+1; (i < n+1+cnt) && (i < lines.length); i++){
        sum += calculateMatchAt(i);
    }
    valmap.set(n,sum+1);
    return sum+1;
};

let sum = 0;
for(let i = lines.length-1; i >= 0; i--){
    console.log(i);
    sum += calculateMatchAt(i);
}
console.log(sum);
}


