import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./12.txt")).toString();
    break;
    case 2:
text = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;
    break;
}


const solve = function(line,nums){

    const positions = nums.map(n=>{
        let p = [];
        for(let i = 0; i < line.length-n+1; i++){
            const slice = line.slice(i,i+n);
            if(slice.match(/\./))continue;
            if(line[i-1] === "#")continue;
            if(line[i+n] === "#")continue;
            p.push(i);
        }
        return p;
    });

    // bound left
    positions[0] = positions[0].filter(p=>{
        return !(line.slice(0,p).match(/\#/));
    });
    // bound right
    positions[positions.length-1] = positions[positions.length-1].filter(p=>{
        return !(line.slice(p+nums[nums.length-1]).match(/\#/));
    });

    let indices = [];
    // link between positions
    for(let i = 0; i < positions.length-1; i++){
        let n = nums[i];
        const ps1 = positions[i];
        const ps2 = positions[i+1];
        const index = new Map;
        for(let p1 of ps1){
            const viableLinks = [];
            for(let p2 of ps2){
                if(p1+n >= p2)continue;
                let interval = line.slice(p1+n,p2);
                if(interval.match(/\#/))continue;
                viableLinks.push(p2);
            }
            if(viableLinks.length === 0)continue;
            index.set(p1,viableLinks);
        }
        indices.push(index);
    }
    //console.log(indices);

    indices = indices.reverse();
    let combinationMap = new Map;

    for(let [_, viableLinks] of indices[0]){
        for(let p of viableLinks){
            combinationMap.set(p,1);
        }
    }

    for(let index of indices){
        let combinationMap1 = new Map;
        for(let [p, viableLinks] of index){
            combinationMap1.set(p,viableLinks.map(p1=>(combinationMap.get(p1)||0)).reduce((a,b)=>a+b));
        }
        combinationMap = combinationMap1;
    }
    
    let sum = 0;
    for(let [p,k] of combinationMap){
        sum += k;
    }
    return sum;
}

const solve1 = function(lines){
    lines = lines.map(line=>{
        let [l,r] = line.trim().split(" ");
        r = r.trim().split(",").map(v=>parseInt(v));
        return [l,r];
    });

    let n = 0;
    for(let [l,r] of lines){
        n += solve(l,r);
    }
    console.log(`Solution 1: ${n}`);
};

const solve2 = function(lines){
    lines = lines.map(line=>{
        let [l,r] = line.trim().split(" ");
        r = r.trim().split(",").map(v=>parseInt(v));
        let res = [`${l}?${l}?${l}?${l}?${l}`,[...r,...r,...r,...r,...r]];
        return res;
    });

    let n = 0;
    for(let i = 0; i < lines.length; i++){
        let [l,r] = lines[i];
        let res = solve(l,r);
        console.log(i,res);
        n += res;
        //return;
    }
    console.log(`Solution 2: ${n}`);
};

solve2(text.trim().split("\n"));





