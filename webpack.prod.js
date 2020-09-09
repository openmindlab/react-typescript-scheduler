const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        app: ['./src/index.ts']
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].bundle.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
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
    plugins: [],
}