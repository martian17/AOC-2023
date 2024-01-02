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

const getStateCountAt = function(line,n){
    const [sx,sy] = getS(lines);
    let state = new Set([`${sx},${sy}`]);
    for(let i = 0; i < max; i++){
        state = evolveState(lines,state);
    }
    return state.size;
}

const getS = function(lines){
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
    return [sx,sy];
}


const getReachableTiles_bruteForce = function(lines,max){
    const [sx,sy] = getS(lines);
    let state = new Set([`${sx},${sy}`]);
    for(let i = 0; i < max; i++){
        state = evolveState(lines,state);
    }
    return state.size;
}


const modulo = function(a,b){
    let r = a%b;
    if(r < 0)return r+b;
    return r;
};

const findS = function(lines){
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
    return [sx,sy]
}

const eucdiv = function(a,b){
    let r = a%b;
    let q = (a-r)/b;
    return [q,r];
}

const rotCCK = function(lines){
    let res = [];
    for(let j = lines[0].length-1; j >= 0; j--){
        let r = "";
        for(let i = 0; i < lines.length; i++){
            r += lines[i][j];
        }
        res.push(r);
    }
    return res;
}

const getSaturationCount = function(lines,x0,y0){
    const filledCnt = getFilledCnt(lines,x0,y0);
    let state = new Set([`${sx},${sy}`]);
    for(let i = 0;; i++){
        state = evolveState(lines,state);
        if(state.size === filledCnt[i%2])return i;
    }
}

const getFilledCnt = function(lines,sx,sy){
    let even = 0;
    let odd = 0;
    for(let y = 0; y < lines.length; y++){
        for(let x = 0; x < lines[0].length; x++){
            if(lines[y][x] === "#")continue;
            if((x+y)%2 === (sx+sy)%2){
                even++;
            }else{
                odd++;
            }
        }
    }
    return [even,odd];
}

const getReachableStripEast = function(lines,n){
    const [sx,sy] = getS(lines);
    const width = lines[0].length;
    const height = lines.length;
    const startOffset = width-sx+1;
    const gilledCnt = getFilledCnt(lines,0,sy);
    let [spanCnt,r] = eucdiv(n-startOffset,width);
    spanCnt++;
    for(let spanIdx = spanCnt; spanIdx < 0; spanIdx--){
        const n = r+(spanCnt-spanIdx)*width;
        const subtotal = getStateCountAt(lines,n);
        if(cnt === filledCnt[])
    }
    const saturationCnt = getSaturationCnt(lines,0,sy);


    n-startOffset;
}

const getReachableSliceSE = function(lines,n){
}

const getReachableQuadrantSE = function(lines,n){
    return getReachableStripEast(lines,n)+getReachableSliceSE(lines,n);
}

const getReachableTiles = function(lines,n){
    const [sx,sy] = getS(lines);
    let total = 0;
    for(let i = 0; i < 4; i++){
        total += (getReachableQuadrantSE(lines,n));
        lines = rotCCK(lines);
    }
    total += getFilledCnt(lines,sx,sy)[n%2];
    return total;
}

const problem1 = function(lines){
    const r = getReachableTiles_bruteForce(lines,64);
    console.log(`Solution 1: ${r}`);
}

const problem2 = function(lines){
    let r = getReachableTiles(lines,26501365);
    console.log("Solution2:",r);
}


problem1(lines);
problem2(lines);








// const countSlice = function(lines,n){
//     // count the south east slice and west strip
//     // ignore center
//     const width = lines[0].length;
//     const height = lines.length;
//     const [sx,sy] = findS(lines);
// 
//     const eastOffset = width-sx;
//     const southOffset = height-sy;
// 
//     const [evenState,oddState] = getFinalState();
// 
//     let res = 0;
// 
//     // calculating the diagonals
//     {
//         let [filledSpans,remainSpan] = eucdiv(n-southOffset-eastOffset,width)
//         let cnt = 
//     }
//     const maxSafe
// 
// 
// 
// 
// 
// 
// 
// 
// 
//     const finalState1 = new Set;
//     const finalState2 = new Set;
//     for(let y = 0; y < height; y++){
//         for(let x = 0; x < width; x++){
//             if(lines[y][x] === "#")continue;
//             if((x+y)%2 === 0){
//                 finalState1.add(`${x},${y}`);
//             }else{
//                 finalState2.add(`${x},${y}`);
//             }
//         }
//     }
//     const isFinalState = function(state){
//         let isState1 = true;
//         for(let point of state){
//             if(!finalState1.has(point)){
//                 isState1 = false;
//                 break;
//             }
//         }
//         if(isState1)return 1;
//         let isState2 = true;
//         for(let point of state){
//             if(!finalState2.has(point)){
//                 isState2 = false;
//                 break;
//             }
//         }
//         if(isState2)return 2;
//         return false;
//     };
//     const findTransitionPeriod = function(x0,y0){
//         let state = new Set([`${sx},${sy}`]);
//         for(let cnt = 0;; cnt++){
//             let fs;
//             if(fs = isFinalState(state)){
//                 return [cnt,fs];
//             }
//             state = evolveState(lines,state);
//         }
//     };
//     // determins the thickness of the border region
//     // diagonals and orthogonal, and the center piece
//     const north_offset = sy+1;
//     const west_offset = sx+1;
//     const south_offset = height-sy;
//     const east_offset = width-sx;
//     let totalCount = 0;
//     // to the south east
//     {
//         const leadLength = n-south_offset-east_offset
//         const [tc,fs] = findTransitionPeriod(0,0);
//         const centerColor = (n+1)%2;
//         const edgeColor = (centerColor+(south_offset+east_offset))%2;
//         const safeLength = leadLength - tc;
//         const tileCount = Math.floor(safeLength/width);
//         const evens = Math.ceil(tileCount/2);
//         const odds = Math.floor(tileCount/2);
//         let evenTileCount = (0+evens*2-2)*evens/2;
//         let oddTileCount = (1+odds*2-1)*odds/2;
//         if(edgeColor === 1)[evenTileCount,oddTileCount] = [oddTileCount,evenTileCount];
//         const [evenState,oddState] = finalState1.has("0,0")?[finalState1,finalState2]:[finalState2,finalState1];
//         totalCount += evenTileCount*evenState.size;
//         totalCount += oddTileCount*oddState.size;
//         // find the intermediate tiles
//         for(){
//         }
//     }
// }
// 
// const problem2 = function(){
// }
// 
// const findStates = function(line,n){
//     // find the area that's completely filled in
//     // find the attack limit from four sides
//     
// }








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



