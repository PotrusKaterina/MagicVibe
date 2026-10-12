const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// react-native-filament loads .glb models through Metro's asset pipeline, and
// Expo's defaults do not treat them as assets.
config.resolver.assetExts.push('glb');

module.exports = config;
