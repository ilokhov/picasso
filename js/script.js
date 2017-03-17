window.onload = function() {
  
  // helper functions
  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }



  // load JSON
  var objects,
      locations;

  $.when(
      $.getJSON("objects.json", function(data) {
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
    // define layer where shapes will be drawn
    var shapes = new L.LayerGroup();

    // define circle defaults
    var circleWeight = 1,
        circleFillOpacity = 0.5,
        baseCircleRadius = 100000,
        lineWeight = 1;

    var mainColor = '#d62839';



    // define and init map
    var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWxva2hvdiIsImEiOiJjajBhN2VyaTkwMDNxMndsazNhbnZxN2pjIn0.0WeQwRSqxMqNjIUSSFOy5Q';
    var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>';

    // var lightMapStyle = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});
    var lightMapStyle = L.tileLayer('https://api.mapbox.com/styles/v1/ilokhov/cj0d2qc8400cm2sqho22nskuw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxva2hvdiIsImEiOiJjajBhN2VyaTkwMDNxMndsazNhbnZxN2pjIn0.0WeQwRSqxMqNjIUSSFOy5Q', {attribution: mbAttr});
    


    var map = L.map('map', {
      center: [45.505, -30.09],
      zoom: 3,
      layers: [lightMapStyle, shapes],
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
        // update global definiton of current year
        currentYear = ui.value;

        // complete step
        sliderStep(ui.value);
      }
    });



    // BEGIN slider step
    function sliderStep(year) {
      // clear all map data from previous step
      shapes.clearLayers();

      // set year text
      $year.html(year);

      // collect all shapes to be drawn in array
      var circles = [],
          curves = [],
          pulses = [];



      // START looping through all objects
      objects.forEach(function(el) {
        
        // init previous location
        var locPrevious = null;
        var locTitle = el.title;

        // START looping through locations of each object
        for (var i = 0; i < el.locations.length; i++) {
          
          locName = el.locations[i].name;
          locStartYear = el.locations[i].start;
          locEndYear = el.locations[i].end;
          locTransType = el.locations[i].type;

          if (locStartYear > year) {
            // console.log(year + " - > does not exist yet");
            break;
          }
          else if (locStartYear === year && !locPrevious) {
            // console.log(year + " - > first appearence in: " + locName);
            circles.push(locName);
            pulses.push(locName);
            break;
          }
          else if (locStartYear === year) {
            // console.log(year + " - > transfer to: " + locName);
            // console.log("previous location was: " + locPrevious);
            circles.push(locName);

            // only add circle and curve if it changes location
            if (locName !== locPrevious) {
              circles.push(locPrevious);
              curves.push([
                            locations[locPrevious].lat,
                            locations[locPrevious].lng,
                            locations[locName].lat,
                            locations[locName].lng,
                            locPrevious,
                            locName,
                            locTitle,
                            locTransType,
                          ]);
            }
            else {
              // console.log("transfer within the same location");
            }
            break;
          }
          else if (locStartYear < year && locEndYear >= year) {
            // console.log(year + " - > stays in " + locName);
            circles.push(locName);
            break;
          }

          // save previous location (for transfer)
          locPrevious = locName;

        // END looping through locations of each object
        }


      // END looping through all objects
      });



      // get unique locations of circles
      var uniqueCircles = circles.filter(onlyUnique);

      // create object with all locations and number of occurances 
      var countCircles = {};
      circles.forEach(function(x) {
        countCircles[x] = (countCircles[x] || 0) + 1;
      });

      // loop through circles and draw them
      for (var key in countCircles) {
        if (countCircles.hasOwnProperty(key)) {
          // console.log(key + " -> " + countCircles[key]);

          L.circle([locations[key].lat, locations[key].lng], {
              color: mainColor,
              fillColor: mainColor,
              fillOpacity: circleFillOpacity,
              radius: baseCircleRadius * (countCircles[key] / 1.5),
              weight: circleWeight,
          }).addTo(shapes);

        }
      }

      // loop throuh curves and draw them
      curves.forEach(function(curve) {
        L.curve([
                  'M',[curve[0], curve[1]],
                  'Q',[curve[0] + 20, (curve[1] + curve[3]) / 2],
                      [curve[2], curve[3]]], {
                        dashArray: 10,
                        animate: {duration: 5000, iterations: Infinity},
                        color: mainColor,
                        weight: lineWeight,
                        className: 'noPointerEvents',
                      }).addTo(shapes);

        var popUpContent = '<span class="artwork-title">&ldquo;' + curve[6] + '&rdquo;</span><br><br> From ' + curve[4] + ' to ' + curve[5] + '<br>Transaction type: ' + curve[7];

        // invisible curve for the popup
        L.curve([
                  'M',[curve[0], curve[1]],
                  'Q',[curve[0] + 20, (curve[1] + curve[3]) / 2],
                      [curve[2], curve[3]]], {
                        dashArray: 10,
                        color: "transparent",
                        weight: 5,
                      }).bindPopup(popUpContent).addTo(shapes);
      });

      // loop through pulses and draw them
      pulses.forEach(function(pulse) {
        L.circle([locations[pulse].lat, locations[pulse].lng], {
              color: "#ff6666",
              fillColor: "transparent",
              fillOpacity: circleFillOpacity,
              radius: baseCircleRadius * 2,
              weight: circleWeight,
              className: 'pulse'
          }).addTo(shapes);
      });

    // END slider step
    }



    // init slider
    sliderStep(currentYear);



    // playback
    var refreshIntervalId,
        playerSpeed = 750;

    $('#play').click(function() {

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