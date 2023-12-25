import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./14.txt")).toString();
    break;
    case 2:
text = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`;
    break;
}

const rotateCW = function(block){
    let res = [];
    for(let i = 0; i < block[0].length; i++){
        let row = [];
        for(let j = block.length-1; j >= 0; j--){
            row.push(block[j][i]);
        }
        res.push(row.join(""));
    }
    return res;
};

const rotateCCW = function(block){
    let res = [];
    for(let i = block[0].length-1; i >= 0; i--){
        let row = [];
        for(let j = 0; j < block.length; j++){
            row.push(block[j][i]);
        }
        res.push(row.join(""));
    }
    return res;
};


const rollEast = function(rows){
    return rows.map(line=>{
        return line.replace(/[O.]+/g,(match)=>{
            return match.split("").sort().join("")
        });
    });
};

const calculateLoad = function(rows){
    let res = 0;
    for(let i = 0; i < rows.length; i++){
        res += (rows.length-i)*(rows[i].match(/[O]/g)?.length||0)
    }
    return res;
}

const solve1 = function(rows){
    const rolled = rotateCCW(rollEast(rotateCW(rows)));
    console.log(JSON.stringify(rolled,null,4));
    return calculateLoad(rolled);
};



const cycle = function(rows){
    return rollEast(rotateCW(rollEast(rotateCW(rollEast(rotateCW(rollEast(rotateCW(rows))))))));
};

const solve2 = function(rows){
    console.log(JSON.stringify(rows,null,4));
    const states = new Map;
    const sequence = [];
    let cnt = 0;
    let cycleStart = 0;
    while(true){
        states.set(rows.join("\n"), cnt);
        sequence.push(calculateLoad(rows));
        rows = cycle(rows);
        cnt++;
        if(states.has(rows.join("\n"))){
            cycleStart = states.get(rows.join("\n"));
            break;
        }
    }
    const cycleLength = sequence.length-cycleStart;
    // find after one billion cycles
    // console.log(JSON.stringify(rows,null,4));
    return sequence[cycleStart+(1000000000-cycleStart)%cycleLength];
}

console.log("Solution 1:",solve1(text.trim().split("\n")));
console.log("Solution 2:",solve2(text.trim().split("\n")));

