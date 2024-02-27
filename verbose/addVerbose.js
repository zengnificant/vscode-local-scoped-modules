import * as vscode  from 'vscode'
import getMatchedVerbose from './getMatchedVerbose.js'
import  getConfig from '../config/plugin-config.js'
import {addPattern,addPattern2}  from '../verbose/verbosePattern.js'
import getExtensionConfig  from '../config/extension-config.js'
const dealWithPoition=(textEditor,position,)=>{
  const document=textEditor.document
  const eol=document.eol==1?'\n':'\r\n'
  let textLine=  document.lineAt(position)
 
  let str=document.getText(textLine.range)
 
  const opts=getConfig()

  const verbose= getMatchedVerbose(str,opts,eol)
  
  const start=new vscode.Position(0,0)
  const end=new vscode.Position(position.line,0)
  const  beforeText=document.getText(new vscode.Range(start,end))
  let matchText=beforeText.match(addPattern)?.[0]
  let matchText2=beforeText.match(addPattern2)?.[0]
  const text=matchText2||matchText
  if(text==verbose||text?.includes(verbose)){
    return
  }
  
   return verbose;

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
              
                 let  text=dealWithPoition(textEditor,pos)
             
                 if(text&&text.length){
                  rets.push([pos,text])
                 }
      })

     
      rets.map(el=>{
        edit.insert(...el)
      })


}

const verboseCommandDisposable1=vscode.commands.registerTextEditorCommand("local-scoped-modules.addVerbose",fn)
export  default verboseCommandDisposable1;