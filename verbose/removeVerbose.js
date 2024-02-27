import * as vscode  from 'vscode'

import {removePattern,removePattern2} from '../verbose/verbosePattern.js'
import getExtensionConfig from '../config/extension-config.js'

const dealWithPoition=(textEditor,position)=>{
  const document=textEditor.document
 let line=position.line
  const start=new vscode.Position(0,0)
  const end=new vscode.Position(line,0)
  const  beforeText=document.getText(new vscode.Range(start,end))
  let matchText=beforeText.match(removePattern)?.[0]
  let matchText2=beforeText.match(removePattern2)?.[0]
  let  text=matchText2||matchText
  if(text){
     const lineNum=text.split('\n').length-1;
     let  startLine=line-lineNum
      let start2 =new vscode.Position(startLine,0)
     let offset=document.offsetAt(position)
     let end2=document.positionAt(offset)
    return  new vscode.Range(start2,end2)
  }
}

const fn=(textEditor,edit)=>{
  const {verbose}=getExtensionConfig()
  if(!verbose)  return;
     const {selections}=textEditor;
    let  rets=[]
    let lines=[]
        selections.map(sel=>{
          for(let i=sel.start.line;i<sel.end.line+1;i++){
            if(!lines.includes(i)){
                lines.push(i)
            }
          }

      })
 lines.map(line=>new vscode.Position(line,0))
         .map(pos=>{
              
           let  range=dealWithPoition(textEditor,pos)
              if(range){
                  rets.push(range)
              }
      })
 
      rets.map(el=>{
        edit.delete(el)
      })
       const {immediatelySaveWhenRemoveVerbose}=getExtensionConfig()
       if(immediatelySaveWhenRemoveVerbose){
           vscode.commands.executeCommand('workbench.action.files.save');
       }
     
}
const verboseCommandDisposable2=vscode.commands.registerTextEditorCommand("local-scoped-modules.removeVerbose",fn)
export  default verboseCommandDisposable2;