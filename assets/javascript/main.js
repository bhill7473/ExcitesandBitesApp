$(document).ready(function(){
            // Initialize Firebase
            var config = {
                apiKey: "AIzaSyA-evKnalDifqr7DIZscPVn7oaO3OcTH58",
                authDomain: "excites-and-bites-application.firebaseapp.com",
                databaseURL: "https://excites-and-bites-application.firebaseio.com",
                projectId: "excites-and-bites-application",
                storageBucket: "excites-and-bites-application.firebaseapp.com",
                messagingSenderId: "607934732943"
              };
            firebase.initializeApp(config);
            var database = firebase.database();
            var email = "";
            var name = "";
        $("#submitC").on("click", function(event){
           event.preventDefault();
           email = $("#email").val().trim();
           name = $("#name").val().trim();
           var newUserEmail = {
               name:name,
               email:email
           }
           database.ref().push(newUserEmail);
           console.log(newUserEmail);

          $("#email").val("");
          $("#name").val("");


        });

           
    //random events loading on the page
    var randomCities = ["Cleveland", "Pittsburgh", "Chicago", "Detroit", "San Antonio", "Los Angeles"];
    var randomKeywords = ["comedy", "concerts", "food", "family", "sports"];
    var generateRandomCity = function() {
        return randomCities[Math.floor(Math.random() * randomCities.length)];
    };
    var randomCity = generateRandomCity();
    var generateRandomKeyword = function() {
        return randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    };
    var randomKeyword = generateRandomKeyword();
    eventSearch(randomCity, randomKeyword, "Next Week");
    $("#submitInfo").on("click", function(event) {
        event.preventDefault();
        var eventLocation = $("#eventLocation").val().trim();
        var eventKeywords = $("#categoriesDropDown :selected").text();
        var eventDate = $("#dateDropDown :selected").text();
        console.log(eventDate);
        eventSearch(eventLocation, eventKeywords, eventDate);
        var event = {
            location: eventLocation,
            keywords: eventKeywords,
            date: eventDate
        };
    });
    //for search querys
    function eventSearch(location, keywords, date) {
        $("#searchLocation").text(location);
        var searchQueryParams = {
            location: location,
            keywords: keywords,
            date: date,
            app_key: "3wKwrHtr35ZbcRWR"
        };
        //ajax call to eventful api
        EVDB.API.call("/events/search", searchQueryParams, function(data) {
            console.log(data.events);
            if (data.events === null) {
                var displayText = "No Results Found";
                var noResults = $("<h3>").text(displayText);
                $("#searchResultsRow").html(noResults);
            } else {
                updateSearchResults(data.events.event);
            }
        });
    }
    function updateSearchResults(events) {
        $("#searchResultsRow").empty();
        console.log(events);
        var loopCount = 8;
        if (events.length < loopCount) {
            loopCount = events.length;
        }
        for (index = 0; index < loopCount; index++) {
            (function(i) {
                var eventDiv = $("<div class='event col-lg-3 col-md-4 col-sm-6 portfolio-item'>");
                var eventDivNarrow = $("<div id='belowPhoto' class='well col-lg-11 col-md-11 col-sm-11 portolio-item'>");
                console.log(events[i].title, events[i].id);
                if (events[i].image != null) {
                    var imgUrl = events[i].image.medium.url;
                    var image = $("<img class='center-block'>").attr("src", imgUrl);
                    eventDivNarrow.append(image);
                } else {
                    eventDivNarrow.append('<img id="theImage" class="center-block" src="assets/image/nophotoavailable.png"/>');
                }
                if (events[i].title != null) {
                    var title = events[i].title;
                    var pHeader = $("<H2 class='title' title='"+ title +"''>").text(title);
                    eventDivNarrow.append(pHeader);
                }
                if (events[i].start_time != null) {
                    var startTime = events[i].start_time;
                    var formattedTime = moment(startTime).format('MMMM Do YYYY, h:mm a');
                    var pFive = $("<H4>").text(formattedTime);
                    eventDivNarrow.append(pFive);
                }
                if (events[i].venue_name != null) {
                    var venue = events[i].venue_name;
                    var pOne = $("<p>").text(venue);
                    eventDivNarrow.append(pOne);
                }
                if (events[i].venue_address != null) {
                    var address = events[i].venue_address;
                    var pTwo = $("<p>").text(address);
                    eventDivNarrow.append(pTwo);
                }
                if (events[i].city_name != null && events[i].region_name != null) {
                    var city = events[i].city_name;
                    var region = events[i].region_name;
                    var pThree = $("<p>").text(city + ", " + region);
                    eventDivNarrow.append(pThree);
                }
                var button = $("<button class='btn btn-default' type='button'></button>").text("More Details");
                $(button).on("click", function() {
                    window.location = "details.html?id=" + events[i].id;
                });
                eventDivNarrow.append(button);
                eventDiv.append(eventDivNarrow);
                $("#searchResultsRow").append(eventDiv);

            })(index);
            $('.title').tooltip();
        }
    }
});
