const formatjs = require('babel-plugin-formatjs').default;

/**
 * babel-plugin-formatjs asserts that every message descriptor it sees is
 * statically analysable, which is false inside react-intl's own source — and
 * Metro runs this config over node_modules too.
 *
 * The usual fix is `overrides: [{ exclude: /node_modules/ }]`, but Expo builds
 * its transform cache key by loading this config without a filename, and Babel
 * refuses to evaluate path patterns without one. Wrapping the plugin and
 * no-oping outside app code avoids both problems.
 */
function formatjsAppOnly(api, options, dirname) {
  const plugin = formatjs(api, options, dirname);

  const guard =
    (handler) =>
    function (path, state, ...rest) {
      const filename = state.file?.opts?.filename ?? state.filename;
      if (typeof filename !== 'string' || filename.includes('node_modules')) {
        return undefined;
      }
      return handler.call(this, path, state, ...rest);
    };

  const visitor = {};
  for (const [nodeType, handler] of Object.entries(plugin.visitor)) {
    visitor[nodeType] =
      typeof handler === 'function'
        ? guard(handler)
        : Object.fromEntries(Object.entries(handler).map(([phase, fn]) => [phase, guard(fn)]));
  }

  return { ...plugin, visitor };
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        formatjsAppOnly,
        {
          // Must match the --id-interpolation-pattern used by `npm run extract`,
          // otherwise a descriptor without an explicit id gets one id at build
          // time and a different one in the extracted catalogue.
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
          // Pre-parse defaultMessage into an AST so the runtime never parses ICU
          // on the JS thread. The catalogues in src/i18n/compiled-lang are AST
          // for the same reason.
          ast: true,
        },
      ],
    ],
  };
};
