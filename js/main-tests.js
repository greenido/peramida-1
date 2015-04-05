//Firebase stuff - to save the progress
  var myFirebaseRef = new Firebase("https://peramida.firebaseio.com/");
  function saveAchivment() {
    var endTime = new Date();
    myFirebaseRef.set({
      user: "kids",
      startTime: startTime,
      endTime: endTime,
      level: curGameLevel
    });
  }