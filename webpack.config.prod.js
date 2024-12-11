const path = require("path");

module.exports = {
  mode: "production", // Production 모드 활성화
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true, // 기존 번들 삭제 후 새로 생성
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
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
              modules: true, // CSS Modules 활성화
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
