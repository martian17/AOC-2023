import {promises as fs} from "fs";
import {FIFOQueue as Queue} from "./util.mjs";

const select = 1;

let text,xmin,xmax,ymin,ymax;
switch(select){
    case 1:
text = (await fs.readFile("./24.txt")).toString();
xmin = ymin = 200000000000000;
xmax = ymax = 400000000000000;
    break;
    case 2:
text = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`;
xmin = ymin = 7;
xmax = ymax = 27;
    break;
}
text = text.trim();

// (19, 13, 30) + (-2,  1, -2)t
// (18, 19, 22) + (-1, -1, -2)t
// (20, 25, 34) + (-2, -2, -4)t
// (12, 31, 28) + (-1, -2, -1)t
// (20, 19, 15) + ( 1, -5, -3)t

const lls = function(points){
    let sx = 0;
    let sy = 0;
    let sxy = 0;
    let sx2 = 0;
    let sy2 = 0;
    let n = points.length;
    for(let [x,y] of points){
        sx += x;
        sy += y;
        sxy += x*y;
        sx2 += x*x;
        sy2 += y*y;
    }
    let c1 = 2*sx2;
    let c2 = 2*sx;
    let c3 = -2*sxy;
    let c4 = 2*sx;
    let c5 = 2*n;
    let c6 = -2*sy;
    let L = c2*c4-c5*c1;
    let R = c6*c1-c3*c4;
    let b = R/L;
    let a = -(b*c2+c3)/c1;
    return [a,b];
}
const vectify = function(a,b){
    if(typeof a === "number" && b instanceof Array)
        return [b.map(v=>a),b];
    if(typeof b === "number" && a instanceof Array)
        return [a,a.map(v=>b)];
    if(a instanceof Array && b instanceof Array)
        return [a,b];
    console.log(a,b);
    throw new Error("either of the two needs to be a vector");
}

const vecdiff = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]-v2[i]);
    }
    return r;
};
const vecadd = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]+v2[i]);
    }
    return r;
};
const vecmul = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]*v2[i]);
    }
    return r;
};
const vecdiv = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]/v2[i]);
    }
    return r;
};

const vecsum = function(vec){
    let r = 0;
    for(let val of vec){
        r += val;
    }
    return r;
};

const vecNegate = function(vec){
    let r = [];
    for(let val of vec){
        r.push(-val);
    }
    return r;
};

const vecmagn = function(vec){
    let r = 0;
    for(let v of vec){
        r += v*v;
    }
    return Math.sqrt(r);
};


const findClosestPoints = function([a,va],[b,vb]){
    const A = va;
    const B = vecNegate(vb);
    const C = vecdiff(a,b);
    const c1 = vecsum(vecmul(A,A));
    const c2 = vecsum(vecmul(A,B));
    const c3 = vecsum(vecmul(A,C));
    const c4 = vecsum(vecmul(A,B));
    const c5 = vecsum(vecmul(B,B));
    const c6 = vecsum(vecmul(B,C));

    const N = c1*c6-c3*c4;
    const D = c2*c4-c1*c5;
    const t2 = N/D;
    const t1 = -(t2*c2+c3)/c1;
    return [
        vecadd(a,vecmul(va,t1)),
        vecadd(b,vecmul(vb,t2))
    ];
};

const findClosestMidPoint = function(l1,l2){
    const [p1,p2] = findClosestPoints(l1,l2);
    return vecdiv(vecadd(p1,p2),2);
}

const lls3d = function(points){
    const [a,b] = lls(points.map(([x,y,z])=>[z,x]));
    const [c,d] = lls(points.map(([x,y,z])=>[z,y]));
    const [e,f] = lls(points.map(([x,y,z])=>[x,y]));
    // e,f unused
    return [[b,d,0],[a,c,1]]
}

console.log(lls3d([[0,0,0],[1,1,1],[2,2,2],[3,3,3],[4,4,4],[10,10,10]]));

const range = function(st,ed){
    let res = [];
    for(let i = st; i < ed; i++){
        res.push(i);
    }
    return res;
}

const getError = function(lines,lapprox){
    return vecsum(lines.map(l=>findClosestPoints(lapprox,l)).map(([a,b])=>vecmagn(vecdiff(a,b))));
}

const findClosestLine = function(lines){
    //lines = lines.slice(0,4);
    //for(let dir of range(0,4).map(v=>"000"+v.toString(2)).map(v=>v.slice(-3).split("").map(v=>v==="0"?-1:1))){
        //let lapprox = [[0,0,0],dir];
        let lapprox = [[ -475681760052868.4, 5943172548142169, 0 ], [ 2.6111111111085488, -19.999999999985455, 1 ]];
        //let lapprox = [[ -475681760054848.56, 5943172548150024, 0 ], [ 2.6111111111154686, -20.00000000001306, 1 ]]
        //let lapprox = [[ -475681760054848.56, 5943172548150024, 0 ], [ 47, -360, 18 ]]
        for(let i = 0; i < 1000; i++){
            let closestPoints = lines.map(l=>findClosestPoints(lapprox,l)).map(v=>v[1]);
            //closestPoints = closestPoints.sort((a,b)=>vecmagn(vecdiff(...a))-vecmagn(vecdiff(...b))).map(v=>v[1]).slice(-2);
            //closestPoints = closestPoints.sort(v=>Math.random()-0.5).slice(0,2);
            //const closestPoints = lines.map(l=>findClosestMidPoint(lapprox,l));
            const error = vecsum(lines.map(l=>findClosestPoints(lapprox,l)).map(([a,b])=>vecmagn(vecdiff(a,b))));
            lapprox = lls3d(closestPoints);
            //lapprox[1] = [ 47, -360, 18 ];
            //console.log(error,lapprox);
        }
        const error = vecsum(lines.map(l=>findClosestPoints(lapprox,l)).map(([a,b])=>vecmagn(vecdiff(a,b))));
        console.log(error,lapprox);
    //}
    // return the approximate line
    return [[ -475681760052868.4, 5943172548142169, 0 ], [ 2.6111111111085488, -19.999999999985455, 1 ]];
}

const transformVectorZ = function(vec,refvec){
    let [rx,ry,rz] = refvec;
    const dx = rx/rz;
    const dy = ry/rz;
    let [x,y,z] = vec;
    return [
        x-dx*z,
        y-dy*z,
        z
    ];
}

const posAtT = function(line,t){
    return vecadd(line[0],vecmul(line[1],t));
}


const findXYIntersections = function(lines){
    const findIntersection = function(a,b){
        // a.x+a.vx*t == b.x+b.vx*k
        // a.y+a.vy*t == b.y+b.vy*k
        //
        // a.vx*t == b.x-a.x+b.vx*k
        // a.vy*t == b.y-a.y+b.vy*k
        // (b.x-a.x+b.vx*k)/a.vx == (b.y-a.y+b.vy*k)/a.vy
        // (b.x-a.x+b.vx*k)*a.vy == (b.y-a.y+b.vy*k)*a.vx
        // (b.x-a.x)*a.vy+b.vx*k*a.vy == (b.y-a.y)*a.vx+b.vy*k*a.vx
        // b.vx*k*a.vy-b.vy*k*a.vx == (b.y-a.y)*a.vx-(b.x-a.x)*a.vy
        // k(b.vx*a.vy-b.vy*a.vx) == (b.y-a.y)*a.vx-(b.x-a.x)*a.vy
        // k == (b.y-a.y)*a.vx-(b.x-a.x)*a.vy/(b.vx*a.vy-b.vy*a.vx)
        // t == (b.x-a.x+b.vx*k)/(vx*t);
        if((b.vx*a.vy-b.vy*a.vx) === 0 || a.vx === 0 || b.vx === 0)return false;
        
        let k = ((b.y-a.y)*a.vx-(b.x-a.x)*a.vy)/(b.vx*a.vy-b.vy*a.vx);
        let t = (b.x-a.x+b.vx*k)/(a.vx);
        let x = a.x+a.vx*t;
        let y = a.y+a.vy*t;
        return [x,y,t<0||k<0];
    }
    let coords = [];
    for(let i = 0; i < lines.length-1; i++){
        let ii = lines[i];
        for(let j = i+1; j < lines.length; j++){
            let jj = lines[j];
            let res = findIntersection(ii,jj);
            if(!res)continue;
            //let [x,y,past] = res;
            coords.push(res);
        }
    }
    return coords;
}

const solution0 = function(text){
    const lines = text.split("\n").map(l=>{
        const [x,y,z,vx,vy,vz] = l.trim().split(/\s*[,@]\s*/).map(v=>parseInt(v));
        let r = [[x,y,z],[vx,vy,vz]];
        return r;
    });
    //let lapprox = [[ -475681760052868.4, 5943172548142169, 0 ], [ 47, -360, 18 ]];//[ 2.6111111111085488, -19.999999999985455, 1 ]];
    //let lapprox = [[ 239756157786030, 463222539161931, 273997500449219 ],[ 47, -360, 18 ]];
    //let lapprox = [[ 239756157786030, 463222539161932, 273997500449219 ], [ 47, -360, 18 ]];
    let lapprox = [[ 239756157786030, 463222539161932, 273997500449219 ], [ 47, -360, 18 ]]

    //let lapprox = [[ -475681760053597, 5943172548146312, 0 ], [ 47, -360, 18 ]];
    //let lapprox = [[ 239756157786092.62, 463222539161731.5, 273997500449227.1 ], [ 47, -360, 18 ]];
    //let lapprox = [[ 239756157786124, 463222539162488, 273997500449157 ], [ 47, -360, 18 ]];
    //find the list of closest points
    const encounters = [];
    for(let line of lines){
        const cp = findClosestPoints(line,lapprox)[0];
        let cpt = vecdiv(vecdiff(cp,line[0]),line[1])[0];
        let r = (cpt%1);
        // if(0.01 < r && r < 0.99)continue; 
        cpt = Math.round(cpt);
        console.log(cpt,vecdiff(posAtT(line,cpt),posAtT(lapprox,cpt)));
        // cpt = Math.round(cpt);
        encounters.push([line,cp,cpt]);

        //console.log(cpt);
    }
    //console.log(encounters.sort((a,b)=>a[2]-b[2]));
    let xsum = [0,0,0];
    let minset = {
        error: Infinity,
        line: null
    };
    for(let i = 0; i < encounters.length-1; i++){
        let [l1,cp1,cpt1] = encounters[i];
        let [l2,cp2,cpt2] = encounters[i+1];
        const v = vecdiv(vecdiff(cp2, cp1), cpt2-cpt1);
        const x0 = vecdiff(cp1,vecmul(v,cpt1));
        xsum = vecadd(xsum,x0);
        let xx = x0.map(v=>Math.round(v));
        let vv = v.map(v=>Math.round(v));
        let error = getError(lines,[xx,vv]);
        if(error < minset.error){
            minset.error = error;
            minset.line = [xx,vv];
        }
        console.log(xx,vv,error)
    }
    console.log(minset);
    //console.log(vecdiv(xsum,encounters.length-1),[ 47, -360, 18 ]);
}

const solution = function(text){
    const lines = text.split("\n").map(l=>{
        const [x,y,z,vx,vy,vz] = l.trim().split(/\s*[,@]\s*/).map(v=>parseInt(v));
        let r = [[x,y,z],[vx,vy,vz]];
        return r;
    });
    //console.log(findClosestLine(lines));
    const approxAngle = [ 47, -360, 18 ];
    let transLines = lines.map(([x,v])=>{
        return [transformVectorZ(x,approxAngle),transformVectorZ(v,approxAngle)];
    }).map(l=>{
        const [x,y,z] = l[0];
        const [vx,vy,vz] = l[1];
        return {x,y,z,vx,vy,vz};
    });

    console.log(transLines);
    console.log(findXYIntersections(transLines).map(([a,b,c])=>[Math.round(a),Math.round(b)]));
}

solution0(text);
//solution(text);

