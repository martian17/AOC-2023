import {promises as fs} from "fs";

const lines = (await fs.readFile("./7.txt")).toString().trim().split("\n");
// const lines = `
// 32T3K 765
// T55J5 684
// KK677 28
// KTJJT 220
// QQQJA 483
// `.trim().split("\n");

// Problem 1
{
const cardToNumber = "23456789TJQKA".split("").map((v,i)=>[v,i]).reduceRight((obj,[v,i])=>(obj[v]=i+2,obj),{});

const getClass = function(cards){
    cards = cards.split("").map(v=>cardToNumber[v]);
    cards.sort((a,b)=>a-b);
    let stacks = [];
    let top = null;
    for(let card of cards){
        if(card === top){
            stacks[stacks.length-1]++;
        }else{
            top = card;
            stacks.push(1);
        }
    }
    stacks.sort((a,b)=>b-a);
    if(stacks[0] === 5){
        return 7;
    }else if(stacks[0] === 4){
        return 6;
    }else if(stacks[0] === 3 && stacks[1] === 2){
        return 5;
    }else if(stacks[0] === 3 && stacks[1] === 1){
        return 4;
    }else if(stacks[0] === 2 && stacks[1] === 2){
        return 3;
    }else if(stacks[0] === 2){
        return 2;
    }else{
        return 1;
    }
}


const compareCards = function(a,b){
    const ca = getClass(a);
    const cb = getClass(b);
    if(ca !== cb){
        return ca-cb;
    }
    for(let i = 0; i < a.length; i++){
        const apower = cardToNumber[a[i]];
        const bpower = cardToNumber[b[i]];
        if(apower === bpower){
            continue;
        }
        return apower-bpower;
    }
}

const res = lines.sort((l1,l2)=>compareCards(l1.split(" ")[0],l2.split(" ")[0])).map((card,i)=>{
    i++;
    const bid = parseInt(card.split(" ")[1]);
    return i*bid;
}).reduce((a,b)=>a+b);
console.log(res);
}


// Problem 2
{
const cardToNumber = "J23456789TQKA".split("").map((v,i)=>[v,i]).reduceRight((obj,[v,i])=>(obj[v]=i+1,obj),{});
console.log(cardToNumber);

const keyCache = {};

const getClass = function(cards0){
    let cards = cards0.replace(/J/g,"").split("").map(v=>cardToNumber[v]);
    let nJokers = cards0.replace(/[^J]/g,"").length;
    cards.sort((a,b)=>a-b);
    let stacks = [];
    let top = null;
    for(let card of cards){
        if(card === top){
            stacks[stacks.length-1]++;
        }else{
            top = card;
            stacks.push(1);
        }
    }
    stacks.sort((a,b)=>b-a);
    if(nJokers !== 0){
        const key = JSON.stringify([stacks,nJokers]);
        keyCache[key] = 0;
    }
    if(stacks.length === 0){
        stacks[0] = nJokers;
    }else{
        stacks[0] += nJokers;
    }
    if(stacks.reduce((a,b)=>a+b) !== 5)console.log(stacks,nJokers);
    if(stacks[0] === 5){
        return 7;
    }else if(stacks[0] === 4){
        return 6;
    }else if(stacks[0] === 3 && stacks[1] === 2){
        return 5;
    }else if(stacks[0] === 3 && stacks[1] === 1){
        return 4;
    }else if(stacks[0] === 2 && stacks[1] === 2){
        return 3;
    }else if(stacks[0] === 2){
        return 2;
    }else{
        return 1;
    }
}


const compareCards = function(a,b){
    const ca = getClass(a);
    const cb = getClass(b);
    if(ca !== cb){
        return ca-cb;
    }
    for(let i = 0; i < a.length; i++){
        const apower = cardToNumber[a[i]];
        const bpower = cardToNumber[b[i]];
        if(apower === bpower){
            continue;
        }
        return apower-bpower;
    }
}

const res = lines.sort((l1,l2)=>compareCards(l1.split(" ")[0],l2.split(" ")[0])).map((card,i)=>{
    i++;
    const bid = parseInt(card.split(" ")[1]);
    return i*bid;
}).reduce((a,b)=>a+b);
console.log(res);
console.log(Object.keys(keyCache));
}

