// Requisição para acessar e interagir
const fs = require('fs')
// Requerer leitura das linhas
const readline = require('readline')
// Variável criada para eventos no código
const { EventEmitter } = require('events');

// Variável que traz qual arquivo ler
const filePath = 'index.txt'

// Não pode ser const porque terá mudanças no valor
let linhasNum = 0;
let Soma = 0;
let linhasTxt = 0;

const VerificLinha = (linha) => {
    if (/^\d+$/.test(linha)) {
        linhasNum++;
        Soma += parseInt(linha)
    } else if (/^\D+$/.test(linha)) {
        linhasTxt++
    }
}
const contLinhas = () => {
    // Evento para sequestrar informações 
    const eventEmitter = new EventEmitter()
    // console.time para verificar tempo da execução
    console.time('Execucao')
    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })
    rl.on('line', (linha) => {
        VerificLinha(linha)
    });

    rl.on('close', () => {
        eventEmitter.emit('contou', linhasNum, Soma, linhasTxt);
    })

    return eventEmitter
}

const Rodar = () => {

    const lineCountEvent = contLinhas()

    lineCountEvent.on('contou', (linhasNum, Soma, linhasTxt) => {
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

    readlineInterface.question('Executar novamente? (sim/não): ', (answer) => {
        readlineInterface.close();

        if (answer.trim().toLowerCase() === 'sim') {
            Rodar();

        } else {
            console.log('Sair');
            process.exit(0)
        }
    })
}
Rodar()