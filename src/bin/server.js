// Configuração sevidor
/**
 * @author Starley Cazorla
 */
'use sctict'

const app = require('../app');
const http = require('http');
const https = require('https');
const express = require('express');
var fs = require('fs');
var util = require('util');
const debug = require('debug')('balta:server');
const { checkFile, getDir } = require('./../util/folders.util');
const { downloadFile, exctratFile } = require('./../services/download/download.service');
const APP_CONFIG_DEFAULT = require('../config/app-config.js');

/** Data */
let dataHoje = new Date();
let dataHoraLocal = dataHoje.toLocaleDateString('pt-BR') + ' ' + dataHoje.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** Conexões HTTP */
const server = http.createServer(app);
const port = nomalizePort(checkDefaultPort()); // porta http
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/** Conexões HTTPs */
// const options = {
//     key: fs.readFileSync(__dirname + '/cert/key.pem'),
//     cert: fs.readFileSync(__dirname + '/cert/cert.pem')
// };
// const serverHttps = https.createServer(options, app);
// const portHttps = nomalizePort(checkDefaultPort() + 1); // porta https
// serverHttps.listen(portHttps);
// serverHttps.on('error', onErrorHttps);
// serverHttps.on('listening', onListeningHttps);

console.warn(`\n
 # ******************************************************* #
 # *                                                     * #
 # *                    SERVER NODEJS                    * #
 # *                                                     * #
 # *      Version: ${APP_CONFIG_DEFAULT.versionServer} - Data Update: ${APP_CONFIG_DEFAULT.dataRelease}       * #
 # *                   Licença: GPLv3                    * #
 # *                                                     * #
 # * Autor: Starley Cazorla                              * #
 # * https://github.com/StarleyDev/server-node-for-app   * #
 # *                                                     * #
 # ******************************************************* #
 # *         API Rodando na porta: http: ${port}            * #
 # *                 * #
 # ******************************************************* #
 `);
//  API Rodando na porta: https: ${portHttps}   
/** Logs */
var logFile = fs.createWriteStream(getDir() + `/logServer.txt`, { flags: 'a' });
var logStdout = process.stdout;
console.log = function () {
    logFile.write(util.format.apply(null, arguments) + ' ' + dataHoraLocal + '\n');
    logStdout.write(util.format.apply(null, arguments) + ' ' + dataHoraLocal + '\n');
}
console.error = console.log;
/** Fim Log */

/** Projeto em angular  */
var env = process.argv[2] || 'prod';
switch (env) {
    case 'dev':
        // Setup development config
        console.log('\n# * DEVELOPER MODE * #\n');
        console.log('\n# * APLICAÇÃO PRONTA PARA USO! * #\n');
        break;
    case 'prod':
        // Setup production config
        let existeProjeto = checkFile(process.cwd() + '/www/index.html');
        if (!existeProjeto) {
            downloadFile(APP_CONFIG_DEFAULT.urlDownloadAngularProject, APP_CONFIG_DEFAULT.txtDownloadAngularProject).finally(() => {
                exctratFile(APP_CONFIG_DEFAULT.txtDownloadAngularProject).then(result => {
                    if (result) {
                        console.log('\n# * APLICAÇÃO PRONTA PARA USO! * #\n');
                    }
                });
            });
        } else {
            console.log('\n# * APLICAÇÃO PRONTA PARA USO! * #\n');
        }
        break;
}

app.use('/', express.static(getDir() + '/www'));
app.get('/', function (req, res) {
    res.sendFile(getDir() + '/www/index.html');
});

/**
 * Normaliando porta de conexão
 * @param {*} val 
 */
function nomalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

/**
 * Erro de conexao
 * @param {*} error 
 */
function onError(error) {
    const bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requer privilegios elevados!');
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(bind + ' já está em uso!');
            process.env.PORT = process.env.PORT + 2
            process.exit(1);
            break;

        default:
            throw error;
    }
}

/**
 * Função para ficar escutando a porta http
 */
function onListening() {
    /** Http */
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ', + bind);
}


/**
 * Erro de conexao
 * @param {*} error 
 */
function onErrorHttps(error) {
    const bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requer privilegios elevados!');
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(bind + ' já está em uso!');
            process.env.PORT = process.env.PORT + 2
            process.exit(1);
            break;

        default:
            throw error;
    }
}

/**
 * Função para ficar escutando a porta https
 */
function onListeningHttps() {
    const addr = serverHttps.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ', + bind);

}

/**
 * Cria arquivo de configuração de porta
 * @returns 
 */
function checkDefaultPort() {
    let existFileConfig = checkFile(getDir() + '/serverPortConfig.json');
    if (!existFileConfig) {
        let config = fs.createWriteStream(getDir() + `/serverPortConfig.json`, { flags: 'w' });
        config.write(`{ "serverPortDefault": 1255 }`);
        return 1255;
    } else {
        let rawdata = fs.readFileSync(getDir() + '/serverPortConfig.json');
        let ports = JSON.parse(rawdata);
        return ports.serverPortDefault;
    }
}

