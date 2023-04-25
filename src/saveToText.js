import fs from 'fs';
import { experiment } from './utils.js';

const start = 100;
const to = 1000;
const step = 50;
const retry = 3;

(async () => {
    for (let i = start; i <= to; i += step) {
        let edgesLengthSum = 0;
        let isolatedLimitSum = 0;
        for (let j = 0; j < retry; j++) {
            const [_, edges, isolatedLimit] = await experiment(i);
            edgesLengthSum += edges.length;
            isolatedLimitSum += isolatedLimit;
            console.log(`${i}: step ${j}: ${edges.length}`);
        }
        fs.appendFileSync(
            './data/tmp.csv',
            i +
            ',' +
            edgesLengthSum / retry +
            ',' +
            isolatedLimitSum / retry +
            '\n'
        );
    }
})();
