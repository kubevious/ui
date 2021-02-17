import {
    DN_LIST,
} from '../boot/diagramMockData'



export function randomInt(x: number) : number
{
    return Math.floor(Math.random() * x);
}

export function getRandomDnList()
{
    const count = randomInt(10) + 3;
    const res : string[] = [];

    for(let i = 0; i < count; i++)
    {
        const dn = (<string[]>DN_LIST)[randomInt(DN_LIST.length)];
        res.push(dn)
    }
    return res;
}
