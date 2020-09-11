var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

// WARNING: __dirname is the webpack config folder

module.exports =  {
    "mode": "development",
    "entry": "./src/index.jsx",
    "output": {
        path: path.resolve(__dirname, 'dist'),
        "filename": "[name].[chunkhash:8].js"        
    },
    "devtool": "eval-source-map",
    devServer: {
        host: "0.0.0.0",
        port: 9090,
        contentBase: './static'
      },
    "module": {
        "rules": [
            {
                "enforce": "pre",
                "test": /\.(js|jsx)$/,
                "exclude": /node_modules/,
                "use": "eslint-loader"
            },
            {
                "test": /\.(js|jsx)$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            },
            {
                "test": /\.less$/,
                "use": [
                    "style-loader",
                    "css-loader",
                    "less-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'] // avoid file extensions in ES6 imports
    },
    plugins: [
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            filename: 'index.html',
            template: 'template/index.ejs'
          }
        )
    ]
}