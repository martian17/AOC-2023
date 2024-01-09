import {promises as fs} from "fs";
import {FIFOQueue as Queue} from "./util.mjs";
import {MinHeap} from "ds-js/heap.mjs"

const select = 1;

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

let loopPairs = function*(arr){
    for(let i = 0; i < arr.length-1; i++){
        console.log(i,arr.length)
        for(let j = i+1; j < arr.length; j++){
            yield [arr[i],arr[j]];
        }
    }
}

class Pair{
    constructor(a,b){
        this.a = a;
        this.b = b;
    }
    has(c){
        const {a,b} = this;
        return a === c || b === c;
    }
    other(c){
        const {a,b} = this;
        if(c === a)return b;
        if(c === b)return a;
        return undefined;
    }
}

const toId = function(s1,s2){
    return s1<s2?s1+s2:s2+s1;
}


const markedDijkstra = function(st,ed,graph,usedEdges){
    const heap = new MinHeap;
    heap.add([null,st],0);
    const routeMap = new Map;
    while(!heap.isEmpty()){
        const [[n0,n1],d] = heap.ppop();
        //console.log(n0,n1,d);
        if(routeMap.has(n1)){
            const [n00,d0] = routeMap.get(n1);
            if(d0 <= d)continue;
        }
        routeMap.set(n1,[n0,d]);
        if(n1 === ed){
            let res = [];
            let p = n1;
            //console.log("routemap",p,routeMap);
            //console.log(routeMap,p);
            while(p !== st){
                const [p0,d] = routeMap.get(p);
                if(!p0)break;
                const id = toId(p0,p);
                res.push(id);
                p = p0;
            }
            return res.reverse();
        }
        for(let n2 of graph.get(n1)){
            //console.log(n2);
            let id = toId(n1,n2);
            if(usedEdges.has(id))continue;
            heap.add([n1,n2],d+1);
        }
    }
}

const markedDFS = function(st,ed,graph,usedEdges){
    let stack = [];
    let passed = new Set;
    const recurse = function(n1){
        if(passed.has(n1))return;
        passed.add(n1);
        for(let n2 of graph.get(n1)){
            let id = toId(n1,n2);
            if(usedEdges.has(id))continue;
            stack.push(id);
            if(n2 === ed)return stack;
            let res = recurse(n2);
            if(res)return res;
            stack.pop();
        }
        passed.delete(n1);
    }
    return recurse(st);
}

const solution = function(text){
    const graph = new Map;
    const addEdge = function(a,b){
        if(!graph.has(a))graph.set(a,new Set);
        graph.get(a).add(b);
    }
    for(let line of text.trim().split("\n")){
        const [nname,...rest] = line.split(/[\s\:]+/g)
        for(let r of rest){
            //let edge = new Pair(nname,r);
            addEdge(nname,r);
            addEdge(r,nname);
        }
    }
    //console.log(graph);
    
    // find inseparable pairs
    const inseparablePairs = [];
    outer:
    for(let [n1,n2] of loopPairs([...graph.keys()])){
        let usedEdges = new Set;
        for(let i = 0; i < 4; i++){
            const route = markedDijkstra(n1,n2,graph,usedEdges);
            //console.log(n1,n2,route);
            if(!route)continue outer;
            for(let edge of route){
                usedEdges.add(edge);
            }
        }
        inseparablePairs.push([n1,n2]);
    }
    let sets = [];
    let all = new Set;
    outerZwei:
    for(let [n1,n2] of inseparablePairs){
        all.add(n1);
        all.add(n2);
        for(let set of sets){
            if(set.has(n1) || set.has(n2)){
                set.add(n1);
                set.add(n2);
                continue outerZwei;
            }
        }
        sets.push(new Set([n1,n2]));
    }
    console.log(sets);
    console.log(sets.length);
}




solution(text);



