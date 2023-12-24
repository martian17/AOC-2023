import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./11.txt")).toString();
    break;
    case 2:
text = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;
    break;
}

const lines = text.trim().split("\n");
{
// find empty rows
const rowOffset = [];
let rowIndex = 0;
for(let i = 0; i < lines.length; i++){
    const row = lines[i];
    rowOffset.push(rowIndex++);
    if(!row.match("#"))rowIndex += 1;
}
const columnOffset = [];
let columnIndex = 0;
for(let i = 0; i < lines[0].length; i++){
    const column = lines.map(l=>l[i]).join("");
    columnOffset.push(columnIndex++);
    if(!column.match("#"))columnIndex += 1;
}

const galaxies = [];

for(let y = 0; y < lines.length; y++){
    for(let x = 0; x < lines[0].length; x++){
        if(lines[y][x] !== "#")continue;
        galaxies.push([columnOffset[x],rowOffset[y]]);
    }
}

let total = 0;
for(let [x1,y1] of galaxies){
    let mind = Infinity;
    for(let [x2,y2] of galaxies){
        if(x1 === x2 && y1 === y2)continue;
        const d = Math.abs(x2-x1)+Math.abs(y2-y1);
        total += d;
    }
}
console.log("Problem1:", total/2);
}


{
// find empty rows
const rowOffset = [];
let rowIndex = 0;
for(let i = 0; i < lines.length; i++){
    const row = lines[i];
    rowOffset.push(rowIndex++);
    if(!row.match("#"))rowIndex += 1000000-1;
}
const columnOffset = [];
let columnIndex = 0;
for(let i = 0; i < lines[0].length; i++){
    const column = lines.map(l=>l[i]).join("");
    columnOffset.push(columnIndex++);
    if(!column.match("#"))columnIndex += 1000000-1;
}

const galaxies = [];

for(let y = 0; y < lines.length; y++){
    for(let x = 0; x < lines[0].length; x++){
        if(lines[y][x] !== "#")continue;
        galaxies.push([columnOffset[x],rowOffset[y]]);
    }
}

let total = 0;
for(let [x1,y1] of galaxies){
    let mind = Infinity;
    for(let [x2,y2] of galaxies){
        if(x1 === x2 && y1 === y2)continue;
        const d = Math.abs(x2-x1)+Math.abs(y2-y1);
        total += d;
    }
}
console.log("Problem2:", total/2);
}
