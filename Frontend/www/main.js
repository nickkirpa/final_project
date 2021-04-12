let autocomplete;


let map;
var globalDate;
var globalI;

function getNfillForecast(lat, lng) {
    var curentDate = new Date();
    console.log(new Date());
    console.log(curentDate.getHours());
    var globalI = defineIter(curentDate.getHours());
    console.log(globalI);




    $.getJSON('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lng + '&cnt=' + globalI + '&lang=ua&units=metric&appid=f1c4ea79129faeebfbac6455394d7b12', function (data) {


        var date = new Date((data["list"]["3"]["dt"]) * 1000);
        globalDate = date;
        var jsonDate = (date.toJSON());
        var input = new Date(jsonDate).toString();
        const tempSplit = input.split(" ", 4);
        var dayOfWeek = tempSplit[0];
        var numberOfDate = tempSplit[2];
        var Month = tempSplit[1];
        $( "div#day1" ).find(".day").html(dayOfWeek);
        $( "div#day1" ).find(".date").html(numberOfDate + " " + Month);
        console.log(dayOfWeek + numberOfDate + Month);
      //  document.getElementById("day1").classList.remove('today');
       // document.getElementById("day3").classList.add('today');
        var modI = globalI % 8;
        for(var i = 0; i < modI;i++){
            $("#time"+(8-modI+i)*3).find(".degree").html("<img  src='images/icons/temp.svg' width=25>"+Math.round(data["list"][i]["main"]["temp"])+"<sup>o</sup>C");
            $("#time"+(8-modI+i)*3).find(".description").html((data["list"][i]["weather"]["0"]["description"]));
            $("#time"+(8-modI+i)*3).find(".condition").attr("src", 'http://openweathermap.org/img/wn/'+(data["list"][i]["weather"]["0"]["icon"])+'@2x.png');
            console.log("This: "+i)
            console.log("This: "+$("#time"+(8-modI+i)*3).find(".condition").src);
        }
       
    });

}

function defineIter(hours) {
    if (hours < 3) {
        document.getElementById("time0").classList.add('d-none');
        return 39;
    }
    if (hours < 6 && hours >= 3) {
        document.getElementById("time0").classList.add('d-none');
        document.getElementById("time3").classList.add('d-none');
        return 38;
    }
    if (hours < 9 && hours >= 6) {
        document.getElementById("time0").classList.add('d-none');
        document.getElementById("time3").classList.add('d-none');
        document.getElementById("time6").classList.add('d-none');
        return 37;
    }
    if (hours < 12 && hours >= 9) {
        document.getElementById("time0").classList.add('d-none');
        document.getElementById("time3").classList.add('d-none');
        document.getElementById("time6").classList.add('d-none');
        document.getElementById("time9").classList.add('d-none');
        return 36;
    }
    if (hours < 15 && hours >= 12) {
        document.getElementById("time0").classList.add('d-none');
        document.getElementById("time3").classList.add('d-none');
        document.getElementById("time6").classList.add('d-none');
        document.getElementById("time9").classList.add('d-none');
        document.getElementById("time12").classList.add('d-none');
        return 35;
    }
    if (hours < 18 && hours >= 15) {
        document.getElementById("time0").classList.add('d-none');
        document.getElementById("time3").classList.add('d-none');
        document.getElementById("time6").classList.add('d-none');
        document.getElementById("time9").classList.add('d-none');
        document.getElementById("time12").classList.add('d-none');
        document.getElementById("time15").classList.add('d-none');
        return 34;
    }
    if (hours < 21 && hours >= 18) {
        document.getElementById("time0").classList.add('d-none');
        document.getElementById("time3").classList.add('d-none');
        document.getElementById("time6").classList.add('d-none');
        document.getElementById("time9").classList.add('d-none');
        document.getElementById("time12").classList.add('d-none');
        document.getElementById("time15").classList.add('d-none');
        document.getElementById("time18").classList.add('d-none');
        return 33;
    }
    if (hours <= 24) {
        return 40;
    }

}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 50.464379,
            lng: 30.519131
        },
        zoom: 15,
    });
    var startPoint = new google.maps.LatLng(50.464379, 30.519131);



    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('inputAddress'), {
            types: ["geocode"],

        }
    );
    places = new google.maps.places.PlacesService(map);
    autocomplete.addListener("place_changed", onPlaceChanged);

    document.getElementById("inputAddress").addEventListener("change", onPlaceChanged);

    var homeMarker = new google.maps.Marker({
        position: startPoint,
        map: map,
    });
    homeMarker.setVisible(false);

    function onPlaceChanged() {
        const place = autocomplete.getPlace();
        homeMarker.setPosition(place.geometry.location);
        homeMarker.setVisible(true);
        console.log(place);
        if (place.geometry && place.geometry.location) {
            map.panTo(place.geometry.location);
            map.setZoom(15);
            directionsDisplay.setMap(map);

            const latlngStr = JSON.parse(JSON.stringify(place.geometry.location));

            const lat = latlngStr.lat;
            const lng = latlngStr.lng;


            console.log(JSON.stringify(place.geometry.location));
            console.log(lat);
            console.log(lng);

            getNfillForecast(lat, lng);

        } else {}

    }


    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    google.maps.event.addListener(map, 'click', function (me) {

        var coordinates = me.latLng;
        var ad = document.getElementById('inputAddress');
        geocodeLatLng(coordinates, function (err, adress) {
            if (!err) {
                var point = coordinates;
                homeMarker.setPosition(point);
                homeMarker.setVisible(true);
                ad.value = adress;
                console.log(adress);

                directionsDisplay.setMap(map);

                const latlngStr = JSON.parse(JSON.stringify(coordinates));

                const lat = latlngStr.lat;
                const lng = latlngStr.lng;


                console.log(JSON.stringify(coordinates));
                console.log(lat);
                console.log(lng);

                getNfillForecast(lat, lng);

            } else {
                console.log("Немаєадреси")
            }
        })



        function geocodeAddress(adress, callback) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    var coordinates = results[0].geometry.location;
                    callback(null, coordinates);
                } else {
                    callback(new Error("Can not find the adress"));
                }
            });
        }
    });

    function geocodeLatLng(latlng, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'location': latlng
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[1]) {
                var adress = results[1].formatted_address;
                callback(null, adress);
            } else {
                callback(new Error("Can't find adress"));
            }
        });
    }
}
