import * as vscode  from  'vscode';
import  getConfig from '../config/plugin-config.js' 
import  getSource from './getSource.js'

const  getInfo=(editor0)=>{
    let  editor=editor0?editor0:vscode.window.activeTextEditor
   
      const  {document,selection}=editor
      if(!selection){
        return;
       }
       if(!selection.isEmpty){
        return;
       }
     const position=selection.active
  
     const textLine=document.lineAt(position)
     const startPosition=new vscode.Position(position.line,0)
     const textFromRange=textLine.text
     const myOpts=getConfig()
   
     const basePos=document.offsetAt(startPosition)
     const curPos=document.offsetAt(position)
   
     const value=getSource(textFromRange,basePos,curPos, myOpts)
   
     if(value==null) return
     let  startPosition2=new vscode.Position(position.line,position.character-value.length)
     
    
     return {value,start:startPosition2,end:position}
    
     
  }

export default getInfo
  