(function() {

    /* The code below initializes the map with the given coordinates and zoom. It also creates an infowindow
       This code was taken from "https://developers.google.com/maps/documentation/javascript/examples/map-simple" */
    function initialize(){
        //Error Handling if the Google Maps API cannot be reached
        if (typeof google !== 'object' || typeof google.maps !== 'object'){
            alert("Error Loading Google Maps API. Please check your connection and try again.");
            console.log("Unable to connect to Google Maps API");
        }
        var mapOptions = {
            center: { lat: 40.8853, lng: -72.3953},
            zoom: 9
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
        infowindow = new google.maps.InfoWindow({
            maxWidth :150
        });

    };

    /* Creating an array containing data about the malls that we use in our application */  
    var initialMalls = [
    {
        name:'Broadway Mall',
        lat:40.773053,
        lng:-73.529470,
        address:'358 N Broadway Mall, Hicksville, NY 11801'
    },
    {
        name:'Walt Whitman Mall',
        lat:40.822924,
        lng:-73.410689,
        address:'160 Walt Whitman Road, Huntington Station, NY 11746'
    },
    {
        name:'Roosevelt Field Mall',
        lat:40.739971,
        lng:-73.613576,
        address:'630 Old Country Road, Garden City, NY 11530'
    },
    {
        name:'Westfield Sunrise Mall',
        lat:40.682646,
        lng:-73.434651,
        address:'1 Sunrise Mall, Massapequa, NY 11758'
    },
    {
        name:'Tanger Outlets Riverhead',
        lat:40.916964,
        lng:-72.710780,
        address:'200 Tanger Mall Drive, Riverhead, NY 11901'
    },
    {
        name:'Bellport Outlet Stores',
        lat:40.757043,
        lng:-72.939273,
        address:'Bellport, NY 11713'
    },
    {
        name:'Westfield South Shore',
        lat:40.740101,
        lng:-73.246484,
        address:'1701 West Sunrise Highway, Bay Shore, NY 11706'
    },
    {
        name: 'Smith Haven Mall',
        lat:40.863093,
        lng:-73.128888,
        address:'313 Smith Haven Mall, Lake Grove, NY 11755-1201'
    },
    {
        name:'The Mall at the Source',
        lat:40.745589,
        lng:-73.594880,
        address:'1504 Old Country Road, Westbury, NY 11590'
    },
    {
        name:'Tanger Outlets Deer Park',
        lat:40.765081,
        lng:-73.303682,
        address: '152 The Arches Circle, Deer Park, NY 11729'
    }
    ]; 

    /* Below is our our mall constructor function. We pass an object literal called data into it.
       Each mall object created, will have name,address,latitude,longitude and marker as its properties.  */
    var mall = function(data){
        this.name = ko.observable(data.name);
        this.address = ko.observable(data.address);
        this.lat = ko.observable(data.lat);
        this.lng = ko.observable(data.lng);
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat, data.lng),
            title: data.name
        }); 
    };


    var ViewModel = function(){
        initialize();
        var self = this;
        this.mallList = ko.observableArray();

        /* Looping through the initialMalls array, creating a mall object, passing the mall object to 
        getInfo and markerClick functions and pushing each mall object into mallList which is an observable array */
        initialMalls.forEach(function(mallItem){
            var myMall = new mall(mallItem);
            getInfo(myMall);
            markerClick(myMall);
            self.mallList.push(myMall);
        });

        this.currentMall = ko.observable(this.mallList()[0]); //Refers to the 0th element in mallList
        self.query = ko.observable('');

        /* getInfo makes AJAX requests to Wikipedia and gets the Wikipedia information. We are passing mall {mall object} as parameter here */
        function getInfo(mall){
            /* By default we set the contentString to the error message. Upon success it is immediately overridden 
               Upon failure this contentString will be displayed initially for the first 8000 ms after which it will be overridden by the message
               within in AJAX's error handler */
            mall.contentString = '<div>' + '</div>' + '<h3>' + mall.name() + '</h3>' +'<div >' + '<p>'+ "Sorry, the information could not be accessed." + '</p>' + '</div>'; 
            var wikiUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srsearch=@@querystr@@';
            $.ajax({
                crossOrigin: true,
                url: wikiUrl.replace('@@querystr@@', mall.name()),
                dataType: 'jsonp',
                timeout:8000
                /* This is Ajax's error handler function. It will work if the API cannot be accessed in 8000 ms. 
                   Without timeout the function fails silently and is not able to catch a 404 error from the cross domain server.
                   Hence we use timeout */
            }).error(function () {
                mall.wikiInfo = 'Sorry, the information could not be accessed.';
                mall.Url = ' ';
                mall.setContentString();            
            }).success(function(content) {
                if(content.query.search.length > 0) {
                    var title = content.query.search[0].title;
                    var snippet = content.query.search[0].snippet;
                    mall.wikiInfo = '<b>' + title + '</b>, ' + snippet + '';
                    mall.Url = '<a href="http://en.wikipedia.org/w/index.php?title=' + title + '"target="_blank"> More Information </a>';
                }
                else {
                    mall.wikiInfo = 'Sorry, the information you are looking for could not be found on wikipedia.';
                    mall.Url = ' ';
                }
                mall.setContentString();
            });
            /* Setting content of the content string with information retrieved from Wikipedia */
            mall.setContentString = function () {
                mall.contentString = '<div>' + '</div>' + '<h3>' + mall.name() + '</h3>' +'<div >' + '<p>' + mall.wikiInfo + '</p>' +'<p >' + mall.Url + '</p>' + '</div>';
            };
        };

        /* Whenever a particular marker is clicked this function causes its infowindow to pop and also changes its style. It takes mall {mall object} as its parameter */
        function markerClick(mall){
            google.maps.event.addListener(mall.marker, 'click', function() {
                infowindow.setContent(mall.contentString);
                infowindow.open(map, mall.marker);
                mall.marker.setIcon('images/green-dot.png');
            });
        };

        /* Adding markers on the map for all the malls in the mallList array*/
        self.addPins = function () {
            for(var i = 0 ;i < self.mallList().length; i++) {
                self.mallList()[i].marker.setMap(map);
            }                 
        };

        self.addPins(); 

        /* Removing markers from the map for all the malls in the mallList array*/
        self.removePins = function () {
            for(var i = 0 ;i < self.mallList().length; i++) {
                self.mallList()[i].marker.setMap(null);
            }
        };
    
        /* addPin takes mall {mall object} as a parameter and adds a marker to the corresponding object when called. 
           It has a nested function bind, which opens an infowindow and sets its content.
           The event Listener listens for clicks on marker  */
        self.addPin = function (mall) {
            mall.marker.setMap(map);
            mall.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ 
                mall.marker.setAnimation(google.maps.Animation.NONE); 
                mall.marker.setIcon('images/blue-dot.png')
            },2000); 

            self.bind = function () {
                return function () {
                    for(var i = 0; i < self.mallList().length; i ++){
                        infowindow.setContent(mall.contentString);
                        infowindow.open(map, mall.marker);
                    }
                };
            };
            google.maps.event.addListener(mall.marker, 'click', self.bind(mall.marker));   
        };

        /*  Here we use ko.utils.arrayFilter for filtering. We are passing in an array and controlling which items are included based on the 
            result of the function executed on each item. The function uses indexOf() method. If the value of the expression within the condition is greater than -1
            we have a match.*/
        self.search = ko.computed(function () {
            if (!self.query()) {
                return self.mallList();
            } 
            else {
                self.removePins();
                return ko.utils.arrayFilter(self.mallList(), function (item) {
                    if(item.name().toLowerCase().indexOf(self.query().toLowerCase()) > -1) {
                        self.addPin(item);
                        infowindow.setContent(item.contentString);
                        infowindow.open(map, item.marker);
                        return item.name;
                    }
                });
            }
        });

        // Handles list item click. It first removes all the markers and then adds a marker on the map for the location that is clicked on the list.
        self.listClick = (function(item) {
            self.removePins();
            self.addPin(item);
            infowindow.setContent(item.contentString);
            infowindow.open(map, item.marker);
        });
    };

    ko.applyBindings(new ViewModel());

})();





   



  




