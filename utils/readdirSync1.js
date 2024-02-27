import {readdirSync,statSync} from "fs";
import getExtensionConfig  from '../config/extension-config.js'



const  isPattern=str=>{
    return str.includes('*')||str.includes('?')
}

const getRegFromPattern=(pattern)=>{

    const regexPattern = pattern.replace(/[/\\]/g, '\\$&').replace(/\*+/g, '.*').replace(/\?/g, '.');
     const regex = new RegExp(regexPattern);
     return regex;
}


const shouldBeIgnored=(fileOrDir,ignore)=>{
    if(typeof fileOrDir!='string'){
        return;
    }
    let ret=false;
    for(let ig of ignore){
        if(isPattern(ig)){
           ret= getRegFromPattern(ig).test(fileOrDir)
        }else{
            ret=ig===fileOrDir
        }
        if(ret) return ret;
    }
   
}

const  getIgnore=(ignore)=>{
    if(typeof ignore=='string'){
        return [ignore]
    }
    if(Array.isArray(ignore)){
         return ignore
    }
    return getExtensionConfig()['ignore']||[]
}


const  fn=(dir,ignore)=>{
    ignore=getIgnore(ignore)
    const ret=readdirSync(dir)
    const dirs=[]
    const files=[]
    for(let  fileOrDir of ret){
        if(shouldBeIgnored(fileOrDir,ignore)){
            continue;
        }
        const curPath=dir+'/'+fileOrDir
       
        const stat=statSync(curPath)
        if(stat.isDirectory()){
              dirs.push({dir:fileOrDir+'/',type:'dir'})
              continue
        }
        if(stat.isFile()){
            files.push({dir:fileOrDir,type:'file'})
            continue
      }
    }

    dirs.sort()
    files.sort()
    return [...dirs,...files]
}

export default fn