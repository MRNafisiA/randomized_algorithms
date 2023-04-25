import { experiment } from './utils.js';

const experimentWithDelay = (n, animationDelay) =>
    new Promise(resolve => {
        let cy;
        setTimeout(() => {
            resolve(
                experiment(
                    n,
                    nodes => {
                        document.getElementById('graphDiv').innerText = '';
                        cy = cytoscape({
                            container: document.getElementById('graphDiv'),
                            elements: nodes,
                            layout: {
                                name: 'circle'
                            },
                            style: [
                                {
                                    selector: 'node',
                                    style: {
                                        height: 20,
                                        width: 20,
                                        'background-color': '#e8e406',
                                        label: 'data(id)'
                                    }
                                },
                                {
                                    selector: 'edge',
                                    style: {
                                        'curve-style': 'haystack',
                                        'haystack-radius': 0,
                                        width: 5,
                                        opacity: 0.5,
                                        'line-color': '#f2f08c'
                                    }
                                }
                            ]
                        });
                    },
                    edge =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                cy.add(edge);
                                resolve();
                            }, animationDelay);
                        })
                )
            );
        }, animationDelay);
    });

const startInput = document.getElementById('startInput');
const toInput = document.getElementById('toInput');
const stepInput = document.getElementById('stepInput');
const retryInput = document.getElementById('retryInput');
const animationDelayInput = document.getElementById('animationDelayInput');
const logsDiv = document.getElementById('logs');
const startButton = document.getElementById('startButton');

startButton.onclick = async () => {
    const start = Number(startInput.value);
    const to = Number(toInput.value);
    const step = Number(stepInput.value);
    const retry = Number(retryInput.value);
    const animationDelay = Number(animationDelayInput.value);
    if (start < 0 || to < 0 || step < 0 || retry < 0 || animationDelay < 0) {
        alert('Check Inputs!');
        return;
    }

    logsDiv.innerHTML =
        '<table><thead><tr><th>Size</th><th>f(n)</th><th>g(n)</th></tr></thead><tbody></tbody></table>';
    for (let i = start; i <= to; i += step) {
        let edgesLengthSum = 0;
        let isolatedLimitSum = 0;
        for (let j = 0; j < retry; j++) {
            const [_, edges, isolatedLimit] = await experimentWithDelay(
                i,
                animationDelay
            );
            edgesLengthSum += edges.length;
            isolatedLimitSum += isolatedLimit;
        }
        logsDiv.children[0].children[1].innerHTML += `<tr><td>${i}</td><td>${
            edgesLengthSum / retry
        }</td><td>${isolatedLimitSum / retry}</td></tr>`;
    }
};
