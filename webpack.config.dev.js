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
  devServer: {
    static: "./public", // 정적 파일 제공 경로
    port: 3000, // Dev Server 실행 포트
    historyApiFallback: true, // 클라이언트 사이드 라우팅 지원
  },
  devtool: "inline-source-map", // 디버깅을 위한 소스맵
};
