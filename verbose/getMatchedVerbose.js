import getValidResolvedId2 from './getValidResolvedId2.js'
import  getVerbose from './verbose-template.js'

const pattern=/\s*import\s*(['"])([^'"`]+)\1|\s*from\s*(['"])([^'"`]+)\3/g

// /(\.|\s*)(require|import)\s*\((['"`]).*\3.*\)/
let getPattern2=(calleeNames=["require","import"])=>{
    const str=calleeNames.join('|')
    const  reg=new RegExp(`(\\.|\\s*)(${str})\\s*\\((['"\`])([^'"\`]+)\\3`)
    return reg
}

const   getAll=(str,opts,eol='\n')=>{
    let ret=[];
const   fn=(start)=>{
    let calleeNames=opts.calleeNames
    const pattern2=getPattern2(calleeNames)
    let start0=start
    
     str.slice(start).replace(pattern,(...args)=>{
         let temp=args[2]||args[4],
              order=args.slice(-2,-1)[0],
              first=args[0]

             
        let scope=getValidResolvedId2(temp,opts)
           if(scope){
              ret.push([temp,scope,order])
           }
           start+=order+first.length
    })
    str.slice(start).replace(pattern2,(...args)=>{
        let temp=args[4],
        order=args.slice(-2,-1)[0],
        first=args[0]
      
        let scope=getValidResolvedId2(temp,opts)
        if(scope){
            ret.push([temp,scope,order])
        }
        start+=order+first.length
    })
    let  last=start;
  
    if(last!=start0){
        fn(last)
    }
   }
   fn(0)
  
   if(ret.length){
        return getVerbose(ret,eol);
   }
}


export default  getAll;
