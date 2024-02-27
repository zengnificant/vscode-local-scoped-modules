import * as vscode  from  'vscode';
import  getInfo from './getInfo.js'
import getRootPath from './getRootPath.js'
import  readdirSync1 from './readdirSync1.js'
import  getConfig from '../config/plugin-config.js'





const  getEmptyInfoCompletionItems=()=>{
  const opts=getConfig()
  const {scopes}=opts;

  const sort=((a,b)=>{
    if(a.name=='~'){
        return -1
    }
    for(let i=0;i<Math.min(a.name.length,b.name.length);i++){
           if(a.name[i]==b.name[i]){
               continue
           }
           return a.name[i].charCodeAt(0)-b.name[i].charCodeAt(0)
       }
     return a.name.length-b.name.length

   })

  scopes.sort(sort)

  let completions=[]
  scopes.map((scope,i)=>{
    let item=new vscode.CompletionItem(scope.name+'/', vscode.CompletionItemKind.Folder)

    item.sortText='a'+String.fromCharCode(i)
  
    completions.push(item)
  })
  return completions

}

const getCompletionItems=()=>{
    const rootPath=getRootPath()
   
    const info=getInfo()
    const {scopePrefix,rootPrefix,scopes}=getConfig()
  
    if(!info) return;
    let word=info.value;
 
    if(!word.length)  return getEmptyInfoCompletionItems()
    let completions=[]

    if(word==scopePrefix){
    
      if(!scopes.length){
         return  completions;
      }
      scopes.sort()
      
      scopes.forEach((el,i)=>{
        let scopeName=el['name']
       
        if(scopeName.startsWith(scopePrefix)){
                 scopeName=scopeName+'/'
             let item=new vscode.CompletionItem(scopeName, vscode.CompletionItemKind.Folder)
             item.insertText=scopeName.slice(scopePrefix.length)
             item.sortText==String.fromCharCode(0)+String.fromCharCode(i)
             completions.push(item)
        }

      })
      return completions;
  
    }
    if(!word.endsWith('/')){
       return  completions;
    }
    for (let  scope of scopes){
      let  scopeName = scope['name']
      let   scopeDir = scope['dir'].replace(rootPrefix,rootPath)
       if(word.startsWith(scopeName)){
          word=word.replace(scopeName,scopeDir)
          break
        }
      }
      
     const ret= readdirSync1(word).map((el,i)=>{
      let item;
        if(el.type==='file'){
          item= new vscode.CompletionItem(el.dir, vscode.CompletionItemKind.File)
        }else{
          item=new vscode.CompletionItem(el.dir, vscode.CompletionItemKind.Folder)
        }
         item.sortText=String.fromCharCode(0)+String.fromCharCode(i)
         return item;
      })
     
     return ret
  
  }

  export  default getCompletionItems;
  