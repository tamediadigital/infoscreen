///////////////////////////////////////////////////////////////////////////////////////
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

///////////////////////////////////////////////////////////////////////////////////////
if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}

///////////////////////////////////////////////////////////////////////////////////////
if (typeof String.prototype.hasParameterByName != 'function') {
  String.prototype.hasParameterByName = function (name){
      return (this.search(name) != -1);
  };
}
// 
// 
// function hasParameterByName(name, href) {
//     if (href) {
//         return (href.search(name) != -1);
//     }
//     return false;
// }

///////////////////////////////////////////////////////////////////////////////////////
if (typeof String.prototype.getParameterByName != 'function') {
  String.prototype.getParameterByName = function (name){
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( this );
      if( results == null )
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
  };
}
// 
// function getParameterByName(name, href) {
//   name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
//   var regexS = "[\\?&]"+name+"=([^&#]*)";
//   var regex = new RegExp( regexS );
//   var results = regex.exec( href );
//   if( results == null )
//     return "";
//   else
//     return decodeURIComponent(results[1].replace(/\+/g, " "));
// }
// 
