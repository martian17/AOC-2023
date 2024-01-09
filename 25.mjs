import {promises as fs} from "fs";
import {FIFOQueue as Queue} from "./util.mjs";

const select = 2;

let text,xmin,xmax,ymin,ymax;
switch(select){
    case 1:
text = (await fs.readFile("./25.txt")).toString();
    break;
    case 2:
text = `
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`;
    break;
}
text = text.trim();

const solve1 = function(text){
    let graph = new Map;
    const addEdge = function(a,b){
        if(!graph.has(a)){
            graph.set(a,[]);
        }
        if(!graph.has(b)){
            graph.set(b,[]);
        }
        graph.get(a).push(b);
        graph.get(b).push(a);
    }
    const lines = text.split("\n").map(v=>{
        let [a,...r] = v.split(" ");
        a = a.slice(0,-1);
        for(let b of r){
            addEdge(a,b);
        }
        return [a,r]
    });
    console.log(graph);
    // let cnt = 0;
    // for(let i = 0; i < lines.length-2; i++){
    //     for(let j = 0; j < lines.length-1; j++){
    //         for(let k = 0; k < lines.length-0; k++){
    //             
    //             cnt++;
    //         }
    //     }
    // }
    // console.log(cnt);
}

solve1(text);



