import {promises as fs} from "fs";
import {MinHeap} from "ds-js/heap.mjs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./17.txt")).toString();
    break;
    case 2:
text = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`;
    break;
}

const atodelta = [
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


const isCoordinateValid = function(x,y,width,height){
    return x >= 0 && y >= 0 && x < width && y < height;
};

const range = function(a,b){
    const arr = [];
    for(let i = a; i < b; i++){
        arr.push(i);
    }
    return arr;
}

const dijkstra = function(graph,start,destinations){
    destinations = new Set(destinations);
    const heap = new MinHeap();
    heap.add([start,null],0);
    const passed = new Set;
    while(true){
        let [metaNode,w] = heap.ppop();
        const node = metaNode[0];
        if(passed.has(node))continue;
        passed.add(node);
        if(destinations.has(node)){
            console.log(heap);
            const route = [];
            while(metaNode !== null){
                route.push(metaNode[0]);
                metaNode = metaNode[1];
            }
            return [start,node,w,route.reverse()];
        }
        const links = graph.get(node);
        for(let [node1,w1] of links){
            heap.add([node1,metaNode],w+w1);
        }
    }
}


const solve1 = function(lines){
    const grid = lines.map(l=>l.trim().split("").map(v=>parseInt(v)));
    const width = lines[0].length;
    const height = lines.length;
    // convert to directed graph
    const graph = new Map;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            for(let a = 0; a < 4; a++){
                const [dx,dy] = atodelta[a];
                // angle
                const id = `${x},${y},${a}`;
                const left = mod4(a-1);
                const right = mod4(a+1);
                const lx = x+atodeltax[left];
                const ly = y+atodeltay[left];
                const rx = x+atodeltax[right];
                const ry = y+atodeltay[right];
                const cx = x+atodeltax[a];
                const cy = y+atodeltay[a];

                const lid = `${lx},${ly},${left}`;
                const rid = `${rx},${ry},${right}`;
                const cid = `${cx},${cy},${a}`;

                const lv = isCoordinateValid(lx,ly,width,height);
                const rv = isCoordinateValid(rx,ry,width,height);
                const cv = isCoordinateValid(cx,cy,width,height);


                const d0 = [];
                if(lv)d0.push([`${lid},0`,grid[ly][lx]]);
                if(rv)d0.push([`${rid},0`,grid[ry][rx]]);
                if(cv)d0.push([`${cid},1`,grid[cy][cx]]);
                const d1 = [];
                if(lv)d1.push([`${lid},0`,grid[ly][lx]]);
                if(rv)d1.push([`${rid},0`,grid[ry][rx]]);
                if(cv)d1.push([`${cid},2`,grid[cy][cx]]);
                const d2 = [];
                if(lv)d2.push([`${lid},0`,grid[ly][lx]]);
                if(rv)d2.push([`${rid},0`,grid[ry][rx]]);
                graph.set(`${id},0`,d0)
                graph.set(`${id},1`,d1)
                graph.set(`${id},2`,d2)
            }
        }
    }
    // run dijkstra on graph
    const sol1 = dijkstra(graph,"0,0,0,0",[
        `${width-1},${height-1},0,0`,
        `${width-1},${height-1},0,1`,
        `${width-1},${height-1},0,2`,
        `${width-1},${height-1},1,0`,
        `${width-1},${height-1},1,1`,
        `${width-1},${height-1},1,2`
    ]);
    const sol2 = dijkstra(graph,"0,0,1,0",[
        `${width-1},${height-1},0,0`,
        `${width-1},${height-1},0,1`,
        `${width-1},${height-1},0,2`,
        `${width-1},${height-1},1,0`,
        `${width-1},${height-1},1,1`,
        `${width-1},${height-1},1,2`
    ]);
    const [start,end,distance,route] = sol1[2] < sol2[2] ? sol1 : sol2;
    // visualize the route
    const charGrid = lines.map(l=>l.split(""));
    const angleCharMap = ">v<^";
    for(let node of route){
        let [x,y,a,d] = node.split(",").map(v=>parseInt(v));
        charGrid[y][x] = angleCharMap[a];
    }
    console.log(charGrid.map(l=>l.join("")).join("\n"));
    console.log(start,end,distance,route);
    console.log("Solution 1:",distance);
};

const solve2 = function(lines){
    const grid = lines.map(l=>l.trim().split("").map(v=>parseInt(v)));
    const width = lines[0].length;
    const height = lines.length;
    // convert to directed graph
    const graph = new Map;
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            for(let a = 0; a < 4; a++){
                const [dx,dy] = atodelta[a];
                // angle
                const id = `${x},${y},${a}`;
                const left = mod4(a-1);
                const right = mod4(a+1);
                const lx = x+atodeltax[left];
                const ly = y+atodeltay[left];
                const rx = x+atodeltax[right];
                const ry = y+atodeltay[right];
                const cx = x+atodeltax[a];
                const cy = y+atodeltay[a];

                const lid = `${lx},${ly},${left}`;
                const rid = `${rx},${ry},${right}`;
                const cid = `${cx},${cy},${a}`;

                const lv = isCoordinateValid(lx,ly,width,height);
                const rv = isCoordinateValid(rx,ry,width,height);
                const cv = isCoordinateValid(cx,cy,width,height);

                for(let i = 0; i < 9; i++){
                    const localId = `${id},${i}`;
                    const d = graph.get(localId) || [];
                    if(cv)d.push([`${cid},${i+1}`,grid[cy][cx]]);
                    graph.set(localId,d)
                }
                for(let i = 3; i < 10; i++){
                    const localId = `${id},${i}`;
                    const d = graph.get(localId) || [];
                    if(lv)d.push([`${lid},0`,grid[ly][lx]]);
                    if(rv)d.push([`${rid},0`,grid[ry][rx]]);
                    graph.set(localId,d)
                }
            }
        }
    }
    console.log(graph);
    // run dijkstra on graph
    const sol1 = dijkstra(graph,"0,0,0,0",[
        ...range(0,10).map(v=>`${width-1},${height-1},0,${v}`),
        ...range(0,10).map(v=>`${width-1},${height-1},1,${v}`)
    ]);
    const sol2 = dijkstra(graph,"0,0,1,0",[
        ...range(0,10).map(v=>`${width-1},${height-1},0,${v}`),
        ...range(0,10).map(v=>`${width-1},${height-1},1,${v}`)
    ]);
    const [start,end,distance,route] = sol1[2] < sol2[2] ? sol1 : sol2;
    // visualize the route
    const charGrid = lines.map(l=>l.split(""));
    const angleCharMap = ">v<^";
    for(let node of route){
        let [x,y,a,d] = node.split(",").map(v=>parseInt(v));
        charGrid[y][x] = "\u001b[33m"+charGrid[y][x]+"\u001b[0m"//angleCharMap[a];
    }
    console.log(charGrid.map(l=>l.join("")).join("\n"));
    console.log(start,end,distance,route);
    console.log("Solution 2:",distance);

    // console.log(`8,4,1,4`  ,graph.get(`8,4,1,4`  ));
    // console.log(`9,4,0,0`  ,graph.get(`9,4,0,0`  ));
    // console.log(`10,4,0,1` ,graph.get(`10,4,0,1` ));
    // console.log(`11,4,0,2` ,graph.get(`11,4,0,2` ));
    // console.log(`12,4,0,3` ,graph.get(`12,4,0,3` ));
    // console.log(`12,5,1,0` ,graph.get(`12,5,1,0` ));
    // console.log(`12,6,1,1` ,graph.get(`12,6,1,1` ));
    // console.log(`12,7,1,2` ,graph.get(`12,7,1,2` ));
    // console.log(`12,8,1,3` ,graph.get(`12,8,1,3` ));
    // console.log(`12,9,1,4` ,graph.get(`12,9,1,4` ));
    // console.log(`12,10,1,5`,graph.get(`12,10,1,5`));
    // console.log(`12,11,1,6`,graph.get(`12,11,1,6`));
    // console.log(`12,12,1,7`,graph.get(`12,12,1,7`));
}

//solve1(text.trim().split("\n"));
solve2(text.trim().split("\n"));


