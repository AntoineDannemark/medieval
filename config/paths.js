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

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
      fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );
  
    if (extension) {
      return resolveFn(`${filePath}.${extension}`);
    }
  
    return resolveFn(`${filePath}.js`);
};

module.exports = {
    appRoot: resolveApp('.'),
    appSrc: resolveApp('src'), 
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    appPackageJson: resolveApp('package.json'),
    appTsConfig: resolveApp('tsconfig.json'),
    appNodeModules: resolveApp('node_modules'),
}

module.exports.moduleFileExtensions = moduleFileExtensions;