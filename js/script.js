window.onload = function() {
  
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





  // var objectData,
  //     locationData;

  // $.when(
  //     $.getJSON("objects-array.json", function(data) {
  //         objectData = data;
  //     }),
  //     $.getJSON("locations.json", function(data) {
  //         locationData = data;
  //     })
  // ).then(function() {
  //   console.log(objectData.length);

  //   objectData.forEach(function(el) {
  //     console.log(el);
  //   });

  //   // run main function
  //   main(objectData, locationData);
  // });





  function main() {
    var points = new L.LayerGroup();



    // define point defaults
    var pointWeight = 1,
        pointFillOpacity = 0.5,
        pointRadius = 100000,
        lineWeight = 1;

    var mainColor = 'red';










    var elArray = [];
    // elArray.push(L.circle([40.415916, -3.703578], {
    //     color: mainColor,
    //     fillColor: mainColor,
    //     fillOpacity: pointFillOpacity,
    //     radius: pointRadius,
    //     weight: pointWeight,
    //     time: 1922,
    //     id: 1,
    // }));




    var pointOne = L.circle([40.415916, -3.703578], {
        color: mainColor,
        fillColor: mainColor,
        fillOpacity: pointFillOpacity,
        radius: pointRadius,
        weight: pointWeight,
        time: 1922,
        id: 1,
    });

    var pointTwo = L.circle([40.715721, -74.026105], {
        color: mainColor,
        fillColor: mainColor,
        fillOpacity: pointFillOpacity,
        radius: pointRadius,
        weight: pointWeight,
        time: 1922,
        id: 1,
    });





    var aLat = 40.415916;
    var aLng = -3.703578;
    var bLat = 40.715721;
    var bLng = -74.026105;
    var pathOne = L.curve([
                  'M',[aLat, aLng],
                  'Q',[aLat + 20, (aLng + bLng) / 2],
                      [bLat, bLng]], {
                        dashArray: 10,
                        animate: {duration: 5000, iterations: Infinity},
                        color: mainColor,
                        weight: lineWeight,
                        time: 1922,
                        id: 1,
                      });





    var pointThree = L.circle([40.415916, -3.703578], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: pointFillOpacity,
        radius: pointRadius,
        weight: pointWeight,
        time: 1920,
        id: 2,
    });

    var pointFour = L.circle([40.715721, -74.026105], {
        color: 'green',
        fillColor: 'green',
        fillOpacity: pointFillOpacity,
        radius: pointRadius,
        weight: pointWeight,
        time: 1920,
        id: 2,
    });







    
    elArray.push(pointOne, pointTwo, pathOne, pointThree, pointFour);











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
      // set year text
      $year.html(year);

      // cycle through all elements
      elArray.forEach(function(el){
        // first clear the current element
        points.removeLayer(el);

        // add it only if it's in the current year
        if (el.options.time === year) {
          points.addLayer(el);
        }
        // else {
        //   points.removeLayer(el);
        // }
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

  

  main();





};


