const path = require("path");

module.exports = {
  entry: "./src/index.js", // Entry point of your application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory for bundled files
    filename: "bundle.js", // Output filename
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply the following loaders to .js files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: "babel-loader", // Use Babel loader for transpiling
          options: {
            presets: ["@babel/preset-env"], // Specify Babel presets
          },
        },
      },
    ],
  },
  devtool: "source-map", // Generate source maps for better debugging
};
