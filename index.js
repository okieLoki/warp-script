import cluster from 'cluster';
import os from 'os';
import getData from './script.js';

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(numCPUs);

    let globalSuccessCount = 0;

    const workerSuccessCounts = new Map();

    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        workerSuccessCounts.set(worker.id, 0);

        worker.on('message', (message) => {
            if (message.type === 'incrementSuccess') {
                globalSuccessCount++;
                workerSuccessCounts.set(worker.id, workerSuccessCounts.get(worker.id) + 1);
            }
        });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

    setInterval(() => {
        console.log(`======Global Success Count: ${globalSuccessCount}=======`);
        workerSuccessCounts.forEach((count, workerId) => {
            console.log(`Worker ${workerId} Success Count: ${count}`);
        });
    }, 5000); 
} else {
    getData(cluster.worker.id); 
}
