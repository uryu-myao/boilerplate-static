import fs from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');
const partialDirectory = resolve(__dirname, 'src/html-components');
const metadata = JSON.parse(
  fs.readFileSync(resolve(__dirname, 'src/metadata.json'))
);

/** HTMLの複数出力を自動化 **/
//./src配下のファイル一式を取得
const fileNameList = fs.readdirSync(resolve(__dirname, './src/'));
//htmlファイルのみ抽出
const htmlFileList = fileNameList.filter((file) => /.html$/.test(file));
//build.rollupOptions.inputに渡すオブジェクトを生成
const inputFiles = {};
for (let i = 0; i < htmlFileList.length; i++) {
  const file = htmlFileList[i];
  inputFiles[file.slice(0, -5)] = resolve(__dirname, './src/' + file);
}

export default defineConfig({
  server: {
    host: true,
    port: 6600,
  },
  root,
  outDir,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: inputFiles,
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
            extType = 'fonts';
          }
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          }
          if (extType === 'css') {
            return 'assets/css/[name].css';
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },
  },
  base: '/boilerplate-static/',
  plugins: [
    handlebars({
      partialDirectory,
      context(pagePath) {
        return metadata[pagePath];
      },
    }),
  ],
});
