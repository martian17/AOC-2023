import {promises as fs} from "fs";

const lines = (await fs.readFile("./3.txt")).toString().trim().split("\n");
// const lines = `
// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
// `.trim().split("\n");

{
let idsum = 0;

for(let i = 0; i < lines.length; i++){
    let line = lines[i];
    for(let res of line.matchAll(/[0-9]+/g)){
        const digits = res[0];
        const position = res.index;
        let partFlag = false;
        inner:
        for(let dx = -1; dx < digits.length+1; dx++){
            let x = position+dx;
            if(x < 0)continue;
            if(x >= line.length)continue;
            for(let y = i-1; y <= i+1; y++){
                if(y < 0)continue;
                if(y >= lines.length)continue;
                const c = lines[y][x];
                if(c.match(/[0-9]/))continue;
                if(lines[y][x] !== "."){
                    partFlag = true;
                    break inner;
                }
            }
        }
        console.log(digits,partFlag);
        if(partFlag){
            idsum += parseInt(digits);
        }else{
            console.log(":",digits);
        }
    }
}
console.log(idsum);
}

{
const gears = new Map;
for(let i = 0; i < lines.length; i++){
    let line = lines[i];
    for(let res of line.matchAll(/[0-9]+/g)){
        const digits = res[0];
        const position = res.index;
        for(let dx = -1; dx < digits.length+1; dx++){
            let x = position+dx;
            if(x < 0)continue;
            if(x >= line.length)continue;
            for(let y = i-1; y <= i+1; y++){
                if(y < 0)continue;
                if(y >= lines.length)continue;
                const c = lines[y][x];
                if(c.match(/[0-9]/))continue;
                if(lines[y][x] === "*"){
                    const idx = `${x} ${y}`;
                    if(!gears.has(idx))gears.set(idx,[]);
                    gears.get(idx).push(parseInt(digits));
                }
            }
        }
    }
}
console.log(gears);
console.log([...gears].map(v=>v[1]).filter(v=>v.length === 2).map(v=>v[0]*v[1]).reduce((a,b)=>a+b));

}

