const path = require("path");

module.exports = {
  devtool: "source-map", // Generate source maps for better debugging experience
  entry: "./src/index.js", // Entry point of your application
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
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory for bundled files
    filename: "bundle.js", // Output filename
  },
};
