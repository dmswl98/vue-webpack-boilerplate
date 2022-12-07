const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  /*
    The 'mode' option has not been set... Set 'mode' option to 'development' or 'production' 에러가 발생하며 mode 옵션을 지정하는 것이 좋다.
    하지만 이 설정파일에 production이라고 명시하면 development 방식은 사용할 수 없으므로 여기에 직접 mode 옵션을 작성하기 보다는 package.json에 작성해도 좋다.
    "build": "webpack --mode production"
  */
  resolve: {
    extensions: [".vue", ".js"], // extensions로 파일의 확장자를 생략하는 기능을 추가할 수 있다.
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
    /*
      src 경로를 '~' 별칭으로 사용할 수 있다.
      import Hello from "./components/Hello.vue";가 아닌
      import Hello from "./components/Hello";로 vue나 js 확장자를 생략할 수 있다.

      즉, import Hello from "~/components/Hello";로 작성해 위에 설정한 src 까지의 절대 경로를 '~'라는 별칭으로 대체할 수 있다.
      이렇게 경로 별칭을 사용하면 나중에 유지보수할 때 편리하다.
      보통 '~' 또는 '@'을 사용해 별칭을 지정한다.
    */
  },
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true, // dist 폴더를 정리한 후 빌드하도록 하는 옵션이다. 만약 dist 폴더에 빈 파일이 포함된 경우 이 빈 파일을 제거한 후 빌드를 실행한다.
  },
  module: {
    rules: [
      // rules는 배열 리터럴로 작성한다.
      {
        test: /\.vue$/, // 정규 표현식을 이용해 vue의 확장자를 찾도록 한다.
        use: "vue-loader",
        /*
          vue-loader는 vue 파일을 로드해 해석한다.
          즉, webpack으로 build할 경우 작성된 vue-loader 패키지를 설치해야 한다.
          단, vue-loader는 vue 확장자 파일들을 로드해와서 읽을 준비를 하는 역할만을 하기 때문에 해석을 위한 npm i -D @vue/compiler-sfc 패키지가 필요하다.
          
          이 때 vue와 @vue/compiler-sfc의 버전이 일치해야 정상적으로 동작한다.
          이후 plugins 옵션에 VueLoaderPlugin을 설정해야 vue 파일을 js로 설정할 준비가 된 것이다.
        */
      },
      {
        test: /\.s?css$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
        /*
          기본적으로 sfc 내부 style 태그를 해석할 수 없다. vue-loader를 설치한 것처럼 css를 위한 loader가 필요하다.
          npm i -D css-loader vue-style-loader 두 패키지를 설치한다.

          패키지 작성 순서가 중요하다. 가장 먼저 해석이 되어야하는 패키지의 경우 가장 나중에 작성한다.
          위 순서는 css-loader를 이용해 css를 해석하고 vue-style-loader를 이용해 vue 파일에 있는 스타일 부분을 html 파일에 삽입하도록 한다.
          정규식 표현은 /\.css$/로 작성해 css 확장자 파일을 찾도록 한다.

          sass를 사용하고 싶다면 npm i -D sass sass-loader를 이용해 패키지를 설치한 뒤 use 배열에 sass-loader를 추가한다.
          위 경우 sass-loader > css-loader > vue-style-loader 순으로 동작한다.
          정규식 표현은 /\.s?css$/로 작성해 scss와 css 확장자 파일을 모두 찾도록 한다.
        */
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlPlugin({
      /*
        기본적으로 parcel과 다르게 빌드 결과에는 index.html가 포함되지 않는다. 
        빌드할 때마다 index.html도 dist 폴더에 포함되어 있으면 좋겠다면 npm i -D html-webpack-plugin 패키지를 설치한 후 plugin에 추가한다.

        index.html의 경로를 지정한다.
        하지만 htmlPlugin의 경우 기본적으로 경로에 대해 path.resolve가 작동되므로 path.resolve(__dirname, "src/index.html")가 아닌 './src/index.html' 상대경로를 작성해도 무방하다.

        빌드한 결과로 src 폴더내에 index.html을 dist 폴더 내에 플러그인을 거쳐 출력된 index.html이 포함됨을 알 수 있다.
        다만, 실제 src 내부의 index.html의 경우 srcipt 태그를 작성하지 않았지만 빌드된 index.html의 경우 webpack.config.js에 entry 옵션으로 작성된 파일을 script 태그에 포함하여 빌드된 것을 확인할 수 있다.
        <script defer="defer" src="main.js"></script>
      */
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "static" }],
      /*
        asset 파일들을 읽기 위해 npm i -D copy-webpack-plugin 패키지를 설치한다.
        patterns 옵션을 추가해 from, to를 작성하는데 to의 경우 기본적으로 output 옵션의 path 경로를 따르므로 생략 가능하다.

        루트 경로에서 static 폴더를 생성해 asset 파일들을 추가하면 build 후 dist 파일에 저장된다.
        static 파일에 존재하는 favicon.ico의 경우 index.html에 별도로 설정하지 않아도 자동으로 icon이 적용된다.
      */
    }),
  ],
  // devServer: {
  //   port: 1234, // 포트 번호를 변경할 수 있다.
  // },
};
// loader를 이용해 js 파일 뿐만 아니라 vue와 같은 다른 확장자도 해석할 수 있다.
