const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        //app: ['./src/App.tsx']
        app: ['./example/bundle.tsx'],
        vendor: ['react']
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'js/[name].bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader'
            },
            //{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            { test: /\.jsx$|\.es6$|\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
            {
                test: /\.scss$|\.css$|\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
            { test: /\.(jpe?g|png|gif)$/i, loader: 'url?limit=10000!img?progressive=true' },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'example', 'index.html') }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'example'),
        compress: false,
        port: 9000,
        hot: true
    }
}