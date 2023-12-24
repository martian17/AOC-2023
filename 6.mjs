import {promises as fs} from "fs";

const lines = (await fs.readFile("./6.txt")).toString().trim().split("\n");
//const lines = `
//Time:      7  15   30
//Distance:  9  40  200
//`.trim().split("\n");


const getDistance = function(t,time){
    return t*(time-t);
}

const findTimeAbove = function(time,record){
    // binary search to find the break even point
    const tm = time/2;
    let t = 0;
    let dt = Math.floor(tm);
    while(true){
        dt = Math.floor(dt/2);
        if(dt === 0)dt = 1;

        const dist0 = getDistance(t-1,time);
        const dist = getDistance(t,time);
        if(dist0 <= record && record < dist){
            break; 
        }

        if(dist <= record){
            t += dt;
        }else{
            t -= dt;
        }
    }
    return time-((t-1)*2)-1;
}


const problem1 = function(){
    const [times,distances] = lines.map(line=>line.split(":")[1].trim().split(/\s+/g).map(v=>parseInt(v)));
    console.log(times,distances);
    let total = 1;
    for(let i = 0; i < times.length; i++){
        let ways = 0;
        const time = times[i];
        const distance = distances[i];
        for(let t = 0; t <= time; t++){
            const result = t*(time-t);
            if(result > distance){
                ways++;
            }
        }
        const ways1 = findTimeAbove(time,distance);
        console.log(ways,ways1);
        total *= ways1;
    }
    return total;
}
console.log(problem1());

const problem2 = function(){
    const [time,distance] = lines.map(line=>line.replace(/[^0-9]/g,"")).map(v=>parseInt(v));
    console.log(time,distance);
    return findTimeAbove(time,distance);
}
console.log(problem2());



