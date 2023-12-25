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


const lines = text.trim().split("\n");

{
const getCombinations = function(textLine){
    const [line,r] = textLine.split(" ");
    console.log(line,r);
    const nums = r.trim().split(",").map(v=>parseInt(v))

    let n = 0;
    const permutate = function(accum,line,nums){
        while(line[0] === "."){
            line = line.slice(1);
            accum += ".";
        }
        if(line === "" && nums.length === 0){
            console.log(accum);
            n++;
            return;
        }
        if(line[0] === "?"){
            permutate(accum, "."+line.slice(1),nums);
            permutate(accum, "#"+line.slice(1),nums);
        }else{// "#"
            if(nums.length === 0)return;
            const n = nums[0];
            if(line.length < n)return;
            if(n === line.length){
                let slice = line.replace(/\?/g,"#");
                if(slice.match(/\./))return;
                permutate(accum+slice,"",nums.slice(1));
            }else{
                let slice = line.slice(0,n).replace(/\?/g,"#");
                line = line.slice(n);
                if(slice.match(/\./))return;
                if(line[0] === "#")return;
                permutate(accum+slice,"."+line.slice(1),nums.slice(1));
            }
        }
    };
    permutate("",line,nums);
    return n;
}


let sum = 0;
for(let line of lines){
    sum += getCombinations(line);
}
console.log(sum);
//getCombinations(lines[1]);
}



{

// const greedySearchCombinations = function(textLine){
//     const [line,r] = textLine.split(" ");
//     //console.log(line,r);
//     const nums = r.trim().split(",").map(v=>parseInt(v))
//     // map nums to possible locations
//     // combine those locations
// 
// }
const getCombinations = function(textLine){
    const [line,r] = textLine.split(" ");
    //console.log(line,r);
    const nums = r.trim().split(",").map(v=>parseInt(v))

    let cache = new Map;
    const permutate = function(line,nums){
        while(line[0] === "."){
            line = line.slice(1);
        }
        let signature = line+nums.length;
        if(cache.has(signature))return cache.get(signature);
        if(line === ""){
            if(nums.length === 0){
                return 1;
            }else{
                return -1;
            }
        }
        if(line[0] === "?"){
            let a = permutate("#"+line.slice(1),nums);
            if(a === -1)return -1;
            let b = permutate("."+line.slice(1),nums);
            if(b === -1)return a;
            return a+b;
        }else{// "#"
            if(nums.length === 0)return 0;
            const n = nums[0];
            if(line.length < n)return -1;
            if(n === line.length){
                let slice = line.replace(/\?/g,"#");
                if(slice.match(/\./))return 0;
                return permutate("",nums.slice(1));
            }else{
                let slice = line.slice(0,n).replace(/\?/g,"#");
                line = line.slice(n);
                if(slice.match(/\./))return 0;
                if(line[0] === "#")return 0;
                return permutate("."+line.slice(1),nums.slice(1));
            }
        }
    };
    return permutate(`${line}?${line}?${line}?${line}?${line}`,[...nums,...nums,...nums,...nums,...nums]);
}


let sum = 0;
for(let i = 0; i < lines.length; i++){
    let line = lines[i];
    console.log(i,line);
    let n = getCombinations(line);
    console.log(n);
    sum += n;
}
console.log(sum);
//getCombinations(lines[1]);
}

