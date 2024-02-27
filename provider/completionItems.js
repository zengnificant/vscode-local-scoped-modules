import getCompletionItems from "../utils/getCompletionItems.js";
import * as vscode  from  'vscode';
import  getConfig from '../config/extension-config.js'


const  createShardCompletionProvider=()=>{
    return {
        provideCompletionItems(document, position, token , context) {
            const {useAutoCompletion}=getConfig()
            if(!useAutoCompletion){
                return;
            }
            
            if (['javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'].includes(document.languageId)) {
                // 返回共享的补全项目列表
                let completionItems=getCompletionItems()
                if(!completionItems?.length){
                    return;
                }
                
                return new vscode.CompletionList(completionItems, true);
              }
            }
            
         }
    }


let provider1 = vscode.languages.registerCompletionItemProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact','vue'],createShardCompletionProvider())


export default provider1