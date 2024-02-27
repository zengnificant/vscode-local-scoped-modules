const escapeStringRegexp = (() => {
    const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;
    return string => {
        if (typeof string !== 'string') {
            throw new TypeError('Expected a string');
        }
        return string.replace(matchOperatorsRegex, '\\$&');
    }
})()




function getValidResolvedId(id, opts) {
 
   let  { rootPrefix, scopePrefix, scopes }=opts
   if(id==null) return

    let regex = new RegExp(`^${escapeStringRegexp(scopePrefix)}[\-_0-9A-z/]+`)
    const check1 = id === rootPrefix ||
        (id.startsWith(`${rootPrefix}/`) && id.split(rootPrefix).length === 2) ||
        (regex.test(id) && id.split(scopePrefix).length === 2)

    if (!check1) {
        return null;
    }
 
    const scopes2 = scopes.concat({name:rootPrefix,dir:rootPrefix})
    let ret=null
   
    scopes2.some((scope,i) => {
        let name=scope.name
        if (id === name || (id.startsWith(`${name}/`) && id.split(name).length === 2)) {
            ret=scope
            return true
        }
        return false;
    });
    return ret
}


export default  getValidResolvedId;