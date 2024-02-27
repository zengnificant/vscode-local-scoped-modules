
import * as vscode  from 'vscode'

import getCompletionItems from './utils/getCompletionItems.js'
import  provider1 from './provider/completionItems.js'
import triggerReselect from './utils/triggerReselect.js'

import { addVerboseDisposable,
   removeVerboseDisposable} from './verbose/index.js'
import verboseOnSave  from './verbose/verboseOnSave.js'


const triggerIntelliSense=(e)=>{
 
  const completions=getCompletionItems()
  if(!completions?.length) return;
  vscode.commands.executeCommand('editor.action.triggerSuggest')
}




function activate(context){
  
  
 const disposable1 =vscode.window.onDidChangeTextEditorSelection(triggerIntelliSense)

 const  disposable2=vscode.workspace.onDidChangeTextDocument(triggerReselect);
 const  disposable3=vscode.workspace.onWillSaveTextDocument(verboseOnSave)

  const  getList=()=>{
     let ret=[]
 
         ret.push(disposable1,provider1)
     
    
         ret.push(disposable2)
     
         ret.push(addVerboseDisposable,removeVerboseDisposable)
    
         ret.push(disposable3)
    
      return ret;
  }

   context.subscriptions.push(...getList())
  
}
const deactivate=()=>{
   
}

export  {activate,deactivate}