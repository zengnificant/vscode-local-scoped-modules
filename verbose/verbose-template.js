const getVerboseSingle=(arr,i)=>{

     const [value,scope]=arr;
     const {name,dir}=scope
     const rest=value.replace(name,'')
     const ret=`* {'${name}' => ${dir.replace('~','<projectRoot>')}}${rest}`
     return ret
}






const getVerbose=(arr,eol)=>{
     if(arr.length==1){
        let msg=getVerboseSingle(arr[0])
          return `//**lsm:verbose${msg+eol}`
     }

      let  start=`/${'*'.repeat(5)}lsm:verbose`
      let main=arr.map(getVerboseSingle).join(eol)
       let end='*/'+eol
       return  [start,main,end].join(eol)
}


export  default  getVerbose