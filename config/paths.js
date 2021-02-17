const path = require('path');
const fs = require('fs');

const appDir = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDir, relativePath);

console.log(appDir)

module.exports = {
    appRoot: resolveApp('.'),
    appSrc: resolveApp('src'), 
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
}