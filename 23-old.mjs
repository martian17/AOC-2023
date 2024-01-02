import {promises as fs} from "fs";
import {FIFOQueue as Queue} from "./util.mjs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./23.txt")).toString();
    break;
    case 2:
text = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`;
    break;
    case 3:
text = `
#.#
#.#
`;
    break;
}
text = text.trim();

const corners = [[1,0,">"],[0,1,"v"],[-1,0,"<"],[0,-1,"^"]];

const problem1 = function(text){
    // segmentation -> (tree shaking) -> recursive traversal
    const lines = text.split("\n");
    const width = lines[0].length;
    const height = lines.length;
    let sx = 1;
    let sy = 0;
    let gx = width-2;
    let gy = height-1;
    // flood fill plateu
    const segments = new Map;
    const tt = function(x0,y0){
        let goal = false;
        let ttid = `${x0},${y0}`;
        if(segments.has(ttid))return segments.get(ttid);
        let passed = new Set([ttid]);
        let outlets = [];
        const traverse = function(x,y){
            if(x === gx && y === gy)goal = true;
            let nexts = [];
            let localOutlets = [];
            for(let [dx,dy,nc] of corners){
                const x1 = x+dx;
                const y1 = y+dy;
                const r = lines[y1]?.[x1];
                if(r === nc)localOutlets.push([x1+dx,y1+dy]);
                if(r !== ".")continue;
                const id = `${x1},${y1}`;
                if(passed.has(id))continue;
                passed.add(id);
                nexts.push([x1,y1]);
            }
            if(nexts.length > 1){
                console.log(nexts);
                console.log("branch found!!");
            }
            if(nexts.length !== 0 && localOutlets.length !== 0){
                console.log("early outlet found!!");
            }
            for(let [x1,y1] of localOutlets){
                outlets.push([x1,y1]);
            }
            for(let [x1,y1] of nexts){
                traverse(x1,y1);
            }
        }
        traverse(x0,y0);
        let segment = {
            length: passed.size,
            goal,
            next: []
        }
        for(let [x,y] of outlets){
            segment.next.push(tt(x,y));
        }
        segments.set(ttid,segment);
        return segment;
    }
    let seg0 = tt(sx,sy);
    let maxCnt = 0;
    let tseg = function(seg,cnt){
        cnt += seg.length;
        if(seg.goal && maxCnt < cnt){
            maxCnt = cnt;
        }
        for(let nseg of seg.next){
            tseg(nseg,cnt+1);
        }
    }
    tseg(seg0,0);
    console.log(maxCnt-1);
}

const problem2 = function(text){
    // segmentation -> (tree shaking) -> recursive traversal
    const lines = text.split("\n");
    const width = lines[0].length;
    const height = lines.length;
    let sx = 1;
    let sy = 0;
    let gx = width-2;
    let gy = height-1;
    // do a dumb TSP search
    const stack = [];
    let x = sx;
    let y = sy;
    let dir = 0;
    const visited = new Set;
    let max = 0;
    while(true){
        let id = `${x},${y}`;
        if(dir === 4){
            visited.delete(id);
            if(stack.length === 0)break;
            ({x,y,dir} = stack.pop());
            continue;
        }
        //console.log(x,y,dir);
        if(x === gx && y === gy){
            let len = visited.size;
            if(len > max)max = len;
        }
        let [dx,dy] = corners[dir];
        let x1 = x+dx;
        let y1 = y+dy;
        let id1 = `${x1},${y1}`;
        const r = lines[y1]?.[x1];
        if(!r || r === "#" || visited.has(id1)){
            dir++;
            continue;
        }
        visited.add(id)
        stack.push({x,y,dir:dir+1});
        x = x1;
        y = y1;
        dir = 0;
    }
    console.log("problem 2:",max);
}


problem1(text);
problem2(text);



