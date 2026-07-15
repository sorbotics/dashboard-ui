/*
 * Sorba Plotly panel — webpack 5 config for Grafana 13 (AMD output)
 *
 * Grafana 13 loads external plugins via SystemJS with the AMD extra enabled,
 * so the bundle must be AMD (not ESM). Core Grafana/React dependencies are
 * kept external and resolved through Grafana's shared dependency import map.
 * Plotly and other non-core libraries are bundled into the plugin.
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

  // Grafana exposes these via its shared dependency import map. Keep them
  // external so the plugin uses the same React/Grafana instances as core.
  externals: [
    'lodash',
    'jquery',
    'moment',
    'slate',
    'emotion',
    'prismjs',
    'slate-plain-serializer',
    '@grafana/slate-react',
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react-redux',
    'redux',
    'rxjs',
    'react-router',
    'react-router-dom',
    'd3',
    'angular',
    '@grafana/ui',
    '@grafana/runtime',
    '@grafana/data',
    '@emotion/react',
    '@emotion/css',

    // Handle legacy SDK imports that use the "grafana/" prefix
    ({ request }, callback) => {
      const prefix = 'grafana/';
      const hasPrefix = (request: string) => request.indexOf(prefix) === 0;
      const stripPrefix = (request: string) => request.substr(prefix.length);

      if (request && hasPrefix(request)) {
        return callback(undefined, stripPrefix(request));
      }

      callback();
    },
  ],

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
    library: {
      type: 'amd',
    },
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
    alias: {
      // react-plotly.js imports 'plotly.js/dist/plotly' as a peer dep.
      // We ship plotly.js-dist-min instead, so redirect that exact path.
      'plotly.js/dist/plotly': 'plotly.js-dist-min/plotly.min.js',
    },
  },
});

export default config;
