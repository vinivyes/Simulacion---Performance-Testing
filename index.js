const axios = require('axios');

const sleep = async (ms) => {
    await new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, ms)
    })
}

let ejecutar = true;

const Run = async (solicitudes, log = false) => {

    let inicioPrueba = new Date().getTime();  //Hora de inicio de la prueba
    let esperarSolicitudes = JSON.parse(`${solicitudes}`);
    let contador = 0;                         //Solicitudes completadas


    do {
        solicitudes--;
        ejecutar = solicitudes > 0;
        axios.get('https://api.pingtico.com:12001/v1/subscription/').then((res) => {
            contador++;
        }).catch((err) => {
            contador++;
        });
    }
    while (ejecutar);

    while (esperarSolicitudes != contador) {
        await sleep(10);
    }

    if (log) { console.log(`Tiempo de respuesta: ${(new Date().getTime() - inicioPrueba) / 1000}s - ${esperarSolicitudes} solicitudes`); }
    return (new Date().getTime() - inicioPrueba) / 1000;
}

const RunTests = async () => {
    let max = -1;
    let min = 999;

    await Run(1, true);
    await Run(10, true);
    await Run(100, true);
    await Run(1000, true);

    process.stdout.write("\n");

    for (let batch of [1, 10, 100]) {

        let c = 1;

        for (let i of Array.from({ length: 50 }, () => { return c++; })) {
            let res = await Run(batch, false);

            if (res > max) {
                max = res;
            }

            if (res < min) {
                min = res;
            }

            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`Prueba #${i}/50 - Numero de solicitudes: ${batch}`);
        }
        process.stdout.write("\n");

        console.log(`Tiempo maximo: ${max}s - Tiempo minimo: ${min}s - Numero de solicitudes: ${batch}`);
    }
}

RunTests();