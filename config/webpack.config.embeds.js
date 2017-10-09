const createConfig = require('./webpackConfigFactory');
const paths = require('./paths');

const common = {
  name: 'gw2aEmbeds',
  entryPath: paths.embedSrc,
  htmlWebpackPlugin: {
    filename: 'embeds/example/index.html',
    inject: false,
    template: paths.embedsHtml,
  },
};

module.exports = {
  development: createConfig(common),

  production: createConfig({
    ...common,
    filename: '[name].js',
    production: true,
  }),
};
