import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./15.txt")).toString();
    break;
    case 2:
text = `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`;
    break;
}

const HASH = function(str){
    let res = 0;
    for(let c of str){
        const code = c.charCodeAt(0);
        res += code;
        res *= 17;
        res %= 256;
    }
    return res;
}

const solve1 = function(strs){
    let sum = 0;
    for(let str of strs){
        sum += HASH(str);
    }
    console.log("Solution 1:",sum);
}

const newarr = function(n){
    const arr = [];
    for(let i = 0; i < n; i++){
        arr.push(0);
    }
    return arr;
}

const solve2 = function(strs){
    const boxes = newarr(256).map(v=>[]);

    for(let cmd of strs){
        const match = cmd.match(/[-=]/);
        const type = match[0];
        const tidx = match.index;
        if(!type){
            console.log(cmd);
            throw new Error("Unrecognized format");
        }
        const label = cmd.slice(0,tidx);
        const boxnum = HASH(label);
        let box = boxes[boxnum];
        if(type === "-"){
            box = box.filter(([l,f])=>l !== label);
        }else if(type === "="){
            let slot = box.filter(([l,f])=>l === label)[0];
            const focus = parseInt(cmd.slice(tidx+1));
            if(slot){
                slot[1] = focus;
            }else{
                box.push([label,focus]);
            }
        }
        boxes[boxnum] = box;
    }

    let sum = 0;
    for(let i = 0; i < boxes.length; i++){
        const box = boxes[i];
        for(let j = 0; j < box.length; j++){
            const [label,focus] = box[j];
            let power = (i+1)*(j+1)*focus;
            sum += power;
        }
    }
    console.log("Solution 2:",sum);
}

const values = text.trim().split(",");
solve1(values);
solve2(values);

