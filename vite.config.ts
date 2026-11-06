import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: o mesmo dist funciona na raiz ou em um subdiretório do GitHub Pages
// (ex.: https://usuario.github.io/clinica-haes/). Para fixar o caminho, troque por '/nome-do-repo/'.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'static',
  },
});
