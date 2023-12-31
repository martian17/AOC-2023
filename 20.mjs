import {promises as fs} from "fs";
import {FIFOQueue as Queue} from "./util.mjs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./20.txt")).toString();
    break;
    case 2:
text = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`;
    break;
    case 3:
text = `
broadcaster -> a
%a -> b
%b -> c
%c -> d
%d -> e
%e -> f
%f -> g
%g -> h
`;
    break;
}

text = text.trim();

let broadcaster;
const rules = text.split("\n").map(l=>{
    let [left,right] = l.split(" -> ");
    right = right.split(",").map(v=>v.trim());
    return [left,right];
}).filter(([l,r])=>{
    if(l === "broadcaster"){
        broadcaster = r;
        return false;
    }
    return true;
}).map(([l,r])=>{
    const type = l[0];
    const name = l.slice(1);
    const dests = r;
    return {type,name,dests};
});

const LOW = 0;
const HIGH = 1;
const invert = (val)=>val===LOW?HIGH:LOW;

const pressOnce = function(rules){
    const queue = new Queue(rules["broadcaster"].dests.map(v=>["broadcaster",v,LOW]));
    let totalHighs = 0;
    let totalLows = 1;// sending one low to broadcaster
    while(queue.size !== 0){
        const [originName,ruleName,value] = queue.pop();
        //console.log(originName,value===LOW?"-LOW->":"-HIGH->",ruleName);
        if(value === HIGH){
            totalHighs++;
        }else{
            totalLows++;
        }
        // if(ruleName === "output"){
        //     if(value === HIGH)totalHighs++;
        //     if(value === LOW)totalLows++;
        //     continue;
        // }
        const rule = rules[ruleName];
        if(!rule)continue;
        if(rule.type === "%"){
            if(value === HIGH)continue;
            rule.state = invert(rule.state);
            for(let dest of rule.dests){
                queue.push([ruleName,dest,rule.state]);
            }
        }else if(rule.type === "&"){
            // NAND
            rule.inputs[originName] = value;
            let out = LOW;
            for(let key in rule.inputs){
                if(rule.inputs[key] === LOW)out = HIGH;
            }
            for(let dest of rule.dests){
                queue.push([ruleName,dest,out]);
            }
        }else{
            console.log(rule);
            throw new Error("unknown rule type");
        }
    }
    return [totalHighs,totalLows];
}

const problem1 = function(rules,broadcaster){
    rules = Object.fromEntries(rules.map(r=>[r.name,r]));
    rules["broadcaster"] = {
        type: "broadcaster",
        name: "broadcaster",
        dests: broadcaster
    };
    for(let key in rules){
        rules[key].inputs = {};
        rules[key].state = LOW;
    }
    // link the rules
    for(let key in rules){
        const rule = rules[key];
        for(let dest of rule.dests){
            if(!(dest in rules))continue;
            rules[dest].inputs[key] = LOW;
        }
    }

    let lTotal = 0;
    let hTotal = 0;
    for(let i = 0; i < 1000; i++){
        let [h,l] = pressOnce(rules);
        lTotal += l;
        hTotal += h;
    }
    console.log(lTotal,hTotal,lTotal*hTotal);
    console.log("Solution 1:",lTotal*hTotal);
}

    
const obtainRules = function(){
    let broadcaster;
    let rules = text.split("\n").map(l=>{
        let [left,right] = l.split(" -> ");
        right = right.split(",").map(v=>v.trim());
        return [left,right];
    }).filter(([l,r])=>{
        if(l === "broadcaster"){
            broadcaster = r;
            return false;
        }
        return true;
    }).map(([l,r])=>{
        const type = l[0];
        const name = l.slice(1);
        const dests = r;
        return {type,name,dests};
    });
    rules = Object.fromEntries(rules.map(r=>[r.name,r]));
    rules["broadcaster"] = {
        type: "broadcaster",
        name: "broadcaster",
        dests: broadcaster
    };
    for(let key in rules){
        rules[key].inputs = {};
        rules[key].state = LOW;
    }
    // link the rules
    for(let key in rules){
        const rule = rules[key];
        for(let dest of rule.dests){
            if(!(dest in rules))continue;
            rules[dest].inputs[key] = LOW;
        }
    }
    return rules;
};

const pressOnce2 = function(rules){
    //console.log("asdfas");
    const queue = new Queue(rules["broadcaster"].dests.map(v=>["broadcaster",v,LOW]));
    let pulses = [];
    let zeroFound = false;
    while(queue.size !== 0){
        const [originName,ruleName,value] = queue.pop();
        //console.log(originName,value===LOW?"-LOW->":"-HIGH->",ruleName);
        if(ruleName === "kk"){
            pulses.push(value);
            if(value === 0)zeroFound = true;
        }
        if(ruleName === "rx" && value === LOW){
            return true;
        }
        const rule = rules[ruleName];
        if(!rule)continue;
        if(rule.type === "%"){
            if(value === HIGH)continue;
            rule.state = invert(rule.state);
            for(let dest of rule.dests){
                queue.push([ruleName,dest,rule.state]);
            }
        }else if(rule.type === "&"){
            // NAND
            rule.inputs[originName] = value;
            let out = LOW;
            for(let key in rule.inputs){
                if(rule.inputs[key] === LOW)out = HIGH;
            }
            for(let dest of rule.dests){
                queue.push([ruleName,dest,out]);
            }
        }else{
            console.log(rule);
            throw new Error("unknown rule type");
        }
    }
    if(zeroFound)console.log("vt pulse 0",pulses)
    return false;
}

const watchComponent = function(rules,cname){
    const queue = new Queue(rules["broadcaster"].dests.map(v=>["broadcaster",v,LOW]));
    let pulses = [];
    let zeroFound = false;
    while(queue.size !== 0){
        const [originName,ruleName,value] = queue.pop();
        if(ruleName === cname){
            pulses.push(value);
            if(value === 0)zeroFound = true;
        }
        const rule = rules[ruleName];
        if(!rule)continue;
        if(rule.type === "%"){
            if(value === HIGH)continue;
            rule.state = invert(rule.state);
            for(let dest of rule.dests){
                queue.push([ruleName,dest,rule.state]);
            }
        }else if(rule.type === "&"){
            // NAND
            rule.inputs[originName] = value;
            let out = LOW;
            for(let key in rule.inputs){
                if(rule.inputs[key] === LOW)out = HIGH;
            }
            for(let dest of rule.dests){
                queue.push([ruleName,dest,out]);
            }
        }else{
            console.log(rule);
            throw new Error("unknown rule type");
        }
    }
    if(zeroFound){
        return pulses;
    }
    return false;
}

const findComponentCycle = function(cname){
    const rules = obtainRules();

    let vals = [];
    for(let i = 1;; i++){
        let pulses = watchComponent(rules,cname);
        if(!pulses)continue;
        console.log(cname,i,pulses[0]);
        vals.push(i);
        if(vals.length === 10)break;
    }
    let pdiff = vals[1]-vals[0];
    for(let i = 0; i < vals.length-1; i++){
        let diff = vals[i+1] - vals[i];
        if(diff !== pdiff){
            console.log(vals);
            throw new Error("Irregular sequence");
        }
    }
    return [vals[0],pdiff];
}

const problem2 = function(rules,broadcaster){
    let vt = findComponentCycle("vt");
    let sk = findComponentCycle("sk");
    let xc = findComponentCycle("xc");
    let kk = findComponentCycle("kk");
    //console.log("Solution 2:",vt,sk,xc,kk);
    //expect all of them to align & be prime
    const B = n=>BigInt(n);
    console.log("Solution 2:",B(vt[0])*B(sk[0])*B(xc[0])*B(kk[0]));
}

// const test2 = function(rules,broadcaster){
//     rules = Object.fromEntries(rules.map(r=>[r.name,r]));
//     rules["broadcaster"] = {
//         type: "broadcaster",
//         name: "broadcaster",
//         dests: broadcaster
//     };
//     for(let key in rules){
//         rules[key].inputs = {};
//         rules[key].state = LOW;
//     }
//     // link the rules
//     for(let key in rules){
//         const rule = rules[key];
//         for(let dest of rule.dests){
//             if(!(dest in rules))continue;
//             rules[dest].inputs[key] = LOW;
//         }
//     }
//     for(let i = 0; i < 100; i++){
//         pressOnce2(rules);
//         console.log([..."abcdefg"].map(v=>rules[v].state).join(""));
//     }
// }

problem1(rules,broadcaster);
//test2(rules,broadcaster);
problem2(rules,broadcaster);






