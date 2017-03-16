window.onload = function() {
  
  // single JSON call

  // $.getJSON("objects-array.json", function(data) {
  //   console.log(data.length);

  //   data.forEach(function(el) {
  //     console.log(el);
  //   });

  //   // run main function
  //   main(data);

  // }).fail(function(data, textStatus, error) {
  //   console.error("getJSON failed, status: " + textStatus + ", error: " + error);
  // });



  var objects,
      locations;

  $.when(
      $.getJSON("objects-array.json", function(data) {
          objects = data;
      }),
      $.getJSON("locations.json", function(data) {
          locations = data;
      })
  ).then(function() {
    // run main function
    main();
  });





  function main() {
    // define main layer
    var points = new L.LayerGroup();

    // define point defaults
    var pointWeight = 1,
        pointFillOpacity = 0.5,
        pointRadius = 100000,
        lineWeight = 1;

    var mainColor = 'red';



    // define and init map
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWxva2hvdiIsImEiOiJjajBhN2VyaTkwMDNxMndsazNhbnZxN2pjIn0.0WeQwRSqxMqNjIUSSFOy5Q';
    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';

    var grayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});

    var map = L.map('map', {
      center: [30.505, -20.09],
      zoom: 3,
      layers: [grayscale, points],
    });



    // set starting year
    $year = $('#year');
    var minYear = 1900,
        currentYear = minYear,
        maxYear = 2017;



    // init slider
    var slider = $('#slider').slider({
      value: currentYear,
      min: minYear,
      max: maxYear,
      step: 1,
      slide: function(event, ui) {
        sliderStep(ui.value);
      }
    });



    // main slider function
    function sliderStep(year) {
      // clear all map data from previous step
      points.clearLayers();

      // set year text
      $year.html(year);

      // loop through all objects
      objects.forEach(function(el) {
        
        // console.log(el);

        var locPrevious = null;

        for (var i = 0; i < el.locations.length; i++) {
          locName = el.locations[i].name;
          locStartYear = el.locations[i].start;
          locEndYear = el.locations[i].end;

          if (locStartYear > year) {
            console.log(year + " - > does not exist yet");
            break;
          }
          else if (locStartYear === year) {
            console.log(year + " - > transfer to: " + locName);

            L.circle([locations[locName].lat, locations[locName].lng], {
                color: mainColor,
                fillColor: mainColor,
                fillOpacity: pointFillOpacity,
                radius: pointRadius,
                weight: pointWeight,
            }).addTo(points);



            // check if previous location exists, add point and curve if this is the case
            if (locPrevious) {
              console.log("previous location was: " + locPrevious);

              L.circle([locations[locPrevious].lat, locations[locPrevious].lng], {
                  color: mainColor,
                  fillColor: mainColor,
                  fillOpacity: pointFillOpacity,
                  radius: pointRadius,
                  weight: pointWeight,
              }).addTo(points);

              var aLat = locations[locPrevious].lat;
              var aLng = locations[locPrevious].lng;
              var bLat = locations[locName].lat;
              var bLng = locations[locName].lng;
              var pathOne = L.curve([
                            'M',[aLat, aLng],
                            'Q',[aLat + 20, (aLng + bLng) / 2],
                                [bLat, bLng]], {
                                  dashArray: 10,
                                  animate: {duration: 5000, iterations: Infinity},
                                  color: mainColor,
                                  weight: lineWeight,
                                }).addTo(points);



            }
            break;
          }
          else if (locStartYear < year && locEndYear >= year) {
            console.log(year + " - > stays in " + locName);
            console.log(locations[locName].lat);
            console.log(locations[locName].lng);

            L.circle([locations[locName].lat, locations[locName].lng], {
                color: mainColor,
                fillColor: mainColor,
                fillOpacity: pointFillOpacity,
                radius: pointRadius,
                weight: pointWeight,
            }).addTo(points);



            break;
          }

          // save previous location (for transfer)
          locPrevious = locName;

        }



      });





    }



    // init slider
    sliderStep(currentYear);















    

    // playback
    var refreshIntervalId,
        playerSpeed = 500;

    $('#play').click(function(event) {

      // if not playing
      if (!$(this).hasClass('active')) {
        $(this).addClass('active');

        // start playback
        refreshIntervalId = setInterval(function() {
          currentYear++;
          if (currentYear === maxYear) {
            currentYear = minYear;
          }

          // run main slider function
          sliderStep(currentYear);
          
          // update slider
          slider.slider('value', currentYear);
        }, playerSpeed);
      }
      // if playing
      else {
        $(this).removeClass('active');

        // stop playback
        clearInterval(refreshIntervalId);
      }
    });








    // END MAIN
  }






};


