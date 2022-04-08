const {resolve} = require('path')
const {createWriteStream, mkdirSync} = require('fs')
const spawn = require('cross-spawn');

const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

const historyDir = resolve(__dirname, '.history');
mkdirSync(historyDir, {recursive: true});
const historyFile = resolve(historyDir, 'test.log');
const absolutePath = resolve(process.cwd(), historyFile);
const writableStream = createWriteStream(absolutePath, {flags: 'a'});
writableStream.write(`

========================
Date: ${new Date().toISOString()}
Cmd:  ${process.argv.join(' ')}
Node: ${process.version}
Pltf: ${process.platform}
`);

const [command, ...args] = process.argv.slice(2);

const childProcess = spawn(command, args);

childProcess.stdout.on('data', (data) => {
    writableStream.write(data.toString().replace(ansiRegex, ''));
    process.stdout.write(data.toString());
});

childProcess.stderr.on('data', (data) => {
    writableStream.write(data.toString().replace(ansiRegex, ''));
    process.stderr.write(data.toString());
});

childProcess.on('error', (error) => {
    writableStream.write(error.stack);
    writableStream.write('\nError code: ' + error.code);
    writableStream.write('\nSignal received: ' + error.signal);
    console.error(error.stack);
    console.error('Error code: ' + error.code);
});

childProcess.on('exit', function (code) {
    writableStream.write('\nChild process exited with exit code ' + code);
});
