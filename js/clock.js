var day_names = new Array ("SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT");

setInterval(updateClock, 1000);  
 
function updateClock() { 
    var now = new Date(); 
    var m = now.getMinutes(); 
    var h = now.getHours(); 

    // time
    var mins = (m < 10 ? '0' : '') + m;
    $("#time .mins").text(mins);
    var hours = (h < 10 ? '0' : '') + h;
    $("#time .hours").text(hours);

    // date
    $("#day").text(day_names[now.getDay()]);
    $("#date").text(now.getDate() + " / " + (now.getMonth() + 1));

    var $sep = $('#time .sep');
    var op = parseInt($sep.css('opacity'));
    if (op === 0) {
      $sep.animate({"opacity":1}, 500);
    } else {
      $sep.animate({"opacity":0}, 500);
    }
} 
