$(document).foundation();

//
// start the party 
//
$( document ).ready(function() {
  
  // start with random numbers at the bottom
  for (var i = 1; i < 5; i++) {
    var tmpNo = Math.floor((Math.random() * 10) + 1);
    $("#l1-"+i).val(tmpNo);
  };
  
  // calculate if it's the correct answer
  $("input").on("blur", function(){
    //
    var curId = $(this).attr('id');
    var curVal = $(this).val();
    console.log("Got a change! on id: " + curId + " val:" + curVal);
    
  });

});