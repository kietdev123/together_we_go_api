
const splitAddress = (pointMainText, pointAddress) => {
    pointAddress = stringToSlug(pointAddress)
    pointMainText = stringToSlug(pointMainText)
    
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

const stringToSlug = (str) => {
  if (str == null || str == undefined)  return "";
  // remove accents
  var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i=0, l=from.length ; i < l ; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');

  return str;
}
module.exports = {
  splitAddress,
  stringToSlug
}