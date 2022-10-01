// Manutenção de pastas e arquivos
/**
 * @author Starley Cazorla
 */

'use sctict'
const fs = require('fs');
const path = require('path');

function criarPasta(nomePasta) {
  if (!fs.existsSync(nomePasta)) {
    console.log(`# * PASTA - ${nomePasta} - CRIADA * #`);
    //Efetua a criação do diretório
    fs.mkdirSync(nomePasta, { recursive: true });
  }
}

function deletarPasta(path) {
  console.log(`# * PASTA - ${path} - DELETADA * #`);
  fs.rmSync(path, { recursive: true });
}

// Using a function to set default app path
function getDir() {
  if (process.pkg) {
    return path.resolve(process.execPath + "/..");
  } else {
    return path.join(require.main ? require.main.path : process.cwd());
  }
}

/**
 * Salva a imagem em pasta local
 * @param {*} dir 
 * @param {*} nomeArquivo 
 * @param {*} data 
 * @param {*} isPrincipal 
 * @returns 
 */
function salvaImagens(dir, nomeArquivo, data, isPrincipal) {
  return new Promise((resolve, reject) => {

    try {
      let nomeOriginal = nomeArquivo;
      // console.log("🚀 ~ file: folders.util.js ~ line 27 ~ returnnewPromise ~ nomeOriginal", nomeOriginal)
      let arquivoEncontrado = true;
      let count = 2

      while (arquivoEncontrado) {
        if (isPrincipal && count === 2) {
          // console.log("🚀 ~ file: folders.util.js ~ line 33 ~ returnnewPromise ~ isPrincipal", isPrincipal)
          nomeArquivo = nomeOriginal + '-1';
        } else {
          nomeArquivo = nomeOriginal + '-' + count;
        }
        arquivoEncontrado = checkFile(dir + nomeArquivo + '.png') //.then(async (res) => {
        // console.log("🚀 ~ file: folders.util.js ~ line 39 ~ arquivoEncontrado=checkFile ~ dir + nomeArquivo", dir + nomeArquivo)
        if (arquivoEncontrado) {
          count += 1;
        }
      }

      let caminho = dir + nomeArquivo;
      // Caso não exista ira converter e salvar a imagem
      if (!arquivoEncontrado) {
        fs.writeFile(caminho + '.png', data, 'base64', function (err, result) {
          if (err) {
            console.log('error', err);
            reject(err);
          } else {
            // console.log('result', result);
            resolve(result);
          }

        });
      } else {
        resolve('Arquivo já existente!');
      }

    } catch (err) {
      reject(err);
      console.log(err);
    }

  });
}

/**
 * Salva arquivos localmente
 * @param {*} caminho 
 * @param {*} buffer 
 * @param {*} tipoOperacao 
 * @returns 
 */
function salvarArquivo(caminho, buffer, tipoOperacao) {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(caminho, buffer, tipoOperacao, function (err, result) {
        if (err) {
          console.log('error', err);
          reject(err);
        } else {
          // console.log('result', result);
          resolve(result);
        }

      });
    } catch (err) {
      reject(err);
      console.log(err);
    }
  });
}

// async function abrirArquivo(caminho) {
//   try {
//     await open(caminho);
//   } catch (err) {
//     console.log(err)
//   } finally {
//     console.log('abriu arquivo')
//   }

// }

function convertImageToBase64(caminho, tipoOperacao) {
  if (tipoOperacao) {
    caminho += __dirname + '/assets/10224.jpg';
  }
  if (fs.existsSync(caminho)) {
    var imageAsBase64 = fs.readFileSync(caminho, 'base64');
    return imageAsBase64;
  } else {
    return null;
  }
}

function checkFile(path) {
  let retorno;
  if (fs.existsSync(path)) {
    retorno = true;
  } else {
    retorno = false;
  }
  return retorno;
}

// Using a function to set default app path
function getDir() {
  if (process.pkg) {
    return path.resolve(process.execPath + "/..");
  } else {
    return path.join(require.main ? require.main.path : process.cwd());
  }
}

module.exports = { criarPasta, deletarPasta, salvaImagens, checkFile, getDir, salvarArquivo }
