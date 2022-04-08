const path = require('path');
const spawn = require('cross-spawn');

const getPlatform = () => {
    if (process.platform === 'win32') {
        return 'windows';
    } else if (process.platform === 'darwin') {
        return 'osx';
    }

    return 'linux';
};

const getVnuExecutable = () => {
    const platform = getPlatform();

    return path.resolve(__dirname, '..', '..', 'vnu', platform, 'bin', platform === 'windows' ? 'vnu.bat' : 'vnu');
}

const runVnu = (args) => {
    if (process.env.CYPRESS_QUIET !== '1') {
        console.log('[Validator] Running:', getVnuExecutable(), ['--format', 'json', ...args].join(' '));
    }

    const result = spawn.sync(getVnuExecutable(), ['--format', 'json', ...args]);

    try {
        return JSON.parse(result.stderr.toString());
    } catch {
        console.error('Validation result cannot be parsed as JSON.');
        console.error(result.stderr.toString());
        return null;
    }
};

const filterMessages = (res) => {
    if (!res['messages']) {
        return [];
    }

    return res['messages'].filter(msg => msg['type'].includes('error'));
};

const validateFile = (config) => ({ url, type }) => {
    let fullUrl;
    if (url.startsWith('http:') || url.startsWith('https:')) {
        fullUrl = url;
    } else {
        fullUrl = config.baseUrl.endsWith('/') ? `${config.baseUrl.substr(0, config.baseUrl.length - 1)}${url}` : `${config.baseUrl}${url}`;
    }

    const res = runVnu([`--${type}`, fullUrl]);

    if (res === null) {
        return null;
    }

    return filterMessages(res);
}

module.exports = {
    validateFile,
};
