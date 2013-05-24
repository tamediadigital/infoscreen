// config
var config = {
     title: 'Information',
     showNavigation: false,
     showTime: true,
};

// content
//var content_key = '0AnrtptTR3KifdG5OVXFxWl9mVHAxYVoybXBTcXU3elE';
var content_key = '0Av0G-GmOlMZ6dEZaS2JtMTBPOWFtX1VXNnA1R2FCa3c';
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
        var distance = 900;
        TweenLite.set($('#body'), {perspective: distance});
        CSSPlugin.defaultTransformPerspective = distance;
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

function updateSlice(step) {
    if (content.length != 0) {
        slide = (slide + content.length + step) % content.length;
        // show title
        console.log(slide);
        $("#bar .page").text((slide+1) + '/' + content.length);
        $("#title").text(content[slide][k_name]);
        // show content
        $('#contentFrame iframe').attr('src', content[slide][k_link]);
        TweenLite.to($('#contentFrame'), 2, {
            transformOrigin:"50& 50%", 
            rotationY:-360,
            onComplete: function(){
                TweenLite.to($('#contentFrame'), 0, {transformOrigin:"50% 50%", rotationY:-0});
                console.log('done');
            }
        });        
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

}



function initEventHandlers(){
  // navigation
  $("#bar .nav .left").click(function () { 
      updateSlice(-1);  
  });
  $("#bar .nav .right").click(function () { 
      updateSlice(1);  
  });

  $(document).keydown(function(e) {
    if (!e) {
      e = window.event;
    }
    if (e.keyCode == 65 || e.keyCode == 37) { // A or left 
      updateSlice(-1);
    } else if (e.keyCode == 68 || e.keyCode == 39) { // D or right 
      updateSlice(1);
    }
  });

  $(window).resize(resizeFrame);    
}

function resizeFrame() {
  var w = window.innerWidth-100;
  var h = window.innerWidth;
  $('#contentFrame iframe').css({
    height: $(window).height() - 86,
    width: $(window).width()
  });
}

    $(document).ready(function(){
        updateClock();
        initializeContent();
        resizeFrame();
        initEventHandlers();
    });
    

