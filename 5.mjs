import {promises as fs} from "fs";

const lines = (await fs.readFile("./5.txt")).toString().trim()//.split("\n");
//const lines = `
// seeds: 79 14 55 13
// 
// seed-to-soil map:
// 50 98 2
// 52 50 48
// 
// soil-to-fertilizer map:
// 0 15 37
// 37 52 2
// 39 0 15
// 
// fertilizer-to-water map:
// 49 53 8
// 0 11 42
// 42 0 7
// 57 7 4
// 
// water-to-light map:
// 88 18 7
// 18 25 70
// 
// light-to-temperature map:
// 45 77 23
// 81 45 19
// 68 64 13
// 
// temperature-to-humidity map:
// 0 69 1
// 1 0 69
// 
// humidity-to-location map:
// 60 56 37
// 56 93 4
// `.trim()//.split("\n");

const max = (a,b)=>a<b?b:a;
const min = (a,b)=>a<b?a:b;



class SeedMap{
    ranges = [];
    rmin = 0;
    rmax = 0;
    constructor(mapinfo){
        const lines = mapinfo.split("\n").slice(1);
        let ranges = [];
        for(let line of lines){
            let [dest,origin,range] = line.split(" ").map(v=>parseInt(v));
            let start = origin;
            let end = origin+range;
            ranges.push([start,end,dest]);
        }
        ranges = ranges.sort((r1,r2)=>r1[0]-r2[0])
        let ranges2 = [ranges[0]];
        for(let i = 0; i < ranges.length-1; i++){
            let [s1,e1,d1] = ranges[i];
            let [s2,e2,d2] = ranges[i+1];
            if(e1 < s2){
                console.log("gap found, pushing",ranges[i],ranges[i+1]);
                ranges2.push([e1,s2,e1]);
            }
            ranges2.push([s2,e2,d2]);
        }
        this.ranges = ranges2;
        this.rmin = ranges2[0][0];
        this.rmax = ranges2.at(-1)[1];
        console.log("r2",ranges2);
    }
    convert(v0){
        let results = this.ranges.filter(([start,end,dest])=>start <= v0 && v0 < end).map(([start,end,dest])=>v0-start+dest);
        if(results.length > 1){
            throw new Error("too many results");
        }
        if(results.length === 0)return v0;//null;
        return results[0];
    }
    mapRange([s0,e0]){
        let res = [];
        if(s0 < this.rmin){
            res.push([s0,min(e0,this.rmin)]);
        }
        if(e0 > this.rmax){
            res.push([max(s0,this.rmax),e0]);
        }
        const ranges = this.ranges.map(([start,end,dest])=>{
            let s1 = max(s0,start);
            let e1 = min(e0,end);
            let d1 = s1-start+dest;
            return [d1,e1-s1+d1];
        }).filter(([s2,e2])=>s2<e2);
        return [...ranges,...res];
    }
    reverseMap(v){
        let results = this.ranges.filter(([start,end,dest])=>dest <= v && v < dest+(end-start)).map(([start,end,dest])=>v-dest+start);
        return results[0] || v;
    }
}


let [seeds,...maps] = lines.split("\n\n");
seeds = seeds.split(":")[1].trim().split(" ").map(v=>parseInt(v));
maps = maps.map(m=>new SeedMap(m));

{
const locations = [];
outer:
for(let seed of seeds){
    let val = seed;
    for(let map of maps){
        val = map.convert(val);
    }
    locations.push(val);
}

console.log(locations.sort((a,b)=>a-b));
}

{
let ranges = [];
for(let i = 0; i < seeds.length; i+=2){
    ranges.push([seeds[i],seeds[i]+seeds[i+1]])
}
console.log("range0",ranges);
for(let map of maps){
    ranges.sort((a,b)=>a[0]-b[0]);
    ranges = ranges.flatMap(r=>map.mapRange(r));
}
console.log(ranges.sort((a,b)=>a[0]-b[0]));
console.log("answer is:",ranges.sort((a,b)=>a[0]-b[0])[0][0]);

}

// let vv = 0;
// for(let i = maps.length-1; i >= 0; i--){
//     vv = maps[i].reverseMap(vv);
// }
// console.log(vv);
// 
// 
// let vvv = 479518668;
// for(let map of maps){
//     vvv = map.convert(vvv);
// }
// console.log(vvv);
console.log(max(2,1));

