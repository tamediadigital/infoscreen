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

///////////////////////////////////////////////////////////////////////////////////////
if (typeof String.prototype.parseBoolean != 'function') {
    String.prototype.parseBoolean = function (){
    	switch(this.toLowerCase()){
    		case "true": case "yes": case "1": return true;
    		case "false": case "no": case "0": case null: return false;
    		default: return Boolean(this);
    	}
	};
}