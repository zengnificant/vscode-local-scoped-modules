import * as vscode  from  'vscode';

const getConfig=()=>vscode.workspace.getConfiguration('local-scoped-modules').get('setting')



export default getConfig