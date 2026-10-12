/**
 * Metro turns a `.glb` import into an asset reference (an opaque id), which is
 * exactly the `number` branch of react-native-filament's `BufferSource`.
 * Registered as an asset extension in metro.config.js.
 */
declare module '*.glb' {
  const source: number;
  export default source;
}
