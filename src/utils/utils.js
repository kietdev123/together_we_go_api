
const splitAddress = (pointMainText, pointAddress) => {

    let result = {
      'level1' : pointMainText
    }
    let strs = pointAddress.replaceAll(" ","").split(',');

    let pos = 4;
    for (let i = strs.length - 1; i >= Math.max(strs.length - 3,0); i--){
      if (pos > -1) {
        result[`level${pos}`] = strs[i]; 
        pos--
      }
    }
    if (strs.length - 4 >= 0){
      for (let i = 0 ; i <= strs.length - 4;i++) {
        result.level1 += strs[i]
      }
    }
    return result;
}


module.exports = {
  splitAddress,
}