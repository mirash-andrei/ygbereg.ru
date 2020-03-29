let webpack = require('webpack'),
    path = require('path'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


function createConfig(env, mode) {
    let prod,
        webpackConfig;

    if (env === undefined)
        env = process.env.NODE_ENV;

    prod = env === 'production';
    mode = mode === 'watch' ? 'watch' : 'build';

    webpackConfig = {
        mode: prod ? 'production' : 'development',
        context: path.join(__dirname, 'src/js'),
        entry: {
            main: './main.js'
        },
        output: {
            path: path.join(__dirname, './dist/js'),
            filename: '[name].js',
            chunkFilename: "chunks/[id].js?v=[chunkhash]",
            publicPath: prod ? '/local/templates/main/js/' : '/js/'
        },
        devtool: '',
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            }),
            new webpack.NoEmitOnErrorsPlugin()
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    //exclude: /(node_modules|bower_components)/,
                    exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.jsx?$/],
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            ie: '11'
                                        }
                                    }
                                ]
                            ]
                        }
                    }
                }
            ]
        }
    };

    if (mode === 'build') {
        webpackConfig.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                analyzerPort: 4000,
                openAnalyzer: false
            })
        );
    }

    if (prod) {

    }

    return webpackConfig;
}

module.exports = createConfig();
module.exports.createConfig = createConfig;