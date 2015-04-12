
$(document).foundation();

//
function newNumbers() {
  var curGameLevel = Number(localStorage.getItem("peramid-level"));
  if (curGameLevel > 0) {
    curGameLevel += 1;
    $("#glevel").text(" - " + curGameLevel);
    localStorage.setItem("peramid-level", curGameLevel ); 
    $( "#level" ).val( curGameLevel ); 
    $( "#slider-range-max" ).slider( {value: curGameLevel} ) ;
    $('#s-level').attr('level', curGameLevel);
    curGameLevel = curGameLevel * 6;
  }
  else {
    localStorage.setItem("peramid-level", "1");   
     $("#glevel").text(" - 1");   
    $( "#level" ).val( 1 );
    curGameLevel = 10;
  }
  for (var i = 1; i < 5; i++) {
    var tmpNo = Math.floor((Math.random() * curGameLevel) + 1);
    $("#l1-"+i).val(tmpNo);
  };

  console.log("== curGameLevel: "+ curGameLevel);
  startTime = new Date().getTime();
}

//
function cleanAll() {
 for (var i = 1; i < 4; i++) {
    var tmpNo = Math.floor((Math.random() * 10) + 1);
    $("#l2-"+i).val("");
    if (i < 3) {
      $("#l3-"+i).val("");
    }
  }
  $("#l4-1").val("");
  $("#check-game").hide();
}

function checkSolution() {
  var notEmptyFields = 0;
  $('input').each(function() {
    if ($(this).val() !== "" && 
        $(this).attr("good-answer") === "yes") {
      notEmptyFields++;
    }    
  });
  if (notEmptyFields > 9) {
    $(".tup").show();
    saveAchivment();
    setTimeout(function() { 
      $(".tup").hide();
      cleanAll();
      newNumbers();
    }, 1500);  
  } 
  else {
    // check again!
    $("#check-alert").show();
    setTimeout(function() { 
      $("#check-alert").hide();
    }, 3500);
  }
}

//
// Firebase stuff - Save basic info.
// TODO: Later, we will use OAuth and have users, stats etc'
//
function saveAchivment() {
  var myFirebaseRef = new Firebase("https://peramida.firebaseio.com/");
  var endTime = new Date().getTime();
  var cLevel = $( "#level" ).val();
  var cUser  = $("#username").val();
  if (cUser == null || cUser == undefined || cUser == "") {
    cUser = "unKnown";
  }
  myFirebaseRef.push({
    user: cUser,
    startTime: startTime,
    endTime: endTime,
    gameTime: (endTime - startTime)/1000,
    level: cLevel,
    screenSize: ( ""+screen.width + "," + screen.height )
  });
}


//
// start the party 
//
$( document ).ready(function() {
  // main vars
  startTime = new Date().getTime();
  var cUser = localStorage.getItem("peramid-user");
  if (cUser != null && cUser != undefined) {
    $("#username").val(cUser);
  }
  else {
    // Let's have a quick intro for new comers
    introJs().start();
  }

  // slides to pick levels
  $( "#slider-range-max" ).slider({
    range: "min",
    min: 1,
    max: 50,
    value: 1,
    slide: function( event, ui ) {
      var newLevel = ui.value;
      $( "#level" ).val( newLevel );
      if ( !isNaN(newLevel)) {
          localStorage.setItem("peramid-level", newLevel);  
          newNumbers();
          cleanAll();
        }
        else {
          console.warn("Got newLevel: "+ newLevel + " something is not good dude!");
        }
    }
  });
  $( "#level" ).val( $( "#slider-range-max" ).slider( "value" ) );

  // Start with random numbers at the bottom
  newNumbers();

  // lets have only numners as answers
  $("input").keydown(function (e) {
    var curId = $(this).attr('id');
    if (curId === "username") {
      return;
    }

    if (curId === "l4-1") {
      $("#check-game").show();
    }

    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
         // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) || 
         // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
             // let it happen, don't do anything
             return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
  });

  $("#check-game").click(function() {
    checkSolution();
  });

  // calculate if it's the correct answer
  $("input").on("blur", function(){
    //
    var curId = $(this).attr('id');
    if (curId === "username") {
      return;
    }

    var curVal = Number($(this).val());
    console.log("A new answer on id: " + curId + " val:" + curVal);
    var curLevel = Number(curId.substring(1,2));
    var curCell  = Number(curId.substring(3));  
    console.log("level: " + curLevel + " cell:" + curCell);

    var isCorrect = false;
    var cellLeftId  = "#l" + (curLevel-1) + "-" + curCell;
    var cellRightId = "#l" + (curLevel-1) + "-" + (1 + curCell );
    var cellLeft = Number($(cellLeftId).val());
    var cellRight = Number($(cellRightId).val());
    if (curVal === cellLeft + cellRight ) {
      //
      $("#malert").show();
      setTimeout(function() { 
        $("#malert").hide();
      }, 1500);

      $(this).css("background-color", "white");
      $(this).attr("good-answer", "yes");
      // Are we done with this peramid?
      if (curLevel === 4) {
        checkSolution();  
      }
    }
    else {
      $(this).css("background-color", "red");
      $(this).attr("good-answer", "no");
    }
  });

  $("#showhelp").click(function() {
    introJs().start();
  });

  $("#newgame").click(function() {
    $('#rusure').foundation('reveal', 'close');
    localStorage.setItem("peramid-level", 0);  
    newNumbers();
    cleanAll(); 
  });

  // save our user locally for the future
  $("#save-username").click(function() {
    localStorage.setItem("peramid-user", $("#username").val() );  
    $(".save-user-alert").show();
    setTimeout(function() { 
      $(".save-user-alert").hide();
    }, 1000);  
    
  });

});