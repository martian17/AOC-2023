import {promises as fs} from "fs";

const lines = (await fs.readFile("./2.txt")).toString().trim().split("\n");
// const lines = `
// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
// `.trim().split("\n");

const maxmap = {
    red: 12,
    green: 13,
    blue: 14
};


const roundPossible = function(round){
    for(let v of round.split(",")){
        let [n,col] = v.trim().split(" ");
        n = parseInt(n);
        if(n > maxmap[col]){
            return false;
        }
    }
    return true;
}

let sum = 0;
for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    let [id,rest] = line.split(": ");
    id = parseInt(id.trim().split(" ")[1]);
    if(rest.split(";").map(round=>roundPossible(round)).reduce((a,b)=>a&b)){
        sum += id;
    }
}

console.log(sum);



const findPower = function(game){
    const maxvals = {
        red: 0,
        green: 0,
        blue: 0
    }
    for(let round of game.split(";")){
        for(let v of round.split(",")){
            let [n,col] = v.trim().split(" ");
            n = parseInt(n);
            if(n > maxvals[col]){
                maxvals[col] = n;
            }
        }
    }
    return maxvals.red*maxvals.blue*maxvals.green;
}

const log = function(val){
    console.log(val);
    return val;
}

let sum2 = 0;
for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    let [id,rest] = line.split(": ");
    sum2 += findPower(rest);
}

console.log(sum2);



