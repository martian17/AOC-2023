import {promises as fs} from "fs";
import {FIFOQueue as Queue} from "./util.mjs";

const select = 1;

let text;
switch(select){
    case 1:
text = (await fs.readFile("./23.txt")).toString();
    break;
    case 2:
text = `
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`;
    break;
}
text = text.trim();
