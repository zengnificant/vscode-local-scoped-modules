 import fs from 'fs'
 import {createRequire} from 'module'
 import {join} from 'path'
 import getRootPath from '../utils/getRootPath.js'
 import extensionConfig  from './extension-config.js'

 const require=createRequire(import.meta.url)
 
 const defaultObts = {
    rootPrefix: '~',
    scopePrefix: '@',
    scopes: [],
    calleeNames: ['require', 'import']
}

const getDefaultOpts=()=>{
    const {rootPrefix}=defaultObts
    let scope={name:rootPrefix,dir:rootPrefix}
    defaultObts.scopes.push(scope)
    return defaultObts
}

const  getConfigFile=(filename)=>{
    const rootPath=getRootPath()
   let file=filename?.length?filename:'local-scoped-modules.config.js'
     file= file.replace(/^(\.+\/)+(.*)/,'$2')
  return  join(rootPath,file) 
}


const getCalleeNames=(calleeNames)=>{
    let ret=[...calleeNames]
    for(let  el of defaultObts.calleeNames){
        if(!ret.includes(el)){
            ret.push(el)
        }
    }
    return  ret
}

const getConfig=()=>{
    const configFile=getConfigFile(extensionConfig().pluginConfigFilename)
 
    if(!fs.existsSync(configFile)){
        return  getDefaultOpts()
    }

    const config=require(configFile)

    if(typeof config!='object') return defaultObts
    const ret={}
    const myOpts={...defaultObts,...config}
    for(let k in defaultObts){
        if(k=='calleeNames'){
            ret[k]=getCalleeNames(myOpts[k])
            continue;
        }
        ret[k]=myOpts[k]
    }
  
    const {rootPrefix,scopes}=myOpts
    if(!scopes.find(el=>el.name===rootPrefix)){
        scopes.unshift({name:rootPrefix,dir:rootPrefix})
    }

    return ret;
    
}


export  default getConfig