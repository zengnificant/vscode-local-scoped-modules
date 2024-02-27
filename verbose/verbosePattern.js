const addPattern=/(\/\*\*lsm:verbose)(?!.*\1).*\*\/\r?\n$/s;
const addPattern2=/\/\/\*+lsm:verbose.*(\r?\n)+$/
const  removePattern=/\/\*+lsm:verbose.*\r?\n(\*.*\r?\n)+.*\*\/(\r?\n)+$/;
const removePattern2=/\/\/\*+lsm:verbose.*(\r?\n)+$/



export {addPattern,addPattern2,removePattern,removePattern2}