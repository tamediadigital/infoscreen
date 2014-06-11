// config
var config = {
     title: 'Information',
     showNavigation: false,
     showTime: true,
};

// content
var content_key = '0AnrtptTR3KifdG5OVXFxWl9mVHAxYVoybXBTcXU3elE';
//var content_key = '0Av0G-GmOlMZ6dEZaS2JtMTBPOWFtX1VXNnA1R2FCa3c';
var content = [];
var k_name = 'name';
var k_link = 'link';
var k_time = 'time';
var slide = -1;
var active_frame = 0;
var next_url;

Timer = function(callback, delay) {
  var timerId, start, remaining = delay;
  var paused = false;

  this.pause = function() {
    paused = true;
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  this.resume = function() {
    paused = false;
    start = new Date();
    timerId = window.setTimeout(callback, remaining);
  };

  this.seconds_left = function(){
    if (!paused){
      return (new Date() - start)/1000;      
    } else {
      return (duration - remaining)/1000;
    }
    
  };

  this.duration = function(){
    return remaining/1000;
  };

  this.resume();
};
var timer;

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
                    config[property] = $.parseJSON(value.toLowerCase());
                }
            }
        }
		// set configs
		if (!config['showNavigation']) {
			$('.nav').hide();
		}
		if (!config['showTime']) {
			$('#datetime').hide();
		}
    }).error(function(message) {
        alert('error' + message);
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
        alert('error' + message);
    });

    setInterval(function(){
      if (timer){
        var percent = parseInt(timer.seconds_left()/timer.duration()*100);
        //console.log(percent);
        $('#bar .timer .fill').height((100-percent)+'%');
      }
    }, 500);
}

function updateSlice(step, wait) {
  if (content.length != 0) {
    var $incoming = $('#frame' + active_frame);
    var $outgoing = $('#frame' + (active_frame ^ 1));
    active_frame = active_frame ^ 1;
    slide = (slide + content.length + step) % content.length;

    // reset pause button
    $("#bar .nav .pause i").attr('class','icon-play').removeClass('pulse');

    // show content
    var src = content[slide][k_link];
    var left_landing  = (0 - $(window).width())+'px';
    var right_landing = $(window).width()+'px';

    if (src != next_url){
      console.log('loading '+src+' into '+$incoming.attr('id'));
      //$incoming.attr('src','about:blank');
      setTimeout(function(){ $incoming.attr('src', src); }, 50);
    }
    $incoming.css({
      'left': (step === 1 ? right_landing : left_landing),
    });

    $outgoing.css({
      'left': 0
    });

    var afterAppear = function(){  
      // show title
      $("#bar .page").text((slide+1) + '/' + content.length);
      // guess next one for preload
      var next_one = (slide + content.length + 1) % content.length;
      next_url = content[next_one][k_link];
      $outgoing.attr('src', next_url);
      console.log('pre-loading '+next_url+' into '+$outgoing.attr('id'));
      $('body').scrollLeft(0);
    };

    setTimeout(function(){
      // set title
      $("#header .title").text(content[slide][k_name]);

      // transition
      var ease_time = 0.7;
      var transition = Strong.easeOut;
      TweenLite.to($incoming, ease_time, {
        left: '0px',
        onComplete: afterAppear,
        ease: transition
      });
      TweenLite.to($outgoing, ease_time, {
        left: (step === 1 ? left_landing : right_landing),
        ease: transition
      });

      setLoopTimer(content[slide][k_time]);
    }, wait ? 300 : 10);
  } else {
    alert('No content available.');
  }
}

function setLoopTimer(time) {
	if (time == null) { time = 1;	}
	// initialize new timer
  if (timer){ timer.pause(); }
  timer = new Timer(function(){ updateSlice(1,true) }, time*1000); 
}

function resetFocus() {
  $('#bar .nav .focus-grabber').focus().delay(2).blur();
  $('body').scrollLeft(0);
}

function initEventHandlers(){
  // button nav
  $("#bar .nav .left").click(function () { 
      updateSlice(-1);  
  });
  $("#bar .nav .right").click(function () { 
      updateSlice(1);  
  });  
  $("#bar .nav .pause").click(function () { 
    var icon = $('i',this);
    if (icon.hasClass('icon-play')) {
        timer.pause();
        icon.attr('class','icon-pause').addClass('pulse');
    } else { 
      timer.resume();
      icon.attr('class','icon-play').removeClass('pulse'); 
    }
  });

  // keyboard nav
  $(document).keydown(function(e) {
    if (!e) {
      e = window.event;
    }
    if (e.keyCode == 32) { // pause
      e.preventDefault();
      $("#bar .nav .pause").trigger('click');
    }
    if (e.keyCode == 65 || e.keyCode == 37) { // A or left 
      e.preventDefault();
      updateSlice(-1);
    } else if (e.keyCode == 68 || e.keyCode == 39) { // D or right 
      e.preventDefault();
      updateSlice(1);
    }
  });

  // re-claim focus from iframes on load
  $('#contentFrame iframe').on('load', function(){
    setTimeout(resetFocus, 500)
  });

  $(window).resize(resizeFrame);    
}

function initViewport(){
  var distance = 900;
  TweenLite.set($('#body'), {perspective: distance});
  CSSPlugin.defaultTransformPerspective = distance;
  resizeFrame();
}

function resizeFrame() {
  $('#contentFrame iframe').css({
    height: $(window).height() - 86,
    width: $(window).width()
  });
  $('body').scrollLeft(0);
  // $('#container').css({
  //   height: $(window).height(),
  //   width: $(window).width()
  // });
}

$(document).ready(function(){
    updateClock();
    initializeContent();
    initViewport();
    initEventHandlers();
});
    

// // 3d flip
//
// TweenLite.to($('#contentFrame'), 2, {
//     transformOrigin:"50& 50%", 
//     rotationY:-360,
//     onComplete: function(){
//         TweenLite.to($('#contentFrame'), 0, {transformOrigin:"50% 50%", rotationY:-0});
//         console.log('done');
//     }
// });        
