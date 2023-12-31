import {promises as fs} from "fs";
import {MinHeap} from "ds-js/heap.mjs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./22.txt")).toString();
    break;
    case 2:
text = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`;
    break;
}

text = text.trim();
const parseText = function(text){
    let labels = "ABCDEFGHIJKLMN";
    const bricks = text.split("\n").map((l,i)=>{
        let [[x0,y0,z0],[x1,y1,z1]] = l.split("~").map(v=>v.split(",").map(v=>parseInt(v)));
        if(x0>x1)[x0,x1] = [x1,x0];
        if(y0>y1)[y0,y1] = [y1,y0];
        if(z0>z1)[z0,z1] = [z1,z0];
        x1++;
        y1++;
        z1++;
        return {
            x0,y0,z0,x1,y1,z1,
            name: labels[i],
            cascade: -1,
            supports: new Set,
            supportedBy: new Set// unnecessary alloc but whatever
        };
        
    })
    return bricks.sort((a,b)=>a.z0-b.z0);// sort small to big
};

const linearIntersects = function(a0,a1,b0,b1){
    return a0 < b1 && b0 < a1;
};

const xyIntersects = function(b1,b2){
    return linearIntersects(b1.x0,b1.x1,b2.x0,b2.x1) && linearIntersects(b1.y0,b1.y1,b2.y0,b2.y1);
};

const problem1 = function(text){
    const bricks = parseText(text);
    const solidified = [];
    for(let brick of bricks){
        let maxBricks = [];
        let max = 1;
        for(let brick0 of solidified){
            if(xyIntersects(brick,brick0)){
                if(brick0.z1 === max){
                    maxBricks.push(brick0);
                }else if(brick0.z1 > max){
                    maxBricks = [brick0];
                    max = brick0.z1;
                }
            }
        }
        let dz = brick.z1 - brick.z0;
        brick.z0 = max;
        brick.z1 = max+dz;
        brick.supportedBy = new Set(maxBricks);
        maxBricks.map(b=>b.supports.add(brick));
        solidified.push(brick);
    }
    console.log("Solution 1:",bricks.filter(b=>{
        let safe = true;
        for(let b1 of b.supports){
            if(b1.supportedBy.size === 1)safe = false;
        }
        if(safe)console.log(b.name);
        return safe;
    }).length);
}

const settleBricks = function(bricks){
    const solidified = [];
    for(let brick of bricks){
        let maxBricks = [];
        let max = 1;
        for(let brick0 of solidified){
            if(xyIntersects(brick,brick0)){
                if(brick0.z1 === max){
                    maxBricks.push(brick0);
                }else if(brick0.z1 > max){
                    maxBricks = [brick0];
                    max = brick0.z1;
                }
            }
        }
        let dz = brick.z1 - brick.z0;
        brick.z0 = max;
        brick.z1 = max+dz;
        brick.supportedBy = new Set(maxBricks);
        maxBricks.map(b=>b.supports.add(brick));
        solidified.push(brick);
    }
}

const problem2 = function(text){
    const bricks = parseText(text);
    settleBricks(bricks);
    let cnt = 0;
    for(let originBrick of bricks){
        const queue = new MinHeap;
        queue.add(originBrick,originBrick.z0);
        let queued = new Set([originBrick]);
        const fallen = new Set();
        outer:
        while(!queue.isEmpty()){
            const brick = queue.pop();
            if(brick !== originBrick){
                if(brick.z0 === 1)continue;
                for(let b0 of brick.supportedBy){
                    if(!fallen.has(b0))continue outer;
                }
            }
            fallen.add(brick);
            for(let b1 of brick.supports){
                if(queued.has(b1))continue;
                queued.add(b1)
                queue.add(b1,b1.z0);
            }
        }
        cnt += fallen.size-1;
    }
    console.log("solution 2:",cnt);
}

problem1(text);
problem2(text);

