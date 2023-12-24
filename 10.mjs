import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./10.txt")).toString();
    break;
    case 2:
text = `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`;
    break;
}

const modulo = function(a,b){
    const m = a%b;
    if(m < 0)return b+m;
    return m;
}

const toAngle = function(dx,dy){
    if(dx === 1 && dy === 0)return 0;
    if(dx === 0 && dy === 1)return 1;
    if(dx === -1 && dy === 0)return 2;
    if(dx === 0 && dy === -1)return 3;
    throw new Error("angle undefined");
}

const toDelta = function(angle){
    angle = modulo(angle,4);
    if(angle === 0)return [1,0];
    if(angle === 1)return [0,1];
    if(angle === 2)return [-1,0];
    if(angle === 3)return [0,-1];
    throw new Error("invalid angle");
}

const toDirection = function([x0,y0],[x1,y1],[x2,y2]){
    const dx1 = x1-x0;
    const dy1 = y1-y0;
    const dx2 = x2-x1;
    const dy2 = y2-y1;
    const a1 = toAngle(dx1,dy1);
    const a2 = toAngle(dx2,dy2);
    const dirs = [
        [0,1,0,-1],
        [-1,0,1,0],
        [0,-1,0,1],
        [1,0,-1,0]
    ];
    return dirs[a1][a2];
};

const shapes = {
    "|": [[0,-1],[ 0,1]],
    "-": [[-1,0],[ 1,0]],
    "L": [[0,-1],[ 1,0]],
    "J": [[0,-1],[-1,0]],
    "7": [[0, 1],[-1,0]],
    "F": [[0, 1],[ 1,0]],
    ".": [],
    "S": []
};

class Field{
    constructor(lines){
        this.lines = lines;
        this.width = lines[0].length;
        this.height = lines.length;
    }
    findStart(){
        const {width,height} = this;
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const c = lines[y][x];
                if(c === "S"){
                    return [x,y];
                }
            }
        }
        throw new Error("start not found");
    }
    getShape(x,y){
        return this.lines[y][x];
    }
    connects(x0,y0,x1,y1){
        const dx = x1-x0;
        const dy = y1-y0;
        const connections = shapes[this.getShape(x0,y0)];
        for(let [dx1, dy1] of connections){
            if(dx === dx1 && dy === dy1)return true;
        }
        return false;
    }
    traverse(){
        const [sx,sy] = this.findStart();
        for(let i = 0; i < 4; i++){
            const [dx,dy] = toDelta(i);
            if(!this.connects(sx+dx,dy+dy,sx,sy))continue;

        }
    }
    findLoop(sx,sy,sdx,sdy){
        const {width, height} = this;
        const loop = [];
        let x = sx;
        let y = sy;
        let dx = sdx;
        let dy = sdy;
        while(true){
            loop.push([x,y]);
            const x1 = x+dx;
            const y1 = y+dy;
            if(x1 < 0 || x1 >= width || y1 < 0 || y1 >= height)
                return false;
            if(this.getShape(x1,y1) === "S"){
                return loop;
            }
            if(!this.connects(x1,y1,x,y))
                return false;
            let ways = shapes[this.getShape(x1,y1)].filter(([dx1,dy1])=>!(dx1 === -dx && dy1 === -dy));
            if(ways.length !== 1)throw new Error("No way!");
            [[dx,dy]] = ways;
            x = x1;
            y = y1;
        }
    }
    solve1(){
        const [x,y] = this.findStart();
        let loop;
        for(let i = 0; i < 4; i++){
            const [dx,dy] = toDelta(i);
            if(!this.connects(x+dx,y+dy,x,y))continue;
            if(loop = this.findLoop(x,y,dx,dy)){
                break;
            }
        }
        console.log(loop.length/2);
    }
    solve2(){
        const [x,y] = this.findStart();
        let loop;
        for(let i = 0; i < 4; i++){
            const [dx,dy] = toDelta(i);
            if(!this.connects(x+dx,y+dy,x,y))continue;
            if(loop = this.findLoop(x,y,dx,dy)){
                break;
            }
        }
        const len = loop.length;
        // find the cycle direction
        let angle = 0;
        for(let i = 0; i < len; i++){
            const direction = toDirection(
                loop[(i+0)%len],
                loop[(i+1)%len],
                loop[(i+2)%len],
            );
            console.log(angle);
            angle += direction;
        }
        console.log(angle);
        if(angle < 0)
            loop = loop.reverse();
        // flood fill right side
        const loopSet = new Set(loop.map(([x,y])=>`${x},${y}`));
        const filled = new Set;
        const floodFill = function(x,y){
            const id = `${x},${y}`;
            if(loopSet.has(id))return;
            if(filled.has(id))return;
            filled.add(id);
            for(let i = 0; i < 4; i++){
                const [dx,dy] = toDelta(i);
                floodFill(x+dx,y+dy);
            }
        }
        for(let i = 0; i < len; i++){
            const [x0,y0] = loop[(i+0)%len];
            const [x1,y1] = loop[(i+1)%len];
            const dx = x1-x0;
            const dy = y1-y0;
            const angle = toAngle(dx,dy);
            //rotate 90 degrees
            const [rdx,rdy] = toDelta(angle+1)
            floodFill(x0+rdx,y0+rdy);
            floodFill(x1+rdx,y1+rdy);
        }
        console.log(filled.size);
    }
}
const lines = text.trim().split("\n");
const field = new Field(lines);
field.solve1();
field.solve2();

