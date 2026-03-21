// metro.config.js — fixes module resolution in npm workspaces monorepo
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the monorepo root so Metro can resolve workspace packages
config.watchFolders = [monorepoRoot];

// Tell Metro to also look in the monorepo root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Ensure Metro uses root workspace node_modules properly
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
