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

const lines = text.trim().split("\n").map(v=>v.trim());

class Dirmap{
    constructor(arr){
        this.arr = arr;
    }
    from(dx,dy){
        if(this.arr.length !== 2)return false;
        for(let i = 0; i < this.arr.length; i++){
            let [dx1,dy1] = this.arr[i];
            if(dx1 === -dx && dy1 === -dy){
                return this.arr[i===0?1:0];
            }
        }
        return false;
    }
}

const dirmap = {
    "|": new Dirmap([[0,-1],[ 0,1]]),
    "-": new Dirmap([[-1,0],[ 1,0]]),
    "L": new Dirmap([[0,-1],[ 1,0]]),
    "J": new Dirmap([[0,-1],[-1,0]]),
    "7": new Dirmap([[0, 1],[-1,0]]),
    "F": new Dirmap([[0, 1],[ 1,0]]),
    ".": new Dirmap([])
}
// const dirmap = [
//     [-1,0,"F"]
// ];
const directions = [
    [ 1, 0],
    [ 0, 1],
    [-1, 0],
    [ 0,-1],
];

const problem1 = function(lines){
    //find S
    let sx = 0;
    let sy = 0;
    let width = lines[0].length;
    let height = lines.length;
    for(let y = 0; y < height; y++){
        const line = lines[y];
        for(let x = 0; x < width; x++){
            const c = line[x];
            if(c === "S"){
                console.log("start found");
                sx = x;
                sy = y;
            }
        }
    }
    // look around 4 directions
    const ptrs = [];
    for(let [dx,dy] of directions){
        if(dx < width && dx >= 0 && dy < height && dy >= 0){
            ptrs.push([sx,sy,dx,dy]);
        }
    }
    if(ptrs.length !== 2){
        console.log(ptrs);
        throw new Error(`expected 2 pointers, got ${ptrs.length}`);
    }
    let cnt = 0;
    while(true){
        for(let ptr of ptrs){
            const [x,y,dx,dy] = ptr;
            const c1 = lines[y+dy][x+dx];
            const [dx1,dy1] = dirmap[c1].from(dx,dy);
            ptr[0] = x+dx;
            ptr[1] = y+dy;
            ptr[2] = dx1;
            ptr[3] = dy1;
        }
        cnt++;
        if(ptrs[0][0] === ptrs[1][0] && ptrs[0][1] === ptrs[1][1]){
            console.log(ptrs);
            break;
        }
    }
    console.log(cnt);
}

problem1(lines);

const angles = {
    "1,0": 0,
    "0,1": 1,
    "-1,0": 2,
    "0,-1": 3
};

const anglesToDirection = function(a1, a2){
    const dirs = [
        [0,1,0,-1],
        [-1,0,1,0],
        [0,-1,0,1],
        [1,0,-1,0]
    ];
    return dirs[a1][a2];
}

const rotateLeft = function(dx,dy){
    const angle = (angles[`${dx},${dy}`]+4-1)%4;
    return angles[angle];
}

const rotateRight = function(dx,dy){
    const angle = (angles[`${dx},${dy}`]+4+1)%4;
    return angles[angle];
}

const problem2 = function(lines){
    //find S
    let sx = 0;
    let sy = 0;
    let width = lines[0].length;
    let height = lines.length;
    for(let y = 0; y < height; y++){
        const line = lines[y];
        for(let x = 0; x < width; x++){
            const c = line[x];
            if(c === "S"){
                console.log("start found");
                sx = x;
                sy = y;
            }
        }
    }
    // look around 4 directions
    const ptrs = [];
    for(let [dx,dy] of directions){
        if(dx < width && dx >= 0 && dy < height && dy >= 0){
            ptrs.push([sx,sy,dx,dy]);
        }
    }
    if(ptrs.length !== 2){
        console.log(ptrs);
        throw new Error(`expected 2 pointers, got ${ptrs.length}`);
    }
    const [x0,y0] = ptrs[0];
    let [x,y,dx,dy] = ptrs[0];

    const filled = new Set;
    const floodFill = function(x,y){
        if(x < 0 || y < 0 || x >= width || y >= height)return;
        const idx = `${x},${y}`;
        if(touched.has(idx))return;// part of the loop
        if(filled.has(idx))return;
        filled.add(idx);
        for(let [dx,dy] of directions){
            floodFill(x+dx,y+dy);
        }
    }

    const touched = new Map;
    let angle = 0;
    while(true){
        touched.set(`${x},${y}`,[x,y,dx,dy]);
        const c1 = lines[y+dy][x+dx];
        console.log(c1,angle);
        const [dx1,dy1] = dirmap[c1].from(dx,dy);
        //measure change in angle
        let da = anglesToDirection(angles[`${dx1},${dy1}`],angles[`${dx},${dy}`]);
        //mapping
        da = (da+5)%4-1;
        angle += da;
        x += dx;
        y += dy;
        dx = dx1;
        dy = dy1;
        if(x === x0 && y === y0)break;
    }
    console.log(angle);
    for(let [x,y,dx,dy] of touched.values()){
        if(angle > 0){//clockwise, right side inner
            
        }else{//counterclockwise, left side inner
        }
    }
}


console.log(problem2(lines));

