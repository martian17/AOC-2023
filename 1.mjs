import {promises as fs} from "fs";

const lines = (await fs.readFile("./1.txt")).toString().trim().split("\n");


const res1 = lines.map(l=>{
    let digits = [];
    for(let c of l){
        if(c.match(/[0-9]/))
            digits.push(c);
    }
    if(digits.length === 0)console.log(l);
    return parseInt(digits[0]+digits[digits.length-1]);
}).reduce((a,b)=>a+b);

console.log(res1);

const digitstrs = "one two three four five six seven eight nine".split(" ");
const valmap = new Map;
for(let i = 1; i <= 9; i++){
    valmap.set(i+"",i);
    valmap.set(digitstrs[i-1],i);
}

console.log(valmap);

const res2 = lines/*["twone"]*/.map(l=>{
    const res = [...l.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|[0-9]))/g)].map(v=>v[1]);
    return valmap.get(res[0])*10+valmap.get(res[res.length-1]);
}).reduce((a,b)=>a+b);

console.log(res2);





