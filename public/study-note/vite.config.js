import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs,{rmSync} from 'node:fs'
// import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    {
      name:'cleandist',
      buildStart(){
        if(fs.existsSync('./dist')){
          rmSync('./dist',{recursive:true})
        }
      }
    }
  ],
  base:'./',
  build:{
    outDir:'./dist/study-note',
    emptyOutDir:true,
  },
  server:{
    host:true,
    port:3222
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
