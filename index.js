const axios = require('axios');

const sleep = async (ms) => {
    await new Promise((res) => {
        setTimeout(() => {
            res(true);
        },ms)
    })
}

let ejecutar = true;

const Run = async (solicitudes) => {

    let inicioPrueba = new Date().getTime();  //Hora de inicio de la prueba
    let esperarSolicitudes = JSON.parse(`${solicitudes}`);
    let contador = 0;                         //Solicitudes completadas

    do{
        solicitudes--;
        ejecutar = solicitudes > 0;
        axios.get('https://api.pingtico.com:12001/v1/subscription/').then((res) => {
            contador++;
        }).catch((err) => {
            contador++;
        });
    }
    while(ejecutar);

    while(esperarSolicitudes != contador){
        await sleep(10);
    }

    console.log(`Tiempo de respuesta: ${(new Date().getTime() - inicioPrueba) / 1000}s - ${esperarSolicitudes} solicitudes`);
}

const RunTests = async () => {
    await Run(1);
    await Run(10);
    await Run(100);
    await Run(1000);
} 

RunTests();