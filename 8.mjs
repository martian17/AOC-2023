import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./8.txt")).toString();
    break;
    case 2:
text = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;
    break;
    case 3:
text = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;
    break;
}


let [header,body] = text.trim().split("\n\n");
console.log(header,body);


const problem1 = function(header,body){
    const rls = header.trim().split("").map(v=>v==="L"?0:1);
    let map = body.trim().split("\n").map(l=>{
        let [src,dests] = l.split("=").map(v=>v.trim());
        dests = dests.match(/[^(), ]+/g);
        return [src,dests];
    });
    map = new Map(map);
    console.log(map);
    let loc = "AAA";
    let cnt = 0;
    console.log(rls.length);
    while(true){
        for(let rl of rls){
            let next = map.get(loc)[rl];
            console.log(next);
            cnt++;
            if(next === "ZZZ")return cnt;
            loc = next;
        }
    }
}

//console.log(problem1(header,body));

const extendedGcd = function(a,b){
    if(b === 0){
        return [a,1,0];
    }else{
        const [gcd, x, y] = extendedGcd(b,a%b);
        return [gcd, y, x - Math.floor(a/b)*y]
    }
}

const findMatchingPeriod = function(s1,p1, s2,p2){
    const [gcd, x, y] = extendedGcd(p1,p2);
}

const problem2 = function(header,body){
    const rls = header.trim().split("").map(v=>v==="L"?0:1);
    let map = body.trim().split("\n").map(l=>{
        let [src,dests] = l.split("=").map(v=>v.trim());
        dests = dests.match(/[^(), ]+/g);
        return [src,dests];
    });
    map = new Map(map);
    console.log(map);

    const starts = [...map.keys()].filter(v=>v[2] === "A");

    const onceZs = [];
    const cycleZs = [];
    const findCycles = function(start){
        const zs = [];
        let loc = start;
        let cnt = 0;
        let cycleStart = 0;
        let cycleLength = 0;
        const passed = new Map;
        outer:
        while(true){
            for(let i = 0; i < rls.length; i++){
                console.log(loc+i);
                let rl = rls[i];
                if(loc[2] === "Z")zs.push(cnt);
                if(passed.has(loc+i)){
                    cycleStart = passed.get(loc+i);
                    cycleLength = cnt-cycleStart;
                    break outer;
                }
                passed.set(loc+i,cnt);

                loc = map.get(loc)[rl];
                cnt++;
            }
        }
        console.log(cycleStart,cycleLength);
        console.log(zs);
        for(let cnt of zs){
            if(cnt < cycleStart){
                onceZs.push([start,cnt]);
            }else{
                cycleZs.push([start,cnt,cycleLength]);
            }
        }
    }
    for(let start of starts){
        findCycles(start);
    }
    console.log(onceZs,cycleZs);
    console.log(starts);

    // temp code, data dependent

}

console.log(problem2(header,body));


