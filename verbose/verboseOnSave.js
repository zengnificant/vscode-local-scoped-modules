import * as vscode  from 'vscode'
import getExtensionConfig  from '../config/extension-config.js'

const verboseOnSave=e=>{
   const {verbose,useVerboseOnSave}=getExtensionConfig()
   if(verbose&&useVerboseOnSave){
   vscode.commands.executeCommand('local-scoped-modules.addVerbose','verboseOnSave');
  }
}


export  default  verboseOnSave