const pattern=/\s*import\s*(['"])[^'"`]*\1$|\s*from\s*(['"])[^'"`]*\2$/

// /(\.|\s*)(require|import)\s*\((['"`]).*\3.*\)/
let getPattern2=(calleeNames=["require","import"])=>{
    const str=calleeNames.join('|')
    const  reg=new RegExp(`(\\.|\\s*)(${str})(?!.*\\2)\\s*\\((['"\`])[^'"\`]*\\3\$`)
    return reg
}

const getInfo2FromMatchStr=(str)=>{
    const retMatch=str.match(/(['"`])(.*)\1/)
    let value=retMatch[2]
   
    return value
}


const getValByPattern=(pattern,str)=>{
    let val;
        str.replace(pattern,(...args)=>{
            const matchStr=args[0]
          val= getInfo2FromMatchStr(matchStr)
        })
    return val;

}



const fn=(str,basePos=0,curPos=1, opts={})=>{
    const index=curPos-basePos
    let afterStr=str.slice(index)
   let matchAfter=afterStr.match(/['"`]/)
  
   if(!matchAfter) return;
    //supply  a  quote;

  
   let subStr=str.slice(0,index)+matchAfter[0]
    let val,calleeNames=opts.calleeNames
  
 
   const pattern2=getPattern2(calleeNames)
  
    if(pattern.test(subStr)){
        val=getValByPattern(pattern,subStr)
    }else if(pattern2.test(subStr)){
        val=getValByPattern(pattern2,subStr)
    }
   
    return val
}
export default fn;