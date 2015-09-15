$(function() {
  var time = +$("#time").html();

  countdown();
  function countdown() {
      time -= 1;
      if (time == 1) {
          s = "";
      } else {
          s = "s";
      }
      if (!time) {
        $("#time").html("");
        clearInterval(timer);
        $('#timeout').html("");
        $('#loginButton').prop("disabled", false);
      } else {
        $('#timeout').html("Please wait " + time + " second" + s + " before attempting to login again.");
        $('#loginButton').prop("disabled", true);
      }
  }
  var timer = setInterval(function(){countdown()},1000);
});