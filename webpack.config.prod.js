const path = require("path");
const DotEnv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // HTML 템플릿 파일 경로
      inject: true, // 번들 파일 자동 삽입
    }),
    new DotEnv({
      systemvars: true, // 시스템 환경 변수 사용
    }), // .env 파일 로드
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"), // 복사할 폴더
          to: path.resolve(__dirname, "build"), // 복사될 위치
          globOptions: {
            ignore: ["**/index.html"], // index.html 제외 (이미 HtmlWebpackPlugin에서 처리)
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // CSS Modules 설정
      {
        test: /\.module\.css$/, // .module.css 파일만 CSS Modules로 처리
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false,
              },
            },
          },
        ],
      },
      // 글로벌 CSS 설정
      {
        test: /\.css$/, // 일반 .css 파일은 글로벌 스타일로 처리
        exclude: /\.module\.css$/, // CSS Modules 파일은 제외
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all", // 청크 분리 활성화
    },
    minimize: true, // 파일 압축 활성화
  },
};
