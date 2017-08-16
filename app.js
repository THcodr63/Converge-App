// Initialize Firebase
var config = {
    apiKey: "AIzaSyDem9IqFJ9hdfn-emu8TYh4iG1omGp3I5U",
    authDomain: "api-project-1-2017-f38c9.firebaseapp.com",
    databaseURL: "https://api-project-1-2017-f38c9.firebaseio.com",
    projectId: "api-project-1-2017-f38c9",
    storageBucket: "api-project-1-2017-f38c9.appspot.com",
    messagingSenderId: "328638634640"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-event-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var eventName = $("#event-name-input").val().trim();
    var eventLocation = $("#location-input").val().trim();
    var eventDate = moment($("#event-date-input").val().trim(), "MM/DD/YY").format("X");

    // // Here we are building the URL we need to query the database
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + eventLocation +
        "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
    console.log(queryURL);

    if (eventLocation != '') {

        $.ajax({
            url: queryURL,
            type: "GET",
            success: function(data) {
                var widget = show(data);

                $("#show").html(widget);

                $("#city").val('');


            }
        });
    } else {
        $("#error").html('Field cannot be empty');
    }


    // Creates local "temporary" object for holding employee data
    var newEvent = {
        name: eventName,
        role: eventLocation,
        start: eventDate,

    };

    // Uploads employee data to the database
    database.ref().push({
        name: eventName,
        role: eventLocation,
        start: eventDate,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Logs everything to console
    console.log(newEvent.name);
    console.log(newEvent.role);
    console.log(newEvent.start);


    // Alert
    // alert("Run successfully added");

    // Clears all of the text-boxes
    $("#event-name-input").val("");
    $("#location-input").val("");
    $("#event-date-input").val("");

});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var eventName = childSnapshot.val().name;
    var eventLocation = childSnapshot.val().role;
    var eventDate = childSnapshot.val().start;


    // Employee Info
    console.log(eventName);
    console.log(eventLocation);
    console.log(eventDate);


    
    // Number of days until the event countdown
    var countdown = moment.unix(eventDate, "X").diff(moment(), "days");
    console.log(countdown);



    // Add each train's data into the table
    $("#event-table > tbody").append("<tr><td>" + eventName + "</td><td>" + eventLocation + "</td><td>" +
        countdown + "</td>");
});



    function show(data) {
        return "<p>" + data.name + ", " + data.sys.country + "</p>" +
            "<p>Weather: " + data.weather[0].main + " </p>" +
            "<p id='icon'> <img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png' " + data.weather[0].description + " </p>" +
            "<p>Temperature: " + data.main.temp + " &deg;F</p>" +
            "<p>Max: " + data.main.temp_max + " &deg;F</p>" +
            "<p>Min: " + data.main.temp_min + " &deg;F</p>" +
            "<p>Humidity: " + data.main.humidity + " %</p>";
    }

