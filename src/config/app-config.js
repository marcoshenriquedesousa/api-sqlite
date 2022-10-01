/**
 * Configuração de links e versões
 * @autor Starley Cazorla
 */

/** Aqui você ira definir o link e nome do arquivo zipado da pasta www gerada pelo projeto
 * Ex: apos o build ira criar uma pasta www, você ira compactar em formato zip - meuprojeto.zip
 * Faça o upload em alguma plataforma que desejar
 * Coloque o link no campo URL
 * e nome do arquivo no  TXT deve ser exatamente igual para que o servidor possa descompactar o arquivo
 */
const environment = require('./environment')

let configServer = {
  urlDownloadAngularProject: environment.urlDownloadAngularProject,
  txtDownloadAngularProject: environment.txtDownloadAngularProject
};

let APP_CONFIG_DEFAULT = configServer;

APP_CONFIG_DEFAULT['versionServer'] = '2.0.9';
APP_CONFIG_DEFAULT['dataRelease'] = '25/07/2022';

module.exports = APP_CONFIG_DEFAULT;