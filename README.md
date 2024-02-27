# local-scoped-modules  README

This is the README for the vscode extension "local-scoped-modules". 
It is a vscode auto-completion complement  for  project using
[vite-plugin-local-scoped-modules](https://github.com/zengnificant/vite-plugin-local-scoped-modules). Support any `javascript`/`vue` file ,like `.js`、`.tsx`、`.vue`、`.mjs` and  so on.

## Instruction
* By default ,It is  used in  these patterns :
   * import '(1)'
   * from '(2)'  |  import  from '(2)' (normal import is certainly supported)
   * require('(3)') | import('(3)')

   when the selection is in  area (1)(2)(3), it will trigger 
   auto-comletion(intelliSense),if the string of (1)(2)(3) match `scopes`  defined in your project path`<projectRoot>/local-scoped-module.config.js`(can change  filename by change `local-scoped-modules.setting.pluginConfigFilename`). When  match, string of (1)(2)(3) is called `resolveId`

* tips:
   input `import  from ''`  is recommended, because  this will not trigger  other `intelliSenses`

## Features

*  `auto-completion`

    ![auto-completion](https://raw.githubusercontent.com/zengnificant/vscode-local-scoped-modules/master/images/auto-completion.gif)/auto-completion.gif)

*  `reselect after backspace`

    It is to quickly  delete some routes.

    ![triggerReselect](https://raw.githubusercontent.com/zengnificant/vscode-local-scoped-modules/master/images/auto-completion.gif)/auto-completion.gif)

*  `verbose`

    This is to show  where source  is.
    ![verbose](images/verbose.gif)



## Extension Settings


* `local-scoped-modules.setting`: 

  1). `rootPathMode` : "package.json"|"vscode"(default:"package.json")
  
  where to find rootPath:

  option `package.json` suppose  nearest Parent path  that  has a file of `package.json` is the rootPath;
  
  option `vscode`  suppose  nearest workspaceFolder of vscode is the rootPath
 
  2). `verbose` :boolean  （default :false)

  set `true` to use Verbose and `false` to disable verbose.

  use `ctrl + shift + 8` to add verbose;

  use `ctrl + shift + 7` to  remove verbose.



  3). `useVerboseOnSave` :boolean （default :false)

  whether or not add Verbose on save where current `selections` are. (need:verbose true)

  4). `immediatelySaveWhenRemoveVerbose`:boolean （default :true)

   this won't trigger `3)`  when  set true.(need:verbose true)

  5). `useAutoCompletion`:boolean （default :true)
   whether or not  use feature `auto-completion`

  6). `useAutoReselectAfterDelete`:boolean （default :true)
   whether or not  use feature `reselect after backspace`


  7). `useResolvedIdForAutoReselect`:boolean （default :true) .`enable feature` .

   
   * When set `true`,  it has to be a `resolveId`(see `Instruction`)
   *  When set `false`, a narmal string in those patterns will also  trigger  `reselect after backspace`
  

  8). `ignore`: `string[]`
    when  auto-completion,  items that should be ignored and not be shown in CompletionItems.(support wildcard `*` and `?`)

  9).`pluginConfigFilename` :`string` (default:'local-scoped-modules.config.js')

  where  to load `plugin config`. Currently only support a `cjs` file.If it is not existed, the default  plugin config option will be used.


## Limitations
* Vite project's entry file should  reach  the files  which  use  the feature  of  auto-completion,and [vite-plugin-local-scoped-modules](https://github.com/zengnificant/vite-plugin-local-scoped-modules) should be used in  `vite.config.j(t)s`.


## Lisense
MIT

   
