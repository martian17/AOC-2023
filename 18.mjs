import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./18.txt")).toString();
    break;
    case 2:
text = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`;
    break;
}

const angleMap = {
    R: 0,
    D: 1,
    L: 2,
    U: 3
};

const atoDelta = [
    [1,0],
    [0,1],
    [-1,0],
    [0,-1]
];

const atodeltax = [
    1,
    0,
    -1,
    0
];

const atodeltay = [
    0,
    1,
    0,
    -1
];

const mod4 = function(n){
    n %= 4;
    if(n < 0)return n + 4;
    return n;
};
const mod = function(a,b){
    let r = a%b;
    if(r<0)return r+b;
    return r;
};

const solve1 = function(lines){
    const directions = lines.map(l=>{
        let [dir,dist] = l.split(" ")
        dist = parseInt(dist);
        return [angleMap[dir],dist];
    });
    // create a bounding box, and flood fill from outside
    const cells = new Set();
    let x = 0;
    let y = 0;
    cells.add(`${x},${y}`);
    let xmax = 0;
    let ymax = 0;
    let xmin = 0;
    let ymin = 0;
    for(let [angle,dist] of directions){
        const [dx,dy] = atoDelta[angle];
        for(let i = 0; i < dist; i++){
            x += dx;
            y += dy;
            if(x < xmin)xmin = x;
            if(x > xmax)xmax = x;
            if(y < ymin)ymin = y;
            if(y > ymax)ymax = y;
            cells.add(`${x},${y}`);
        }
    }
    if(x !== 0 || y !== 0)throw new Error("xy not origin");
    console.log(xmin,xmax,ymin,ymax);
    const grid = new Map;
    for(let x = xmin-1; x <= xmax+1; x++){
        for(let y = ymin-1; y <= ymax+1; y++){
            grid.set(`${x},${y}`,".");
        }
    }
    for(let cell of cells){
        grid.set(cell,"#");
    }
    // flood fill the perimeter
    const fillStack = [[xmin-1,ymin-1]];
    while(fillStack.length !== 0){
        const [x,y] = fillStack.pop();
        const id = `${x},${y}`;
        if(!grid.has(id))continue;
        const cellType = grid.get(id);
        if(cellType === "#")continue;
        if(cellType === " ")continue;
        grid.set(id," ");
        const candidates = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
        for(let [x1,y1] of candidates){
            fillStack.push([x1,y1]);
        }
    }
    console.log(`Solution 1: ${[...grid].map(v=>v[1]).filter(v=>v!==" ").length}`);
}


class Segments{
    segments = [];
    add(start,end){
        let segs1 = [];
        for(let [s0,e0] of this.segments){
            if(e0 < start){// one or more gap
                segs1.push([s0,e0]);
            }else if(end < s0){
                segs1.push([s0,e0]);
            }else{
                if(s0 < start){
                    start = s0;
                }
                if(end < e0){
                    end = e0;
                }
            }
        }
        segs1.push([start,end]);
        this.segments = segs1;
    }
    subtract(start,end){
        let segs1 = [];
        for(let [s0,e0] of this.segments){
            if(e0+1 < start){// one or more gap
                segs1.push([s0,e0]);
            }else if(end+1 < s0){
                segs1.push([s0,e0]);
            }else{
                if(s0 < start){
                    segs1.push([s0,start-1]);
                }
                if(end < e0){
                    segs1.push([end+1,e0]);
                }
            }
        }
        this.segments = segs1;
    }
    tally(){
        let total = 0;
        for(let [s,e] of this.segments){
            total += e-s+1;
        }
        return total;
    }
}

const toOne = function(n){
    if(n === 0)return 0;
    if(n < 0)return -1;
    if(n > 0)return 1;
}


const loopPolygon = function*(poly){
    for(let i = 0; i < poly.length; i++){
        yield [poly[(i-1+poly.length)%poly.length],poly[i],poly[(i+1)%poly.length]];
    }
}

const loopEdges = function*(poly){
    for(let i = 0; i < poly.length; i++){
        yield [poly[i],poly[(i+1)%poly.length]];
    }
}

const expandPolygon = function(polygon){
    // assume clockwise
    const newPolygon = [];
    for(let [prev,vert,next] of loopPolygon(polygon)){
        let {x,y} = vert;
        if(vert.x < prev.x || next.x < vert.x){// bottom edge
            y++;
        }
        if(vert.y > prev.y || next.y > vert.y){// right edge
            x++;
        }
        newPolygon.push({x,y});
    }
    return newPolygon;
}

const getPolygonArea = function(polygon){
    let area = 0;
    // keep adding triangles
    for(const [v1,v2] of loopEdges(polygon)){
        if(v1.x === v2.x){
            area += v1.x*(v2.y-v1.y);
        }else if(v1.y === v2.y){
            area += v1.y*(v1.x-v2.x);
        }else{
            throw new Error("WTF happened?");
        }
    }
    return area/2;// /2 'cause triangle
}


const solve2 = function(lines){
    const directions = lines.map(l=>{
        let hex = l.split(" ")[2].slice(2);
        const dist = parseInt(hex.slice(0,5),16);
        const dir = parseInt(hex.slice(5,6),16);
        //console.log(dist,"RDLU"[dir]);
        return [dir,dist];
    });
    // const directions = lines.map(l=>{
    //     let [dir,dist] = l.split(" ")
    //     dist = parseInt(dist);
    //     return [angleMap[dir],dist];
    // });
    // directions to polygon
    let vertices = [];
    let x = 0;
    let y = 0;
    for(let [angle,dist] of directions){
        const [dx,dy] = atoDelta[angle];
        x += dx*dist;
        y += dy*dist;
        vertices.push({x,y});
    }
    if(x !== 0 || y !== 0)throw new Error("xy not origin");
    vertices = expandPolygon(vertices);
    console.log(vertices);
    console.log(getPolygonArea(vertices));
}


solve1(text.trim().split("\n"));
solve2(text.trim().split("\n"));



