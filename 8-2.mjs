import {promises as fs} from "fs";
import {FIFOQueue as Queue} from "./util.mjs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./8.txt")).toString();
    break;
    case 2:
text = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`;
    break;
}

text = text.trim();


const findCycles = function(mapping,start,directions){
    let loc = start;
    let visited = new Map;
    let cnt = 0;
    let zlocs = [];
    while(true){
        for(let dpos = 0; dpos < directions.length; dpos++){
            if(loc[2] === "Z")zlocs.push(cnt);
            let id = loc+dpos;
            if(visited.has(id))return [visited.get(id),cnt,zlocs];
            visited.set(id,cnt)
            const d = directions[dpos] === "L"?0:1;
            loc = mapping.get(loc)[d];
            cnt++;
        }
    }
}

const eucdiv = function(a,b){
    const r = a%b;
    const q = (a-r)/b;
    return [q,r];
}

const findGCD = function(a,b){
    let rn = a;
    let rn1 = b;
    let sn = 1;
    let sn1 = 0;
    let tn = 0;
    let tn1 = 1;
    while(rn1 !== 0){
        let [q,r] = eucdiv(rn,rn1);
        [rn,rn1] = [rn1,rn-q*rn1];
        [sn,sn1] = [sn1,sn-q*sn1];
        [tn,tn1] = [tn1,tn-q*tn1];
    }
    if(rn < 0){
        rn = -rn;
        sn = -sn;
        tn = -tn;
    }
    return [rn,sn,tn];
}

const modulo = function(a,b){
    let r = a%b;
    if(r < 0)return r+b;
    return r;
}

let findCommonPeriod = function([z1,p1],[z2,p2]){
    //z1+s*p1 === z2+t*p2
    const [gcd,s0,t0] = findGCD(p1,-p2);
    const commonPeriod = p1*p2/gcd
    const k = (z2-z1)/gcd;
    let s = s0*k;
    let t = t0*k;
    return [modulo(z1+s*p1,commonPeriod),commonPeriod];
}

const findLCM = function(a,b){
    const [gcd] = findGCD(a,b);
    console.log(a,b,gcd);
    return a*b/gcd;
}

const problem2 = function(text){
    let [directions,mapping] = text.split("\n\n");
    directions = directions.trim();
    mapping = mapping.trim().split("\n").map(l=>{
        let [a,b,c] = l.match(/[A-Z0-9]{3}/g);
        return [a,[b,c]];
    });
    mapping = new Map(mapping);
    let startLocations = [...mapping.keys()].filter(v=>v[2]==="A");
    console.log(startLocations);
    let cycles = startLocations.map(start=>findCycles(mapping,start,directions)).map(([s,e,zlocs])=>[zlocs[0],e-s]);
    console.log(cycles);
    console.log(cycles.map(v=>v[0]).reduce((a,b)=>findLCM(a,b)));
}

problem2(text);
