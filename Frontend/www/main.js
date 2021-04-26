/* global require */
let autocomplete;

let map, infoWindow;

var globalDate;
var globalData;
var globalI;
var modI;
var today = new Date();



var sources = ["d"];

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'uk',
        includedLanguages: 'uk,en,fr,it,de'
    }, 'google_translate_element');
}

$.getJSON('http://history.muffinlabs.com/date/' + (today.getMonth() + 1) + '/' + (today.getDate()), function (data) {
    var what_happened = data;
    var month = parseInt(today.getMonth() + 1)
    if (month < 10) {
        month = "0" + month;
    }
    $('#what').text($('#what').text() + ' ' + today.getDate() + '/' + month + ' в ' + what_happened['data']['Events'][what_happened['data']['Events'].length - 1]['year'] + ' році')
    $('#event').text(what_happened['data']['Events'][what_happened['data']['Events'].length - 1]['links'][0]['title'])
    a = document.getElementById('event')
    a.href = String(what_happened['data']['Events'][what_happened['data']['Events'].length - 1]['links'][0]['link'])
    console.log(what_happened);
});


let jsonWea;

function getNfillForecast(lat, lng) {

    $(".main-content").removeClass("d-none");
    var curentDate = new Date();
    console.log(new Date());
    console.log(curentDate.getHours());
    globalI = defineIter(curentDate.getHours());
    console.log(globalI);




    $.getJSON('http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lng + '&cnt=' + globalI + '&units=metric&lang=ua&appid=f1c4ea79129faeebfbac6455394d7b12', function (data) {

        modI = globalI % 8;
        if (globalI == 40)
            modI = 8;


        globalData = data;
        console.log(data);

        var k = 0;
        if (curentDate.getHours() >= 21)
            k = 1;

        $.getJSON('http://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lng + '&exclude=minutely,hourly,current&units=metric&lang=ua&appid=f1c4ea79129faeebfbac6455394d7b12', function (dataD) {
            for (var i = 0; i < 5; i++) {
                var date = new Date((dataD["daily"][i + k]["dt"]) * 1000);

                const tempSplit = date.toString().split(" ", 4);
                var dayOfWeek = tempSplit[0];
                var numberOfDate = tempSplit[2];
                var Month = tempSplit[1];
                $("#day" + (i + 1)).find(".day").html(dayOfWeek);
                $("#day" + (i + 1)).find(".date").html(numberOfDate + " " + Month);
                $("#day" + (i + 1)).find(".location").html(data["city"]["name"]);
                $("#day" + (i + 1)).find(".num").html(Math.round(dataD["daily"][i + k]["temp"]["day"]) + "<sup>o</sup>C");
                $("#day" + (i + 1)).find(".condition").attr("src", 'http://openweathermap.org/img/wn/' + (dataD["daily"][i + k]["weather"]["0"]["icon"]) + '@2x.png');
                $("#day" + (i + 1)).find(".pop").html('<img src="images/icon-umberella.png" alt="">' + Math.round(100 * (dataD["daily"][i + k]["pop"])) + "%");
                $("#day" + (i + 1)).find(".wind").html('<img src="images/icon-wind.png" alt="">' + (dataD["daily"][i + k]["wind_speed"]) + "m/s");
                console.log(dayOfWeek + numberOfDate + Month);
                console.log("Date: " + date.toString());
            };


            jsonWea = {
                1: {
                    id: dataD["daily"][0 + k]["weather"]["0"]["id"],
                    temp: Math.round(dataD["daily"][0 + k]["temp"]["day"])
                },
                2: {
                    id: dataD["daily"][1 + k]["weather"]["0"]["id"],
                    temp: Math.round(dataD["daily"][1 + k]["temp"]["day"])
                },

                3: {
                    id: dataD["daily"][2 + k]["weather"]["0"]["id"],
                    temp: Math.round(dataD["daily"][2 + k]["temp"]["day"])
                },

                4: {
                    id: dataD["daily"][3 + k]["weather"]["0"]["id"],
                    temp: Math.round(dataD["daily"][3 + k]["temp"]["day"])
                },

                5: {
                    id: dataD["daily"][4 + k]["weather"]["0"]["id"],
                    temp: Math.round(dataD["daily"][4 + k]["temp"]["day"])
                }


            }
            console.log(jsonWea);

            $("#day1").trigger("click");
        });


        //    
        var x = document.querySelector(".forecast-table");
        var style = getComputedStyle(x).display;

        console.log(style);
        if (style == "none") {
            $(".forecast-table").slideToggle("slow", function () {
                // Animation complete.
            });
            $(".time-for").slideToggle("slow", function () {
                // Animation complete.
            });

        }



    });
    const scr = document.querySelector("#myWrap");

    function scrollToFor() {
        scr.scrollIntoView({
            block: "nearest",

            behavior: 'smooth'
        });


    }
    setTimeout(scrollToFor, 700);



};


$(".scrollTotime").click(function (event) {

    const s = document.querySelector(".time-for");
    setTimeout(s.scrollIntoView({
        block: "center",

        behavior: 'smooth'
    }), 900);
});

$(".forecast").click(function () {

    
backendPost("/send-html/",$("#day1").html(),function (response) {
            alert(response);
        });
    var ID = $(this).attr("id");
    var prev = $(".forecast-container").find(".today").attr("id");
    $("#" + prev).find(".scrollTotime").addClass("d-none");
    $("#" + prev).removeClass("today");
    $("#" + prev).find("span").addClass("invisible");
    $("#" + prev).find(".day").addClass("d-none");
    $("#" + prev).find(".location").addClass("invisible");
    $(this).find("span").removeClass("invisible");
    $(this).find(".day").removeClass("d-none");
    $(this).find(".scrollTotime").removeClass("d-none");
    $(this).find(".location").removeClass("invisible");
    $(this).addClass("today");
    const tempSplit = (ID).split("day", 2);
    var numberOfDay = tempSplit[1];
    console.log(jsonWea);
    const expr = jsonWea[numberOfDay];
    console.log(expr.id);

    //Rain
    if (expr.id >= 200 && expr.id < 540 && expr.temp < 5) {
        sources = [];
        sources.push("../images/Java2.2Photos/Rainy/0Rainy1.jpg")
        sources.push("../images/Java2.2Photos/Rainy/0Rainy2.jpg")
        $("#videoC").html('<iframe class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')

    };
    if (expr.id >= 200 && expr.id < 540 && expr.temp >= 5 && expr.temp < 15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Rainy/10Rainy1.jpg")
        sources.push("../images/Java2.2Photos/Rainy/10Rainy2.jpg")
        sources.push("../images/Java2.2Photos/Rainy/10Rainy3.jpg")
        $("#videoC").html('<iframe class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id >= 200 && expr.id < 540 && expr.temp >= 15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Rainy/20Rainy1.jpg")
        sources.push("../images/Java2.2Photos/Rainy/20Rainy2.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    //Snow
    if (expr.id >= 600 && expr.id < 640 && expr.temp < -15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Snowy/-20Snowy1.jpg")
        sources.push("../images/Java2.2Photos/Snowy/-20Snowy2.jpg")
        sources.push("../images/Java2.2Photos/Snowy/-20Snowy3.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id >= 600 && expr.id < 640 && expr.temp >= -15 && expr.temp < -5) {
        sources = [];
        sources.push("../images/Java2.2Photos/Snowy/-10Snowy1.jpg")
        sources.push("../images/Java2.2Photos/Snowy/-10Snowy2.jpg")
        sources.push("../images/Java2.2Photos/Snowy/-10Snowy3.jpg")
        sources.push("../images/Java2.2Photos/Snowy/-10Snowy4.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id >= 600 && expr.id < 640 && expr.temp >= -5) {
        sources = [];
        sources.push("../images/Java2.2Photos/Snowy/0Snowy1.jpg")
        sources.push("../images/Java2.2Photos/Snowy/0Snowy2.jpg")
        sources.push("../images/Java2.2Photos/Snowy/0Snowy3.jpg")
        sources.push("../images/Java2.2Photos/Snowy/0Snowy4.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    //Clear
    if (expr.id == 800 && expr.temp < -15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Sunny/-20Sunny1.jpg")
        sources.push("../images/Java2.2Photos/Sunny/-20Sunny2.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id == 800 && expr.temp >= -15 && expr.temp < -5) {
        sources = [];
        sources.push("../images/Java2.2Photos/Sunny/-10Sunny1.jpg")
        sources.push("../images/Java2.2Photos/Sunny/-10Sunny2.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id == 800 && expr.temp >= -5 && expr.temp < 5) {
        sources = [];
        sources.push("../images/Java2.2Photos/Sunny/0Sunny1.jpg")
        sources.push("../images/Java2.2Photos/Sunny/0Sunny2.jpg")
        sources.push("../images/Java2.2Photos/Sunny/0Sunny3.jpg")
        sources.push("../images/Java2.2Photos/Sunny/0Sunny4.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id == 800 && expr.temp >= 5 && expr.temp < 15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Sunny/10Sunny1.jpg")
        sources.push("../images/Java2.2Photos/Sunny/10Sunny2.jpg")
        sources.push("../images/Java2.2Photos/Sunny/10Sunny3.jpg")
        sources.push("../images/Java2.2Photos/Sunny/10Sunny4.jpg")
        sources.push("../images/Java2.2Photos/Sunny/10Sunny5.jpg")
        $("#videoC").html('   <iframe   class="video" src="https://www.youtube.com/embed/qCi_VJb3KLk" allowfullscreen></iframe>')
    };
    if (expr.id == 800 && expr.temp >= 15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Sunny/20Sunny1.jpg")
        sources.push("../images/Java2.2Photos/Sunny/20Sunny2.jpg")
        sources.push("../images/Java2.2Photos/Sunny/20Sunny3.jpg")
        $("#videoC").html('   <iframe  class="video" src="https://www.youtube.com/embed/qCi_VJb3KLk" allowfullscreen></iframe>')
    };
    //Cloudy
    if (expr.id > 800 && expr.temp < -15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Cloudy/-20Cloudy1.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')

    };
    if (expr.id > 800 && expr.temp >= -15 && expr.temp < -5) {
        sources = [];
        sources.push("../images/Java2.2Photos/Cloudy/-10Cloudy1.jpg")
        sources.push("../images/Java2.2Photos/Cloudy/-10Cloudy2.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id > 800 && expr.temp >= -5 && expr.temp < 5) {
        sources = [];
        sources.push("../images/Java2.2Photos/Cloudy/0Cloudy1.jpg")
        sources.push("../images/Java2.2Photos/Cloudy/0Cloudy2.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id > 800 && expr.temp >= 5 && expr.temp < 15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Cloudy/10Cloudy1.jpg")
        sources.push("../images/Java2.2Photos/Cloudy/10Cloudy2.jpg")
        sources.push("../images/Java2.2Photos/Cloudy/10Cloudy3.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };
    if (expr.id > 800 && expr.temp >= 15) {
        sources = [];
        sources.push("../images/Java2.2Photos/Cloudy/20Cloudy1.jpg")
        sources.push("../images/Java2.2Photos/Cloudy/20Cloudy2.jpg")
        sources.push("../images/Java2.2Photos/Cloudy/20Cloudy3.jpg")
        $("#videoC").html('<iframe  class="video" src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1" allowfullscreen></iframe>')
    };

    console.log(sources);
    var itemHtmlStrings = [];
    var indicatorsHtmlStrings = []
    for (var i = 0; i < sources.length; i++) {
        var itemHtmlString = '' +
            '<div class="carousel-item">' +
            `<img class="d-block w-100" ` +
            ` src="${sources[i]}" alt="Slide ${i}">` +
            `<div class="carousel-caption">` +
            '</div>' +
            '</div>'
        itemHtmlStrings.push(itemHtmlString);
        var itemIndicator = '<li data-target="#myCarousel" data-slide-to="' + i + '"></li>';
        indicatorsHtmlStrings.push(itemIndicator);
    }
    var myCarouselEl = document.getElementById("myCarousel");
    var carouselInnerEl = myCarouselEl.getElementsByClassName("carousel-inner")[0];
    var carouselIndicator = myCarouselEl.getElementsByClassName("carousel-indicators")[0];
    carouselInnerEl.innerHTML = itemHtmlStrings.join("\n");
    carouselIndicator.innerHTML = indicatorsHtmlStrings.join("\n");
    carouselInnerEl.firstElementChild.className += " active";
    carouselIndicator.firstElementChild.className = " active";
    $(myCarouselEl).carousel({
        slide: true,
        ride: true
    });


    modI = globalI % 8;
    if (globalI == 40)
        modI = 8;

    globalI = defineIter(new Date().getHours());
    if (numberOfDay == 1)
        for (var i = 0; i < modI; i++) {
            $("#time" + (8 - modI + i) * 3).find(".temp").html("<img  src='images/icons/temp.svg' width=25>" + Math.round(globalData["list"][i]["main"]["temp"]) + "<sup>o</sup>C");
            $("#time" + (8 - modI + i) * 3).find(".pop").html("<img  src='images/icon-umberella.png' width=25>" + +Math.round(100 * (globalData["list"][i]["pop"])) + "%");
            $("#time" + (8 - modI + i) * 3).find(".wind").html('<img src="images/icon-wind.png" alt="">' + (globalData["list"][i]["wind"]["speed"]) + "m/s");
            $("#time" + (8 - modI + i) * 3).find(".description").html((globalData["list"][i]["weather"]["0"]["description"]));
            $("#time" + (8 - modI + i) * 3).find(".condition").attr("src", 'http://openweathermap.org/img/wn/' + (globalData["list"][i]["weather"]["0"]["icon"]) + '@2x.png');
            console.log("This: " + i)

        }
    else {
        $("#time0, #time3, #time6, #time9, #time12, #time15, #time18, #time21").removeClass('d-none');

        for (var i = modI + 8 * (numberOfDay - 2); i < modI + 8 * (numberOfDay - 1); i++) {
            $("#time" + (i - modI - 8 * (numberOfDay - 2)) * 3).find(".temp").html("<img  src='images/icons/temp.svg' width=25>" + Math.round(globalData["list"][i]["main"]["temp"]) + "<sup>o</sup>C");
            $("#time" + (i - modI - 8 * (numberOfDay - 2)) * 3).find(".pop").html("<img  src='images/icon-umberella.png' width=25>" + +Math.round(100 * (globalData["list"][i]["pop"])) + "%");
            $("#time" + (i - modI - 8 * (numberOfDay - 2)) * 3).find(".wind").html('<img src="images/icon-wind.png" alt="">' + (globalData["list"][i]["wind"]["speed"]) + "m/s");
            $("#time" + (i - modI - 8 * (numberOfDay - 2)) * 3).find(".description").html((globalData["list"][i]["weather"]["0"]["description"]));
            $("#time" + (i - modI - 8 * (numberOfDay - 2)) * 3).find(".condition").attr("src", 'http://openweathermap.org/img/wn/' + (globalData["list"][i]["weather"]["0"]["icon"]) + '@2x.png');
            console.log("This: " + i)

        }

    }
});
document.getElementById("time0").classList.remove('d-none');
document.getElementById("time3").classList.remove('d-none');
document.getElementById("time6").classList.remove('d-none');
document.getElementById("time9").classList.remove('d-none');
document.getElementById("time12").classList.remove('d-none');
document.getElementById("time15").classList.remove('d-none');
document.getElementById("time18").classList.remove('d-none');

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
            lat: 49.06709037683751,
            lng: 32.21415861549619
        },
        zoom: 6,
    });

    var startPoint = new google.maps.LatLng(50.464379, 30.519131);
    var homeMarker = new google.maps.Marker({
        position: startPoint,
        map: map,
    });
    infoWindow = new google.maps.InfoWindow();

    $("#geoloc").click(function () {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    var ad = document.getElementById('inputAddress');
                    geocodeLatLng(pos, function (err, adress) {
                        if (!err) {
                            ad.value = adress;
                        };
                    });
                    map.setZoom(14);
                    homeMarker.setPosition(pos);
                    homeMarker.setVisible(true);
                    getNfillForecast(pos.lat, pos.lng);

                    infoWindow.open(map);
                    map.setCenter(pos);

                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });



    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('inputAddress'), {
            types: ["geocode"],

        }
    );
    places = new google.maps.places.PlacesService(map);
    autocomplete.addListener("place_changed", onPlaceChanged);

    document.getElementById("inputAddress").addEventListener("change", onPlaceChanged);


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







var API_URL = "http://localhost:5050";

function backendPost(url, data, callback) {
    $.ajax({
        type: 'Post',
        url: API_URL + url,
        data: data,
        contentType: "text/plain",
        success: function (response) {
            alert(response);
        },
        error: function () {
            callback(new Error("Ajax Failed"));
        }

    })
}



$("#sbm").click(function () {
    console.log($("#inputEmail").val());
    event.preventDefault();
    $.ajax({
        url: "/insert/",
        data: $("#inputEmail").val(),
        method: "post",
        // error: function(x, y, z){},
        success: function (response) {
            alert(response);
        },

    })
});
