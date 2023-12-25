import {promises as fs} from "fs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./13.txt")).toString();
    break;
    case 2:
text = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;
    break;
}

const transpose = function(block){
    let res = [];
    for(let i = 0; i < block[0].length; i++){
        res.push(block.map(b=>b[i]).join(""));
    }
    return res;
};


const checkReflections1 = function(mirror){
    const reflections = [];
    outer:
    for(let i = 0; i < mirror.length-1; i++){
        for(let j = 0; j < mirror.length; j++){
            const r1 = mirror[i-j];
            const r2 = mirror[i+1+j];
            if(!r1 || !r2)break;
            if(r1 !== r2)continue outer;
        }
        reflections.push(i+1);
    }
    return reflections
}

const solve1 = function(mirrors){
    let sum = 0;
    for(let mirror of mirrors){
        const rowReflections = checkReflections1(mirror);
        const columnReflections = checkReflections1(transpose(mirror));
        if(columnReflections.length + rowReflections.length !== 1){
            console.log(columnReflections,rowReflections);
            throw new Error("Multiple reflections");
        }
        sum += (rowReflections[0]||0)*100+(columnReflections[0]||0);
    }
    return sum;
}

const countDifferences = function(s1,s2){
    let cnt = 0;
    for(let i = 0; i < s1.length; i++){
        if(s1[i] !== s2[i])cnt++;
    }
    return cnt;
}

const checkReflections2 = function(mirror){
    const reflections = [];
    outer:
    for(let i = 0; i < mirror.length-1; i++){
        let smudges = 0;
        for(let j = 0; j < mirror.length; j++){
            const r1 = mirror[i-j];
            const r2 = mirror[i+1+j];
            if(!r1 || !r2)break;
            smudges += countDifferences(r1,r2);
            if(smudges > 1)continue outer;
        }
        if(smudges !== 1)continue outer;
        reflections.push(i+1);
    }
    return reflections;
}

const solve2 = function(mirrors){
    let sum = 0;
    for(let mirror of mirrors){
        const rowReflections = checkReflections2(mirror);
        const columnReflections = checkReflections2(transpose(mirror));
        if(columnReflections.length + rowReflections.length !== 1){
            console.log(columnReflections,rowReflections);
            throw new Error("Multiple reflections");
        }
        sum += (rowReflections[0]||0)*100+(columnReflections[0]||0);
    }
    return sum;
}

console.log(solve1(text.trim().split("\n\n").map(m=>m.trim().split("\n"))));
console.log(solve2(text.trim().split("\n\n").map(m=>m.trim().split("\n"))));
