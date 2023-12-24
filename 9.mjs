import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./9.txt")).toString();
    break;
    case 2:
text = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;
    break;
    case 3:
text = "10 13 16 21 30 45";
    break;
}

text = text.trim();


const getDiff = function(seq){
    let diff = [];
    for(let i = 0; i < seq.length-1; i++){
        diff.push(seq[i+1]-seq[i]);
    }
    return diff;
}

const extrapolateSequence = function(seq){
    let diffs = [seq];
    let top = seq;
    while(true){
        if(top.length === 1){
            console.log(seq,top);
            console.log("this can't be happening");
            break;
        }
        top = getDiff(top);
        if(top.filter(v=>v!==0).length === 0){
            break;
        }
        diffs.push(top);
    }
    diffs = diffs.reverse();
    let d = 0;
    for(let diff of diffs){
        let val = diff.at(-1);
        val += d;
        d = val;
    }
    return d;
}

const extrapolateSequenceBackward = function(seq){
    let diffs = [seq];
    let top = seq;
    while(true){
        if(top.length === 1){
            console.log(seq,top);
            console.log("this can't be happening");
            break;
        }
        top = getDiff(top);
        if(top.filter(v=>v!==0).length === 0){
            break;
        }
        diffs.push(top);
    }
    diffs = diffs.reverse();
    let d = 0;
    for(let diff of diffs){
        let val = diff[0];
        val -= d;
        d = val;
    }
    return d;
}

{
let sum = 0;
for(let seq of text.split("\n").map(l=>l.split(" ").map(v=>parseInt(v)))){
    sum += extrapolateSequence(seq);
}
console.log(sum);
}

{
let sum = 0;
for(let seq of text.split("\n").map(l=>l.split(" ").map(v=>parseInt(v)))){
    let res = extrapolateSequenceBackward(seq);
    console.log(res);
    sum += res;
}
console.log(sum);
}

