const isConnected = (n, edges) => {
    if (n <= 1) {
        return true;
    }
    if (edges.length === 0) {
        return false;
    }

    const connectedNodes = [edges[0].data.source, edges[0].data.target];
    let i = 0;

    while (i !== connectedNodes.length && n !== connectedNodes.length) {
        const nodes = edges
            .filter(
                ({ data: { source, target } }) =>
                    source === connectedNodes[i] || target === connectedNodes[i]
            )
            .map(({ data: { source, target } }) =>
                source === connectedNodes[i] ? target : source
            );
        connectedNodes.push(...nodes.filter(v => !connectedNodes.includes(v)));
        i++;
    }
    return connectedNodes.length === n;
};
const getDistinctRandomEdge = (n, edges) => {
    const [a, b] = getRandomEdge(n);
    if (
        edges.find(
            ({ data: { source, target } }) =>
                (a === source && b === target) || (a === target && b === source)
        ) === undefined
    ) {
        return [a, b];
    } else {
        return getDistinctRandomEdge(n, edges);
    }
};
const getRandomEdge = n => {
    const [a, b] = [
        Math.floor(Math.random() * n).toString(),
        Math.floor(Math.random() * n).toString()
    ];
    if (a === b) {
        return getRandomEdge(n);
    }
    return [a, b];
};
const isThereIsolatedNode = (n, edges) =>
    Array(n)
        .fill(0)
        .some(
            (_, index) =>
                edges.findIndex(
                    ({ data: { source, target } }) =>
                        source === index.toString() ||
                        target === index.toString()
                ) === -1
        );
const experiment = async (n, onInitiate = () => {}, onAdd = async () => {}) => {
    const nodes = Array(n)
        .fill(0)
        .map((_, index) => ({
            group: 'nodes',
            data: { id: index.toString() }
        }));
    onInitiate(nodes);
    const edges = [];
    let isolatedLimit;

    while (!isConnected(n, edges)) {
        const [a, b] = getDistinctRandomEdge(n, edges);
        const edge = {
            group: 'edges',
            data: { id: `${a}-${b}`, source: a, target: b }
        };
        edges.push(edge);
        await onAdd(edge);
        if (!isThereIsolatedNode(n, edges) && isolatedLimit === undefined) {
            isolatedLimit = edges.length;
        }
    }

    return [n, edges, isolatedLimit];
};

export {
    isConnected,
    getDistinctRandomEdge,
    getRandomEdge,
    isThereIsolatedNode,
    experiment
};
