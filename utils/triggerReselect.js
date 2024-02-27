import * as vscode  from  'vscode';
import  getConfig from '../config/plugin-config.js' 
import  getValidResolvedId from './getValidResolvedId.js'
import  getInfo from './getInfo.js'
import getExtensionConfig  from '../config/extension-config.js'

const createSelection=(start,end)=>{
    return  new vscode.Selection(start,end)
  }
  
const  getSelection=(selection2)=>{
       let start=selection2.start
        return createSelection(start,start)
}


function selectRange(range){
   const editor=vscode.window.activeTextEditor
    editor.selection=new vscode.Selection(range.start,range.end)

}

const  triggerReselect=(event) => {
    const {useAutoReselectAfterDelete}=getExtensionConfig()
    if(!useAutoReselectAfterDelete){
        return;
    }
    const document = event.document;
    
    if (!document.isDirty) { // 如果文档已经保存，则isDirty为false
        return;
    }
    const editor=vscode.window.activeTextEditor
      let selection1=editor.selection;
     let selection2;
     for (const change of event.contentChanges) {
      selection2=change.range;
     }
  
     if(selection1.end.line===selection2.start.line&&selection1.end.character===selection2.start.character){
         return;
     }
     
      const selection=getSelection(selection2)
  
  
    const {selections}=editor
    if(selections&&selectRange.length>1){
        return
    }
   
    const info=getInfo({document,selection})
   
    if(!info) return;
     let {value,end}=info
   
    if(value.endsWith('/')) return;
   
    const useResolvedIdForAutoReselect=getExtensionConfig().useResolvedIdForAutoReselect

    
   if(useResolvedIdForAutoReselect){
        const config=getConfig()
        const validId=getValidResolvedId(value,config)
      
        if(!validId) return
    }
    // it  may break scopeName;
    let last=value.split('/').slice(-1)[0]
   
    const range=new vscode.Range(new vscode.Position(end.line,end.character-last.length),end)
   
    selectRange(range)
    
   
}
export default triggerReselect
  
   