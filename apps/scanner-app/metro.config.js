const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const FileStore = require('metro-cache').FileStore;

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.fileMapCacheDirectory = path.join(projectRoot, '.metro');

config.cacheStores = [
  new FileStore({
    root: path.join(projectRoot, '.metro', 'cache'),
  }),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  buffer: require.resolve('buffer/'),
  ...config.resolver.extraNodeModules,
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
