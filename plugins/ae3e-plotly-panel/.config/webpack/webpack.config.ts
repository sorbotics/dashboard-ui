/*
 * Sorba Plotly panel — webpack 5 config for Grafana 13 (ESM output)
 * Adapted from the create-plugin scaffold (sorba-video-panel) but with:
 *   - output.library.type = 'module' (ESM, not AMD)
 *   - externals include only what Grafana 13 provides
 *   - no ForkTsChecker (kept simple for now)
 */

import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';
import { Configuration } from 'webpack';

import { getPackageJson, getPluginId, hasReadme, getEntries } from './utils';
import { SOURCE_DIR, DIST_DIR } from './constants';

const config = async (env): Promise<Configuration> => ({
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  context: path.join(process.cwd(), SOURCE_DIR),

  devtool: env.production ? 'source-map' : 'eval-source-map',

  entry: await getEntries(),

  experiments: {
    outputModule: true,
  },

  externalsType: 'module',

  externals: {
    react: 'module react',
    'react-dom': 'module react-dom',
    'react/jsx-runtime': 'module react/jsx-runtime',
    '@emotion/react': 'module @emotion/react',
    '@emotion/css': 'module @emotion/css',
    'plotly.js-dist-min': 'module plotly.js-dist-min',
    'react-plotly.js': 'module react-plotly.js',
    'react-virtualized-auto-sizer': 'module react-virtualized-auto-sizer',
    '@grafana/data': 'module @grafana/data',
    '@grafana/runtime': 'module @grafana/runtime',
    '@grafana/ui': 'module @grafana/ui',
    'lodash': 'module lodash',
  },

  mode: env.production ? 'production' : 'development',

  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.[tj]sx?$/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              baseUrl: path.resolve(process.cwd(), 'src'),
              target: 'es2020',
              loose: false,
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: false,
                dynamicImport: true,
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          publicPath: `public/plugins/${getPluginId()}/img/`,
          outputPath: 'img/',
          filename: Boolean(env.production) ? '[hash][ext]' : '[name][ext]',
        },
      },
    ],
  },

  output: {
    clean: true,
    filename: '[name].js',
    chunkFilename: '[name].js',
    library: { type: 'module' },
    module: true,
    chunkFormat: 'module',
    environment: { module: true, dynamicImport: true },
    path: path.resolve(process.cwd(), DIST_DIR),
    publicPath: '/',
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: hasReadme() ? 'README.md' : '../README.md', to: '.', force: true },
        { from: 'plugin.json', to: '.' },
        { from: '../LICENSE', to: '.', force: true },
        { from: '**/*.svg', to: '.', noErrorOnMissing: true },
        { from: '**/*.png', to: '.', noErrorOnMissing: true },
        { from: 'img/**/*', to: '.', noErrorOnMissing: true },
      ],
    }),
    new ReplaceInFileWebpackPlugin([
      {
        dir: DIST_DIR,
        files: ['plugin.json', 'README.md'],
        rules: [
          { search: /\%VERSION\%/g, replace: getPackageJson().version },
          { search: /\%TODAY\%/g, replace: new Date().toISOString().substring(0, 10) },
          { search: /\%PLUGIN_ID\%/g, replace: getPluginId() },
        ],
      },
    ]),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
  },
});

export default config;
