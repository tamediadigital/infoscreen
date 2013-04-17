// config
var config = {
     title: 'Information',
     showNavigation: false,
     showTime: true,
};

// content
var content_key = '0AnrtptTR3KifdG5OVXFxWl9mVHAxYVoybXBTcXU3elE';
var content = [];
var k_name = 'name';
var k_link = 'link';
var k_time = 'time';
var slide = -1;

// timer
var loopTimerID = null;
setInterval(showActivity, 5000);  

function initializeContent() {
    var ref = parent.location.href;
    if (true == ref.hasParameterByName('key')) {
        content_key = ref.getParameterByName('key');
    }
    
    // load config
    url = 'https://spreadsheets.google.com/feeds/list/' + content_key + '/od7/public/values?alt=json-in-script&callback=?';
    jQuery.getJSON(url).success(function(data) {
        var len = data.feed.entry.length;
        for (i = 0; i < len; i++) {
            var e = data.feed.entry[i];
            var property = e['gsx$property']['$t'];
            if (!property.startsWith('#')) {
                var value = e['gsx$value']['$t'];
                if (config.hasOwnProperty(property)) {
                    console.info(property + ':' + value);
                    config[property] = value;
                }
            }
        }
        applyConfig();
    }).error(function(message) {
        console.error('error' + message);
    });
    
    // load content
    url = 'https://spreadsheets.google.com/feeds/list/' + content_key + '/od6/public/values?alt=json-in-script&callback=?';
    jQuery.getJSON(url).success(function(data) {
        var len = data.feed.entry.length;
        for (i = 0; i < len; i++) {
            var e = data.feed.entry[i];
            var fieldname = e['gsx$name']['$t'];
            // if fieldname starts with a hash we ignore the row (commented out)
            if (!fieldname.startsWith('#')) {
                var map = new Object();
                map[k_name] = e['gsx$name']['$t'];
                map[k_link] = e['gsx$contenturl']['$t'];
                map[k_time] = e['gsx$displaytime']['$t'];
                content.push(map);
            }
        }
        updateSlice(1);
    }).error(function(message) {
        console.error('error' + message);
    });
}

function applyConfig() {
    if (!config.showNavigation.parseBoolean()) {
        console.info("Config: disable navigation ..");
        $("#nav-right").css("visibility", "hidden");
        $("#nav-left").css("visibility", "hidden");
    }
    
    if (config.title != undefined) {
        $("#subtitle").text(config.title);
    }
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

function showActivity() {
    $("#title").text($("#title").text() + '.');
}