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
xmax = ymax = 27
    break;
}
text = text.trim();



const problem1 = function(text){
    const lines = text.split("\n").map(l=>{
        const [x,y,z,vx,vy,vz] = l.trim().split(/\s*[,@]\s*/).map(v=>parseInt(v));
        let r = {x,y,z,vx,vy,vz};
        return r;
    });
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
    let cnt = 0;
    for(let i = 0; i < lines.length-1; i++){
        let ii = lines[i];
        for(let j = i+1; j < lines.length; j++){
            let jj = lines[j];
            let res = findIntersection(ii,jj);
            if(!res)continue;
            let [x,y,past] = res;
            //if(ii.x === 19 && jj.x === 18){
            //    console.log("adfs");
            //    console.log(ii,jj);
            //    console.log(x,y);
            //}
            if(x >= xmin && y >= ymin && x <= xmax && y <= ymax && !past){
                cnt++;
                //console.log(ii,jj,x,y);
            }
        }
    }
    console.log(cnt);
}

problem1(text);

const findABCDE = function(l1,l2){
    const {x:x1,y:y1,z:z1,vx:vx1,vy:vy1,vz:vz1} = l1;
    const {x:x2,y:y2,z:z2,vx:vx2,vy:vy2,vz:vz2} = l2;
    const A = (vx1-vx2);
    const B = (vx1-vx2)*(vy1+vy2)+x1*y1-x2*y2;
    const C = vy1*vy2*(vx1-vx2)-(x1*y1*vy2-x2*y2*vy2);
    const D = (x1-x2);
    const E = -x1*vy2+x2*vy1;
    return [A,B,C,D,E];
    // const A = (l1.vx-l2.vx);
    // const B = (l1.vx-l2.vx)*(l1.vy+l2.vy)+(l1.x*l1.y-l2.x+l2.y);
    // const C = l1.vy*l2.vy*(l1.vx-l2.vx)-(l1.x*l1.y*l2.vy-l2.x*l2.y*l1.vy);
    // const D = (l1.x-l2.x);
    // const E = 
}

const findVelocities = function(l1,l2,l3){
    const {x:x1,y:y1,z:z1,vx:vx1,vy:vy1,vz:vz1} = l1;
    const {x:x2,y:y2,z:z2,vx:vx2,vy:vy2,vz:vz2} = l2;
    const {x:x3,y:y3,z:z3,vx:vx3,vy:vy3,vz:vz3} = l3;
    // Find y
    const [A1,B1,C1,D1,E1] = findABCDE(l1,l2);
    const [A2,B2,C2,D2,E2] = findABCDE(l1,l3);
    let x,y,z,vx,vy,vz;
    {
        const Y3 = A1*D2;
        const Y2 = A1*E2+B1*D2;
        const Y1 = B1*E2+C1*D2;
        const Y0 = C1*E2;
        vy = solveQ3(Y3,Y2,Y1,Y0);
    }
    {
        const Y1 = vy-vy1;
        const Y2 = vy-vy2;
        y = ((vx1-vx2)*Y1*Y2+x1*y1*Y2-x2*y2*Y1)/(x1*Y2-x2*Y1);
    }
    {
        vx = (-x1*(y-y1))/(vy-vy1)+vx1;
    }
    {
        vz = (vz1*(y-y1)*(vy-vy2)-vz2*(y-y2)*(vy-vy1)-(z1-z2)*(vy-vy1)*(vy-vy2))/((y-y1)*(vy-vy2)-(y-y2)*(vy-vy1))
    }
    return [vx,vy,vz];
}

const findParameters = function(l1,l2,l3){
    const [vx,vy,vz] = findVelocities(l1,l2,l3);

}


const problem2 = function(text){
    const lines = text.split("\n").map(l=>{
        const [x,y,z,vx,vy,vz] = l.trim().split(/\s*[,@]\s*/).map(v=>parseInt(v));
        let r = {x,y,z,vx,vy,vz};
        return r;
    });
    const [x,y,z,vx,vy,vz] = findParameters(...lines.slice(0,3));
}



