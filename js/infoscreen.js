var content_key = '0AnrtptTR3KifdG5OVXFxWl9mVHAxYVoybXBTcXU3elE';
var content = [];
var k_name = 'name';
var k_link = 'link';
var k_time = 'time';
var slide = -1;

var loopTimerID = null;

function hasParameterByName(name, href) {
    if (href) {
        return (href.search(name) != -1);
    }
    return false;
}

function getParameterByName(name, href) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function initializeContent() {
    if (true == hasParameterByName('key', parent.location.href)) {
        content_key = getParameterByName('key', parent.location.href);
    }
    
    var url = 'https://spreadsheets.google.com/feeds/list/' + content_key + '/od6/public/values?alt=json-in-script&callback=?';
    jQuery.getJSON(url).success(function(data) {
        var len = data.feed.entry.length;
        for (i = 0; i < len; i++) {
            var e = data.feed.entry[i];
            var map = new Object();
            map[k_name] = e['gsx$name']['$t'];
            map[k_link] = e['gsx$contenturl']['$t'];
            map[k_time] = e['gsx$displaytime']['$t'];
            content.push(map);            
        }
        updateSlice(1);
    }).error(function(message) {
        console.error('error' + message);
    });
}

function updateSlice(step) {
    if (content.length != 0) {
        slide = (slide + content.length + step) % content.length;
        // show title
        $("#title").text('['+ (slide+1) + '/' + content.length + '] ' + content[slide][k_name]);
        // show content
        parent.contentFrame.location.href = content[slide][k_link];
        // set loop timer
        setLoopTimer(content[slide][k_time]);
   } else {
        alert('No content available.');
    }
}

function setLoopTimer(time) {    
    // clear previous timer
	if (loopTimerID != null) {
		clearTimeout(loopTimerID);
		loopTimerID = null;
	}
	// sanity check: mininum timeout 10s
	if (time == null) {
	    time = 10;
	}
	
	// initiallize new timer
	loopTimerID = setTimeout( "updateSlice(1)", time*1000);
}