import * as vscode  from  'vscode';
import getExtensionConfig  from '../config/extension-config.js'
import {existsSync} from 'fs'
import {dirname,join} from 'path'

const getRoot1=()=>{
const workspaceFolders=vscode.workspace.workspaceFolders
  
  if(workspaceFolders.length===1) return workspaceFolders[0].uri.path;
  
    const curPath=vscode.window.activeTextEditor.document.uri.fsPath
    let ret=[]
    for(let workspaceFolder of workspaceFolders){
        if(curPath.includes(workspaceFolder.uri.path)){
            ret.push(workspaceFolder.uri.path)
        }
    }
   

    ret.sort((a,b)=>b.length-a.length)
   
    return ret[0]
}

const getRoot2=()=>{
    let curPath=vscode.window.activeTextEditor.document.uri.fsPath
    let firstBaseDir=dirname(curPath)
    let  baseDir=dirname(curPath)
    let cache=[]
   while(!cache.includes(baseDir)){
      
      cache.push(baseDir);
      let curBaseConfigFile=join(baseDir,'package.json')
      if(!existsSync(curBaseConfigFile)){
          baseDir=dirname(baseDir)
          continue;
      }
      return baseDir
   }
   
   return  firstBaseDir;

}
const fn=()=>{
    const mode=getExtensionConfig().rootPathMode
    if(mode=='vscode') return getRoot1();
    if(mode=='package.json') return getRoot2()
    return getRoot2()
}


export default fn