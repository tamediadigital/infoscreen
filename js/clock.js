var day_names = new Array ("SUN", "MON", "TUES", "WEDS", "THURS", "FRI", "SAT");

setInterval(updateClock, 1000);  
 
function updateClock() { 
    var now = new Date(); 
    var min = now.getMinutes(); 
    var hour = now.getHours(); 
    $("#day").text(day_names[now.getDay()]);
    $("#date").text(now.getDate() + "/" + (now.getMonth() + 1) + "/" + (now.getFullYear()-2000));    
    $("#time").text((hour < 10 ? '0' : '') + hour + " " + (min < 10 ? '0' : '') + min);
	$("#time_").text((now.getSeconds()%2 == 0 ? ':' : ' ') );
} 
