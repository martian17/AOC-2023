import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./16.txt")).toString();
    break;
    case 2:
text = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`;
    break;
}

console.log(text);

const solve = function(lines,x,y,dx,dy){
    const width = lines[0].length;
    const height = lines.length;
    const passed = new Set;
    const rays = new Set;
    const traverse = function(x,y,dx,dy){
        if(x < 0 || y < 0 || x >= width || y >= height)return;
        const id = `${x},${y},${dx},${dy}`;
        if(rays.has(id))return;
        rays.add(id);
        passed.add(`${x},${y}`);
        const c = lines[y][x];
        if(c === "."){
            traverse(x+dx,y+dy,dx,dy);
        }else if(c === "|"){
            if(dx === 1 || dx === -1){
                traverse(x,y-1,0,-1);
                traverse(x,y+1,0,1);
            }else{
                traverse(x+dx,y+dy,dx,dy);
            }
        }else if(c === "-"){
            if(dy === 1 || dy === -1){
                traverse(x-1,y,-1,0);
                traverse(x+1,y,1,0);
            }else{
                traverse(x+dx,y+dy,dx,dy);
            }
        }else if(c === "/"){
            if(dx === 1){
                traverse(x,y-1,0,-1);
            }else if(dx === -1){
                traverse(x,y+1,0,1);
            }else if(dy === 1){
                traverse(x-1,y,-1,0);
            }else if(dy === -1){
                traverse(x+1,y,1,0);
            }
        }else if(c === "\\"){
            if(dx === 1){
                traverse(x,y+1,0,1);
            }else if(dx === -1){
                traverse(x,y-1,0,-1);
            }else if(dy === 1){
                traverse(x+1,y,1,0);
            }else if(dy === -1){
                traverse(x-1,y,-1,0);
            }
        }else{
            console.log(c);
            throw new Error("unknown character");
        }
    }
    traverse(x,y,dx,dy);
    return passed.size;
}
const solve1 = function(lines){
    console.log("Solution 1:",solve(lines,0,0,1,0));
}
const solve2 = function(lines){
    const width = lines[0].length;
    const height = lines.length;
    let max = 0;
    // top
    for(let i = 0; i < width; i++){
        let v = solve(lines,i,0,0,1);
        if(v > max)max = v;
    }
    // bottom
    for(let i = 0; i < width; i++){
        let v = solve(lines,i,height-1,0,-1);
        if(v > max)max = v;
    }
    // left
    for(let i = 0; i < height; i++){
        let v = solve(lines,0,i,1,0);
        if(v > max)max = v;
    }
    // right
    for(let i = 0; i < height; i++){
        let v = solve(lines,width-1,i,-1,0);
        if(v > max)max = v;
    }
    console.log("Solution 2:",max);
}

solve1(text.trim().split("\n"));
solve2(text.trim().split("\n"));


