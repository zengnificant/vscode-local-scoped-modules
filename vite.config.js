//styled

import { defineConfig } from 'vite'



export default defineConfig({
    

    build: {
         sourcemap:false,
        minify: false,
         lib: {
            entry: 'index.js',
            name: 'vscode-local-scoped-modules',
            
           
            fileName: (format) =>{

                if(format==='es'){
       
                    return 'index.mjs'
                }
           
            return `index.cjs`
          },
           
            formats:['cjs']
         },

        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
           external:['module','fs','vscode','url','path'],

        }
    }

})
 
 
   
