import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./21.txt")).toString();
    break;
    case 2:
text = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`;
    break;
    case 3:
text = `
...
.#.
..S
`;
    break;
}
const lines = text.trim().split("\n");


const evolveState = function(lines,state){
    const newState = new Set;
    const pushState = function(x,y){
        let val = lines[y]?.[x];
        if(!val)return;
        if(val !== "#")newState.add(`${x},${y}`)
    }
    for(let point of state){
        const [x,y] = point.split(",").map(v=>parseInt(v));
        pushState(x+1,y);
        pushState(x-1,y);
        pushState(x,y+1);
        pushState(x,y-1);
    }
    return newState;
}


const getReachableTiles = function(lines,max){
    // find S
    let sx = 0;
    let sy = 0;
    for(let y = 0; y < lines.length; y++){
        for(let x = 0; x < lines[0].length; x++){
            if(lines[y][x] === "S"){
                sx = x;
                sy = y;
            }
        }
    }
    let state = new Set([`${sx},${sy}`]);
    for(let i = 0; i < max; i++){
        state = evolveState(lines,state);
    }
    return state;
}

const problem1 = function(lines){
    const state = getReachableTiles(lines,64);
    console.log(`Solution 1: ${state.size}`);
}


const modulo = function(a,b){
    let r = a%b;
    if(r < 0)return r+b;
    return r;
};

const countSlice = function(lines,n){
    // count the south east slice and west strip
    // ignore center
    const width = lines[0].length;
    const height = lines.length;
    // find S
    let sx = 0;
    let sy = 0;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            if(lines[y][x] === "S"){
                sx = x;
                sy = y;
            }
        }
    }

    const finalState1 = new Set;
    const finalState2 = new Set;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            if(lines[y][x] === "#")continue;
            if((x+y)%2 === 0){
                finalState1.add(`${x},${y}`);
            }else{
                finalState2.add(`${x},${y}`);
            }
        }
    }
    const isFinalState = function(state){
        let isState1 = true;
        for(let point of state){
            if(!finalState1.has(point)){
                isState1 = false;
                break;
            }
        }
        if(isState1)return 1;
        let isState2 = true;
        for(let point of state){
            if(!finalState2.has(point)){
                isState2 = false;
                break;
            }
        }
        if(isState2)return 2;
        return false;
    };
    const findTransitionPeriod = function(x0,y0){
        let state = new Set([`${sx},${sy}`]);
        for(let cnt = 0;; cnt++){
            let fs;
            if(fs = isFinalState(state)){
                return [cnt,fs];
            }
            state = evolveState(lines,state);
        }
    };
    // determins the thickness of the border region
    // diagonals and orthogonal, and the center piece
    const north_offset = sy+1;
    const west_offset = sx+1;
    const south_offset = height-sy;
    const east_offset = width-sx;
    let totalCount = 0;
    // to the south east
    {
        const leadLength = n-south_offset-east_offset
        const [tc,fs] = findTransitionPeriod(0,0);
        const centerColor = (n+1)%2;
        const edgeColor = (centerColor+(south_offset+east_offset))%2;
        const safeLength = leadLength - tc;
        const tileCount = Math.floor(safeLength/width);
        const evens = Math.ceil(tileCount/2);
        const odds = Math.floor(tileCount/2);
        let evenTileCount = (0+evens*2-2)*evens/2;
        let oddTileCount = (1+odds*2-1)*odds/2;
        if(edgeColor === 1)[evenTileCount,oddTileCount] = [oddTileCount,evenTileCount];
        const [evenState,oddState] = finalState1.has("0,0")?[finalState1,finalState2]:[finalState2,finalState1];
        totalCount += evenTileCount*evenState.size;
        totalCount += oddTileCount*oddState.size;
        // find the intermediate tiles
        for(){
        }
    }
}

const problem2 = function(){
}

const findStates = function(line,n){
    // find the area that's completely filled in
    // find the attack limit from four sides
    
}





problem1(lines);
problem2(lines,26501365);



//const evolveState2 = function(lines,state){
//    const width = lines[0].length;
//    const height = lines[1].length;
//    const newState = new Set;
//    const pushState = function(x,y){
//        let val = lines[modulo(y,height)][modulo(x,width)];
//        if(!val)return;
//        if(val !== "#")newState.add(`${x},${y}`)
//    }
//    for(let point of state){
//        const [x,y] = point.split(",").map(v=>parseInt(v));
//        pushState(x+1,y);
//        pushState(x-1,y);
//        pushState(x,y+1);
//        pushState(x,y-1);
//    }
//    return newState;
//}
//
//
//const getReachableTiles2 = function(lines,max){
//    // find S
//    let sx = 0;
//    let sy = 0;
//    for(let y = 0; y < lines.length; y++){
//        for(let x = 0; x < lines[0].length; x++){
//            if(lines[y][x] === "S"){
//                sx = x;
//                sy = y;
//            }
//        }
//    }
//    let state = new Set([`${sx},${sy}`]);
//    for(let i = 0; i < max; i++){
//        state = evolveState2(lines,state);
//    }
//    return state;
//}



