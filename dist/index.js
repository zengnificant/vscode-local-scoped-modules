"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vscode = require("vscode");
const fs = require("fs");
const module$1 = require("module");
const path = require("path");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const vscode__namespace = /* @__PURE__ */ _interopNamespaceDefault(vscode);
const getConfig$1 = () => vscode__namespace.workspace.getConfiguration("local-scoped-modules").get("setting");
const getRoot1 = () => {
  const workspaceFolders = vscode__namespace.workspace.workspaceFolders;
  if (workspaceFolders.length === 1)
    return workspaceFolders[0].uri.path;
  const curPath = vscode__namespace.window.activeTextEditor.document.uri.fsPath;
  let ret = [];
  for (let workspaceFolder of workspaceFolders) {
    if (curPath.includes(workspaceFolder.uri.path)) {
      ret.push(workspaceFolder.uri.path);
    }
  }
  ret.sort((a, b) => b.length - a.length);
  return ret[0];
};
const getRoot2 = () => {
  let curPath = vscode__namespace.window.activeTextEditor.document.uri.fsPath;
  let firstBaseDir = path.dirname(curPath);
  let baseDir = path.dirname(curPath);
  let cache = [];
  while (!cache.includes(baseDir)) {
    cache.push(baseDir);
    let curBaseConfigFile = path.join(baseDir, "package.json");
    if (!fs.existsSync(curBaseConfigFile)) {
      baseDir = path.dirname(baseDir);
      continue;
    }
    return baseDir;
  }
  return firstBaseDir;
};
const fn$4 = () => {
  const mode = getConfig$1().rootPathMode;
  if (mode == "vscode")
    return getRoot1();
  if (mode == "package.json")
    return getRoot2();
  return getRoot2();
};
const require$1 = module$1.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.src || new URL("index.js", document.baseURI).href);
const defaultObts = {
  rootPrefix: "~",
  scopePrefix: "@",
  scopes: [],
  calleeNames: ["require", "import"]
};
const has = (arr, one) => {
  return arr.find((el) => {
    return el.name === one.name;
  });
};
const getDefaultOpts = () => {
  const { rootPrefix } = defaultObts;
  let scope = { name: rootPrefix, dir: rootPrefix };
  if (!has(defaultObts.scopes, scope)) {
    defaultObts.scopes.push(scope);
  }
  return defaultObts;
};
const getConfigFile = (filename) => {
  const rootPath = fn$4();
  let file = (filename == null ? void 0 : filename.length) ? filename : "local-scoped-modules.config.js";
  file = file.replace(/^(\.+\/)+(.*)/, "$2");
  return path.join(rootPath, file);
};
const getCalleeNames = (calleeNames) => {
  let ret = [...calleeNames];
  for (let el of defaultObts.calleeNames) {
    if (!ret.includes(el)) {
      ret.push(el);
    }
  }
  return ret;
};
const getConfig = () => {
  const configFile = getConfigFile(getConfig$1().pluginConfigFilename);
  if (!fs.existsSync(configFile)) {
    return getDefaultOpts();
  }
  const config = require$1(configFile);
  if (typeof config != "object")
    return defaultObts;
  const ret = {};
  const myOpts = { ...defaultObts, ...config };
  for (let k in defaultObts) {
    if (k == "calleeNames") {
      ret[k] = getCalleeNames(myOpts[k]);
      continue;
    }
    ret[k] = myOpts[k];
  }
  const { rootPrefix, scopes } = myOpts;
  if (!scopes.find((el) => el.name === rootPrefix)) {
    scopes.unshift({ name: rootPrefix, dir: rootPrefix });
  }
  return ret;
};
const pattern$1 = /\s*import\s*(['"])[^'"`]*\1$|\s*from\s*(['"])[^'"`]*\2$/;
let getPattern2$1 = (calleeNames = ["require", "import"]) => {
  const str = calleeNames.join("|");
  const reg = new RegExp(`(\\.|\\s*)(${str})(?!.*\\2)\\s*\\((['"\`])[^'"\`]*\\3$`);
  return reg;
};
const getInfo2FromMatchStr = (str) => {
  const retMatch = str.match(/(['"`])(.*)\1/);
  let value = retMatch[2];
  return value;
};
const getValByPattern = (pattern2, str) => {
  let val;
  str.replace(pattern2, (...args) => {
    const matchStr = args[0];
    val = getInfo2FromMatchStr(matchStr);
  });
  return val;
};
const fn$3 = (str, basePos = 0, curPos = 1, opts = {}) => {
  const index = curPos - basePos;
  let afterStr = str.slice(index);
  let matchAfter = afterStr.match(/['"`]/);
  if (!matchAfter)
    return;
  let subStr = str.slice(0, index) + matchAfter[0];
  let val, calleeNames = opts.calleeNames;
  const pattern2 = getPattern2$1(calleeNames);
  if (pattern$1.test(subStr)) {
    val = getValByPattern(pattern$1, subStr);
  } else if (pattern2.test(subStr)) {
    val = getValByPattern(pattern2, subStr);
  }
  return val;
};
const getInfo = (editor0) => {
  let editor = editor0 ? editor0 : vscode__namespace.window.activeTextEditor;
  const { document: document2, selection } = editor;
  if (!selection) {
    return;
  }
  if (!selection.isEmpty) {
    return;
  }
  const position = selection.active;
  const textLine = document2.lineAt(position);
  const startPosition = new vscode__namespace.Position(position.line, 0);
  const textFromRange = textLine.text;
  const myOpts = getConfig();
  const basePos = document2.offsetAt(startPosition);
  const curPos = document2.offsetAt(position);
  const value = fn$3(textFromRange, basePos, curPos, myOpts);
  if (value == null)
    return;
  let startPosition2 = new vscode__namespace.Position(position.line, position.character - value.length);
  return { value, start: startPosition2, end: position };
};
const isPattern = (str) => {
  return str.includes("*") || str.includes("?");
};
const getRegFromPattern = (pattern2) => {
  const regexPattern = pattern2.replace(/[/\\]/g, "\\$&").replace(/\*+/g, ".*").replace(/\?/g, ".");
  const regex = new RegExp(regexPattern);
  return regex;
};
const shouldBeIgnored = (fileOrDir, ignore) => {
  if (typeof fileOrDir != "string") {
    return;
  }
  let ret = false;
  for (let ig of ignore) {
    if (isPattern(ig)) {
      ret = getRegFromPattern(ig).test(fileOrDir);
    } else {
      ret = ig === fileOrDir;
    }
    if (ret)
      return ret;
  }
};
const getIgnore = (ignore) => {
  if (typeof ignore == "string") {
    return [ignore];
  }
  if (Array.isArray(ignore)) {
    return ignore;
  }
  return getConfig$1()["ignore"] || [];
};
const fn$2 = (dir, ignore) => {
  ignore = getIgnore(ignore);
  const ret = fs.readdirSync(dir);
  const dirs = [];
  const files = [];
  for (let fileOrDir of ret) {
    if (shouldBeIgnored(fileOrDir, ignore)) {
      continue;
    }
    const curPath = dir + "/" + fileOrDir;
    const stat = fs.statSync(curPath);
    if (stat.isDirectory()) {
      dirs.push({ dir: fileOrDir + "/", type: "dir" });
      continue;
    }
    if (stat.isFile()) {
      files.push({ dir: fileOrDir, type: "file" });
      continue;
    }
  }
  dirs.sort();
  files.sort();
  return [...dirs, ...files];
};
const getEmptyInfoCompletionItems = () => {
  const opts = getConfig();
  const { scopes } = opts;
  const sort = (a, b) => {
    if (a.name == "~") {
      return -1;
    }
    for (let i = 0; i < Math.min(a.name.length, b.name.length); i++) {
      if (a.name[i] == b.name[i]) {
        continue;
      }
      return a.name[i].charCodeAt(0) - b.name[i].charCodeAt(0);
    }
    return a.name.length - b.name.length;
  };
  scopes.sort(sort);
  let completions = [];
  scopes.map((scope, i) => {
    let item = new vscode__namespace.CompletionItem(scope.name + "/", vscode__namespace.CompletionItemKind.Folder);
    item.sortText = "a" + String.fromCharCode(i);
    completions.push(item);
  });
  return completions;
};
const getCompletionItems = () => {
  const rootPath = fn$4();
  const info = getInfo();
  const { scopePrefix, rootPrefix, scopes } = getConfig();
  if (!info)
    return;
  let word = info.value;
  if (!word.length)
    return getEmptyInfoCompletionItems();
  let completions = [];
  if (word == scopePrefix) {
    if (!scopes.length) {
      return completions;
    }
    scopes.sort();
    scopes.forEach((el, i) => {
      let scopeName = el["name"];
      if (scopeName.startsWith(scopePrefix)) {
        scopeName = scopeName + "/";
        let item = new vscode__namespace.CompletionItem(scopeName, vscode__namespace.CompletionItemKind.Folder);
        item.insertText = scopeName.slice(scopePrefix.length);
        item.sortText == String.fromCharCode(0) + String.fromCharCode(i);
        completions.push(item);
      }
    });
    return completions;
  }
  if (!word.endsWith("/")) {
    return completions;
  }
  for (let scope of scopes) {
    let scopeName = scope["name"];
    let scopeDir = scope["dir"].replace(rootPrefix, rootPath);
    if (word.startsWith(scopeName)) {
      word = word.replace(scopeName, scopeDir);
      break;
    }
  }
  const ret = fn$2(word).map((el, i) => {
    let item;
    if (el.type === "file") {
      item = new vscode__namespace.CompletionItem(el.dir, vscode__namespace.CompletionItemKind.File);
    } else {
      item = new vscode__namespace.CompletionItem(el.dir, vscode__namespace.CompletionItemKind.Folder);
    }
    item.sortText = String.fromCharCode(0) + String.fromCharCode(i);
    return item;
  });
  return ret;
};
const createShardCompletionProvider = () => {
  return {
    provideCompletionItems(document2, position, token, context) {
      const { useAutoCompletion } = getConfig$1();
      if (!useAutoCompletion) {
        return;
      }
      if (["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"].includes(document2.languageId)) {
        let completionItems = getCompletionItems();
        if (!(completionItems == null ? void 0 : completionItems.length)) {
          return;
        }
        return new vscode__namespace.CompletionList(completionItems, true);
      }
    }
  };
};
let provider1 = vscode__namespace.languages.registerCompletionItemProvider(["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"], createShardCompletionProvider());
const escapeStringRegexp$1 = /* @__PURE__ */ (() => {
  const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;
  return (string) => {
    if (typeof string !== "string") {
      throw new TypeError("Expected a string");
    }
    return string.replace(matchOperatorsRegex, "\\$&");
  };
})();
function getValidResolvedId$1(id, opts) {
  let { rootPrefix, scopePrefix, scopes } = opts;
  if (id == null)
    return;
  let regex = new RegExp(`^${escapeStringRegexp$1(scopePrefix)}[-_0-9A-z/]+`);
  const check1 = id === rootPrefix || id.startsWith(`${rootPrefix}/`) && id.split(rootPrefix).length === 2 || regex.test(id) && id.split(scopePrefix).length === 2;
  if (!check1) {
    return null;
  }
  let ret = null;
  scopes.some((scope, i) => {
    let name = scope.name, dir = scope.dir.replace(rootPrefix, ".");
    if (id === name || id.startsWith(`${name}/`) && id.split(name).length === 2) {
      ret = id.replace(name, dir);
      return true;
    }
    return false;
  });
  return ret;
}
const createSelection = (start, end) => {
  return new vscode__namespace.Selection(start, end);
};
const getSelection = (selection2) => {
  let start = selection2.start;
  return createSelection(start, start);
};
function selectRange(range) {
  const editor = vscode__namespace.window.activeTextEditor;
  editor.selection = new vscode__namespace.Selection(range.start, range.end);
}
const triggerReselect = (event) => {
  const { useAutoReselectAfterDelete } = getConfig$1();
  if (!useAutoReselectAfterDelete) {
    return;
  }
  const document2 = event.document;
  if (!document2.isDirty) {
    return;
  }
  const editor = vscode__namespace.window.activeTextEditor;
  let selection1 = editor.selection;
  let selection2;
  for (const change of event.contentChanges) {
    selection2 = change.range;
  }
  if (selection1.end.line === selection2.start.line && selection1.end.character === selection2.start.character) {
    return;
  }
  const selection = getSelection(selection2);
  const { selections } = editor;
  if (selections && selectRange.length > 1) {
    return;
  }
  const info = getInfo({ document: document2, selection });
  if (!info)
    return;
  let { value, end } = info;
  if (value.endsWith("/"))
    return;
  const useResolvedIdForAutoReselect = getConfig$1().useResolvedIdForAutoReselect;
  if (useResolvedIdForAutoReselect) {
    const config = getConfig();
    const validId = getValidResolvedId$1(value, config);
    if (!validId)
      return;
  }
  let last = value.split("/").slice(-1)[0];
  const range = new vscode__namespace.Range(new vscode__namespace.Position(end.line, end.character - last.length), end);
  selectRange(range);
};
const escapeStringRegexp = /* @__PURE__ */ (() => {
  const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;
  return (string) => {
    if (typeof string !== "string") {
      throw new TypeError("Expected a string");
    }
    return string.replace(matchOperatorsRegex, "\\$&");
  };
})();
function getValidResolvedId(id, opts) {
  let { rootPrefix, scopePrefix, scopes } = opts;
  if (id == null)
    return;
  let regex = new RegExp(`^${escapeStringRegexp(scopePrefix)}[-_0-9A-z/]+`);
  const check1 = id === rootPrefix || id.startsWith(`${rootPrefix}/`) && id.split(rootPrefix).length === 2 || regex.test(id) && id.split(scopePrefix).length === 2;
  if (!check1) {
    return null;
  }
  const scopes2 = scopes.concat({ name: rootPrefix, dir: rootPrefix });
  let ret = null;
  scopes2.some((scope, i) => {
    let name = scope.name;
    if (id === name || id.startsWith(`${name}/`) && id.split(name).length === 2) {
      ret = scope;
      return true;
    }
    return false;
  });
  return ret;
}
const getVerboseSingle = (arr, i) => {
  const [value, scope] = arr;
  const { name, dir } = scope;
  const rest = value.replace(name, "");
  const ret = `* {'${name}' => ${dir.replace("~", "<projectRoot>")}}${rest}`;
  return ret;
};
const getVerbose = (arr, eol) => {
  if (arr.length == 1) {
    let msg = getVerboseSingle(arr[0]);
    return `//**lsm:verbose${msg + eol}`;
  }
  let start = `/${"*".repeat(5)}lsm:verbose`;
  let main = arr.map(getVerboseSingle).join(eol);
  let end = "*/" + eol;
  return [start, main, end].join(eol);
};
const pattern = /\s*import\s*(['"])([^'"`]+)\1|\s*from\s*(['"])([^'"`]+)\3/g;
let getPattern2 = (calleeNames = ["require", "import"]) => {
  const str = calleeNames.join("|");
  const reg = new RegExp(`(\\.|\\s*)(${str})\\s*\\((['"\`])([^'"\`]+)\\3`);
  return reg;
};
const getAll = (str, opts, eol = "\n") => {
  let ret = [];
  const fn2 = (start) => {
    let calleeNames = opts.calleeNames;
    const pattern2 = getPattern2(calleeNames);
    let start0 = start;
    str.slice(start).replace(pattern, (...args) => {
      let temp = args[2] || args[4], order = args.slice(-2, -1)[0], first = args[0];
      let scope = getValidResolvedId(temp, opts);
      if (scope) {
        ret.push([temp, scope, order]);
      }
      start += order + first.length;
    });
    str.slice(start).replace(pattern2, (...args) => {
      let temp = args[4], order = args.slice(-2, -1)[0], first = args[0];
      let scope = getValidResolvedId(temp, opts);
      if (scope) {
        ret.push([temp, scope, order]);
      }
      start += order + first.length;
    });
    let last = start;
    if (last != start0) {
      fn2(last);
    }
  };
  fn2(0);
  if (ret.length) {
    return getVerbose(ret, eol);
  }
};
const addPattern = /(\/\*\*lsm:verbose)(?!.*\1).*\*\/\r?\n$/s;
const addPattern2 = /\/\/\*+lsm:verbose.*(\r?\n)+$/;
const removePattern = /\/\*+lsm:verbose.*\r?\n(\*.*\r?\n)+.*\*\/(\r?\n)+$/;
const removePattern2 = /\/\/\*+lsm:verbose.*(\r?\n)+$/;
const dealWithPoition$1 = (textEditor, position) => {
  var _a, _b;
  const document2 = textEditor.document;
  const eol = document2.eol == 1 ? "\n" : "\r\n";
  let textLine = document2.lineAt(position);
  let str = document2.getText(textLine.range);
  const opts = getConfig();
  const verbose = getAll(str, opts, eol);
  const start = new vscode__namespace.Position(0, 0);
  const end = new vscode__namespace.Position(position.line, 0);
  const beforeText = document2.getText(new vscode__namespace.Range(start, end));
  let matchText = (_a = beforeText.match(addPattern)) == null ? void 0 : _a[0];
  let matchText2 = (_b = beforeText.match(addPattern2)) == null ? void 0 : _b[0];
  const text = matchText2 || matchText;
  if (text == verbose || (text == null ? void 0 : text.includes(verbose))) {
    return;
  }
  return verbose;
};
const fn$1 = (textEditor, edit) => {
  const { verbose } = getConfig$1();
  if (!verbose)
    return;
  const { selections } = textEditor;
  let rets = [];
  let lines = [];
  selections.map((sel) => {
    for (let i = sel.start.line; i < sel.end.line + 1; i++) {
      if (!lines.includes(i)) {
        lines.push(i);
      }
    }
  });
  lines.map((line) => new vscode__namespace.Position(line, 0)).map((pos) => {
    let text = dealWithPoition$1(textEditor, pos);
    if (text && text.length) {
      rets.push([pos, text]);
    }
  });
  rets.map((el) => {
    edit.insert(...el);
  });
};
const verboseCommandDisposable1 = vscode__namespace.commands.registerTextEditorCommand("local-scoped-modules.addVerbose", fn$1);
const dealWithPoition = (textEditor, position) => {
  var _a, _b;
  const document2 = textEditor.document;
  let line = position.line;
  const start = new vscode__namespace.Position(0, 0);
  const end = new vscode__namespace.Position(line, 0);
  const beforeText = document2.getText(new vscode__namespace.Range(start, end));
  let matchText = (_a = beforeText.match(removePattern)) == null ? void 0 : _a[0];
  let matchText2 = (_b = beforeText.match(removePattern2)) == null ? void 0 : _b[0];
  let text = matchText2 || matchText;
  if (text) {
    const lineNum = text.split("\n").length - 1;
    let startLine = line - lineNum;
    let start2 = new vscode__namespace.Position(startLine, 0);
    let offset = document2.offsetAt(position);
    let end2 = document2.positionAt(offset);
    return new vscode__namespace.Range(start2, end2);
  }
};
const fn = (textEditor, edit) => {
  const { verbose } = getConfig$1();
  if (!verbose)
    return;
  const { selections } = textEditor;
  let rets = [];
  let lines = [];
  selections.map((sel) => {
    for (let i = sel.start.line; i < sel.end.line + 1; i++) {
      if (!lines.includes(i)) {
        lines.push(i);
      }
    }
  });
  lines.map((line) => new vscode__namespace.Position(line, 0)).map((pos) => {
    let range = dealWithPoition(textEditor, pos);
    if (range) {
      rets.push(range);
    }
  });
  rets.map((el) => {
    edit.delete(el);
  });
  const { immediatelySaveWhenRemoveVerbose } = getConfig$1();
  if (immediatelySaveWhenRemoveVerbose) {
    vscode__namespace.commands.executeCommand("workbench.action.files.save");
  }
};
const verboseCommandDisposable2 = vscode__namespace.commands.registerTextEditorCommand("local-scoped-modules.removeVerbose", fn);
const verboseOnSave = (e) => {
  const { verbose, useVerboseOnSave } = getConfig$1();
  if (verbose && useVerboseOnSave) {
    vscode__namespace.commands.executeCommand("local-scoped-modules.addVerbose", "verboseOnSave");
  }
};
const triggerIntelliSense = (e) => {
  const completions = getCompletionItems();
  if (!(completions == null ? void 0 : completions.length))
    return;
  vscode__namespace.commands.executeCommand("editor.action.triggerSuggest");
};
function activate(context) {
  const disposable1 = vscode__namespace.window.onDidChangeTextEditorSelection(triggerIntelliSense);
  const disposable2 = vscode__namespace.workspace.onDidChangeTextDocument(triggerReselect);
  const disposable3 = vscode__namespace.workspace.onWillSaveTextDocument(verboseOnSave);
  const getList = () => {
    let ret = [];
    ret.push(disposable1, provider1);
    ret.push(disposable2);
    ret.push(verboseCommandDisposable1, verboseCommandDisposable2);
    ret.push(disposable3);
    return ret;
  };
  context.subscriptions.push(...getList());
}
const deactivate = () => {
};
exports.activate = activate;
exports.deactivate = deactivate;
