import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./19.txt")).toString();
    break;
    case 2:
text = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`;
    break;
}

text = text.trim();

// parse
let [flows,parts] = text.split("\n\n");
flows = flows.split("\n").map(l=>{
    let [name,rest] = l.split("{");
    rest = rest.slice(0,-1);
    const rules = rest.split(",").map(v=>{
        if(v.match(":")){
            let [cond,link] = v.split(":");
            const val = parseInt(cond.slice(2));
            const attr = cond[0];
            return {
                link,val,attr,
                operator: cond[1],
                cond: (cond[1] === "<" ? ((a)=>a[attr]<val) : ((a)=>a[attr]>val))
            };
        }else{
            return v;
        }
    });
    return [
        name,
        {
            rules: rules.slice(0,-1),
            else: rules[rules.length-1]
        }
    ];
});
flows = Object.fromEntries(flows);

parts = parts.split("\n").map(v=>{
    return Object.fromEntries(v.slice(1,-1).split(",").map(v=>[v[0],parseInt(v.slice(2))]));
});

// for(let key in flows){
//     console.log(key,JSON.stringify(flows[key]));
// }
// 
// console.log(parts);

const solve1 = function(flows,parts){
    let total = 0;
    for(let part of parts){
        //console.log(part);
        let flow = flows["in"];
        //console.log("in");
        while(true){
            let next = flow.else;
            for(let {link,cond} of flow.rules){
                if(cond(part)){
                    next = link;
                    break;
                }
            }
            if(next === "R")break;
            if(next === "A"){
                const subtotal = part.x + part.m + part.a + part.s;
                total += subtotal;
                break;
            }
            //console.log(next);
            flow = flows[next];
        }
    }
    console.log(`Solution 1: ${total}`);
}

const cloneConstraints = function(obj){
    let res = {};
    for(let key in obj){
        res[key] = [...obj[key]]
    }
    return res;
}


const splitProbability = function(base,attr,operator,val){
    let [min,max] = base[attr];
    const cpy = cloneConstraints(base);
    if(operator === "<"){
        cpy[attr]  = [min,Math.min(max,val)];
        base[attr] = [Math.max(min,val),max];
    }else{
        val++;
        cpy[attr]  = [Math.max(min,val),max];
        base[attr] = [min,Math.min(max,val)];
    }
    return [base,cpy];
}

const isValidRange = function([a,b]){
    return a<b;
}

let rejected = 0n
const recurse = function(flows,flowName,constraints){
    if(flowName === "R"){
        rejected += Object.values(constraints).map(([min,max])=>BigInt(max-min)).reduce((a,b)=>a*b)
        return 0n;
    }else if(flowName === "A"){
        return Object.values(constraints).map(([min,max])=>BigInt(max-min)).reduce((a,b)=>a*b)
    }

    let sum = 0n;
    // branch constraints
    let base = cloneConstraints(constraints);
    const flow = flows[flowName];
    for(let {attr, operator, val, link} of flow.rules){
        let cpy;
        [base,cpy] = splitProbability(base,attr,operator,val);
        if(isValidRange(cpy[attr])){
            sum += recurse(flows,link,cpy);
        }
        if(!isValidRange(base[attr])){
            return sum;
        }
    }
    return sum + recurse(flows,flow.else,base);
}


const solve2 = function(flows){
    let total = recurse(flows,"in",{
        x: [1,4001],
        m: [1,4001],
        a: [1,4001],
        s: [1,4001],
    });
    console.log(total);
    console.log(rejected);
    console.log(total+rejected);
    console.log(`Solution 2: ${total}`);
}

solve1(flows,parts);
solve2(flows);





