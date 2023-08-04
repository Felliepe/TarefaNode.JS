const fs = require('fs')
const readline = require('readline')
const { EventEmitter } = require('events');

const filePath = 'index.txt'

let linhasNum = 0;
let Soma = 0;
let linhasTxt = 0;

const processLine = (linha) => {
    if (/^\d+$/.test(linha)) {
        linhasNum++;
        Soma += parseInt(linha)
    } else if (/^\D+$/.test(linha)) {
        linhasTxt++
    }
}
const contLinhas = () => {
    const eventEmitter = new EventEmitter()
    console.time('Execucao')
    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    rl.on('line', (linha) => {
        processLine(linha)
    });

    rl.on('close', () => {
        eventEmitter.emit('countCompleted', linhasNum, Soma, linhasTxt);
    })

    return eventEmitter
}

const runApplication = () => {

    const lineCountEvent = contLinhas()

    lineCountEvent.on('countCompleted', (linhasNum, Soma, linhasTxt) => {
        setTimeout(() => console.log(`Linhas somente com números: ${linhasNum}`), 2000)
        setTimeout(() => console.log(`Linhas somente com texto: ${linhasTxt}`), 3000)
        setTimeout(() => console.log(`Soma dos números: ${Soma}`), 4000)
        console.timeEnd('Execucao')
        execNovamente()
    })
}
const execNovamente = () => {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    readlineInterface.question ('Executar novamente? (sim/não): ', (answer) => {
        readlineInterface.close();

        if (answer.trim().toLowerCase() === 'sim') {
            runApplication();

        } else {
            console.log('Sair');
            process.exit(0)
        }
    })
}
runApplication()