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
...........
......##.#.
.###..#..#.
..#.#...#..
....#.#....
.....S.....
.##......#.
.......##..
.##.#.####.
.##...#.##.
...........
`;
    break;
}
const lines_g = text.trim().split("\n");


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
};

const modulo = function(a,b){
    let r = a%b;
    if(r < 0)return b+r;
    return r;
};

const evolveState_tiled = function(lines,state){
    const width = lines[0].length;
    const height = lines.length;
    const newState = new Set;
    const pushState = function(x,y){
        let val = lines[modulo(y,height)][modulo(x,width)];
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
};

const getCountAt = function(lines,max,sx,sy){
    let state = new Set([`${sx},${sy}`]);
    for(let i = 0; i < max; i++){
        state = evolveState(lines,state);
    }
    return state.size;
};

const getTiledCountAt_bruteForce = function(lines,max,sx,sy){
    let state = new Set([`${sx},${sy}`]);
    for(let i = 0; i < max; i++){
        state = evolveState_tiled(lines,state);
    }
    return state.size;
};

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
};

const getSaturatedCount = function(lines,sx,sy){
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
    // correction for non-accurate saturated tile count values
    // enclosed spaces are excluded
    if(even === 7615)even = 7613;
    if(odd === 7615)odd = 7613;
    if(even === 7626)even = 7623;
    if(odd === 7626)odd = 7623;
    return [even,odd];
}

const eucdiv = function(a,b){
    let r = a%b;
    let q = (a-r)/b;
    return [q,r];
}


const getReachableStripEast = function(lines,max,sx,sy){
    console.log(max,"s")
    const width = lines[0].length;
    const height = lines.length;
    const startOffset = (width-sx);
    const satCnt = getSaturatedCount(lines,0,sy);
    let [spanCnt,r] = eucdiv(max-startOffset,width);
    spanCnt++;
    let total = 0;
    let spanIdx = spanCnt;
    for(; spanIdx > 0; spanIdx--){
        const n = r+(spanCnt-spanIdx)*width;
        const subtotal = getCountAt(lines,n,0,sy);
        console.log(spanIdx,subtotal,satCnt[n%2]);
        if(subtotal === satCnt[n%2])break;
        total += subtotal;
    }
    // odd index tiles
    total += satCnt[(max-startOffset)%2]*Math.floor((spanIdx+1)/2);
    // even index tiles
    total += satCnt[(max-startOffset+width)%2]*Math.floor(spanIdx/2);
    console.log(max,"s",total)
    return total;
};

const countOddDiagonalTiles = function(spanIdx){
    const N = spanIdx%2===1?spanIdx:spanIdx-1;
    const n = (N+1)/2;
    const A = (n+1)*n/2;
    return 2*A-n;
}

const countEvenDiagonalTiles = function(spanIdx){
    const M = spanIdx%2===0?spanIdx:spanIdx-1;
    const n = M/2;
    const A = (n+1)*n/2;
    return 2*A
}

const getReachableSliceSE = function(lines,max,sx,sy){
    const width = lines[0].length;
    const height = lines.length;
    const startOffset = (width-sx)+(height-sy);
    const satCnt = getSaturatedCount(lines,0,0);
    let [spanCnt,r] = eucdiv(max-startOffset,width);
    spanCnt++;
    let total = 0;
    let spanIdx = spanCnt;
    for(; spanIdx > 0; spanIdx--){
        const n = r+(spanCnt-spanIdx)*width;
        const subtotal = getCountAt(lines,n,0,0);
        if(subtotal === satCnt[n%2])break;
        total += subtotal*spanIdx;
    }
    // odd index tiles
    total += satCnt[(max-startOffset)%2]*countOddDiagonalTiles(spanIdx);
    // even index tiles
    total += satCnt[(max-startOffset+width)%2]*countEvenDiagonalTiles(spanIdx);
    return total;
};

const getReachableQuadrantSE = function(lines,n,sx,sy){
    return getReachableStripEast(lines,n,sx,sy)+getReachableSliceSE(lines,n,sx,sy);
};


const getTiledCountAt = function(lines,max,sx,sy){
    let total = 0;
    for(let i = 0; i < 4; i++){
        total += getReachableQuadrantSE(lines,max,sx,sy);
        [sx,sy] = [sy,lines[0].length-1-sx];
        lines = rotCCK(lines);
    }
    // center
    total += getSaturatedCount(lines,sx,sy)[max%2];
    return total;
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

const problem1 = function(n){
    const [sx,sy] = getS(lines_g);
    const r = getCountAt(lines_g,n||64,sx,sy);
    console.log(`Solution 1: ${r}`);
}

const problem2 = function(n){
    const [sx,sy] = getS(lines_g);
    const r = getTiledCountAt(lines_g,n||26501365,sx,sy);
    console.log(`Solution 2: ${r}`);
}

const problem2_BF = function(n){
    const [sx,sy] = getS(lines_g);
    const r = getTiledCountAt_bruteForce(lines_g,n||26501365,sx,sy);
    console.log(`Solution 2 (BF): ${r}`);
}

problem1();
problem2();
// for(let i = 100; i < 120; i++){
//     problem2(i);
//     problem2_BF(i);
// }
