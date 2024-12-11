const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx", // 진입점
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // 번들 파일 이름
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // 처리할 파일 확장자
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // TypeScript 파일 처리
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: "./public", // 정적 파일 제공 경로
    port: 3000, // Dev Server 실행 포트
  },
  devtool: "inline-source-map", // 디버깅을 위한 소스맵
};
