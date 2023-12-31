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
    const verts = new Map;
    const lines = text.split("\n");
    const width = lines[0].length;
    const height = lines.length;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            let c0 = lines[y][x];
            if(c0 === "#")continue
            let vert = new Map;
            for(let [dx,dy] of corners){
                let x1 = x+dx;
                let y1 = y+dy;
                if(x1 < 0 || y1 < 0 || x1 >= width || y1 >= height)continue;
                let c1 = lines[y1][x1];
                if(c1 === "#")continue
                vert.set(`${x1},${y1}`,1);
            }
            verts.set(`${x},${y}`,vert);
        }
    }
    for(let [vid,vert] of [...verts]){
        if(vert.size !== 2)continue;
        //splice
        const [[v1id,v1w],[v2id,v2w]] = vert;
        const w = v1w+v2w;
        const v1 = verts.get(v1id);
        const v2 = verts.get(v2id);
        v1.delete(vid);
        v2.delete(vid);
        verts.delete(vid);
        v1.set(v2id,w);
        v2.set(v1id,w);
    }
    console.log(verts);
    //brute force search through the verts
    console.log(width,height);
    let max = 0;
    const traverse = function(vid,w,visited){
        if(vid === `${width-2},${height-1}`){
            if(w > max)max = w;
            return;
        }
        const vert = verts.get(vid);
        for(let [vid1,w1] of vert){
            if(visited.has(vid1))continue;
            visited.add(vid1)
            traverse(vid1,w+w1,visited);
            visited.delete(vid1);
        }
    }
    traverse("1,0",0,new Set);
    console.log("problem 2:",max);
}


problem1(text);
problem2(text);



