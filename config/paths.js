const path = require('path');
const fs = require('fs');

const appDir = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDir, relativePath);

console.log(appDir)

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

module.exports = {
    appRoot: resolveApp('.'),
    appSrc: resolveApp('src'), 
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp('src/index.ts'),
    appPackageJson: resolveApp('package.json'),
    appTsConfig: resolveApp('tsconfig.json'),
    appNodeModules: resolveApp('node_modules'),
}

module.exports.moduleFileExtensions = moduleFileExtensions;