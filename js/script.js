window.onload = function() {
  
  // helper functions
  function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }



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
    var shapes = new L.LayerGroup();

    // define circle defaults
    var circleWeight = 1,
        circleFillOpacity = 0.5,
        baseCircleRadius = 100000,
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
      layers: [grayscale, shapes],
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
          curves = [];




      // START looping through all objects
      objects.forEach(function(el) {
        
        // init previous location
        var locPrevious = null;

        // START looping through locations of each object
        for (var i = 0; i < el.locations.length; i++) {
          
          locName = el.locations[i].name;
          locStartYear = el.locations[i].start;
          locEndYear = el.locations[i].end;

          if (locStartYear > year) {
            // console.log(year + " - > does not exist yet");
            break;
          }
          else if (locStartYear === year) {
            // console.log(year + " - > transfer to: " + locName);
            circles.push(locName);

            // check if previous location exists, add circle and curve if this is the case
            if (locPrevious) {
              // console.log("previous location was: " + locPrevious);
              circles.push(locPrevious);
              curves.push([
                            locations[locPrevious].lat,
                            locations[locPrevious].lng,
                            locations[locName].lat,
                            locations[locName].lng]);
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
                      }).addTo(shapes);
      });

    // END slider step
    }



    // init slider
    sliderStep(currentYear);



    // playback
    var refreshIntervalId,
        playerSpeed = 1500;

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


