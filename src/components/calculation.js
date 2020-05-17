import express from 'express';
import axios from 'axios';
import cors from 'cors';

app.set('view engine', 'html');
app.use(cors());

app.post('/', function(req, res){

  var hereApi = "WoRodsRX4_lDj-sHVx6eDKD6fD3IFbpZ6h28hUhYjT0";
  var weatherApi = "f896bb64c45e8edff3282fa715a2f715";

  var lat = [];
  var lon = [];
  var object = [];
  var tempSave = [];

  lat.push(req.query.coordinates1[0]);
  lat.push(req.query.coordinates2[0]);
  lon.push(req.query.coordinates1[1]);
  lon.push(req.query.coordinates2[1]);

  axios('https://route.ls.hereapi.com/routing/7.2/calculateroute.json?' + 
    'apiKey=' + hereApi + '&' + 
    'waypoint0=geo!' + lat[0] + ',' + lon[0] + '&' + 
    'waypoint1=geo!' + lat[1] + ',' + lon[1] + '&mode=fastest;pedestrian;traffic:disabled')
  .then((response)=>{
    var coordinates = response.data.response.route[0].leg[0].maneuver;

    axios('https://api.openweathermap.org/data/2.5/weather?lat=' + lat[0] + '&lon=' + lon[0] + '&units=metric&appid=' + weatherApi)
    .then((response)=>{
      object.push({lat: lat[0], lon: lon[0], temp: Math.round(response.data.main.temp), weather: response.data.weather[0].description});
      console.log("asdasd");
      axios('https://api.openweathermap.org/data/2.5/weather?lat=' + lat[1] + '&lon=' + lon[1] + '&units=metric&appid=' + weatherApi)
      .then((response)=>{
        object.push({lat: lat[1], lon: lon[1], temp: Math.round(response.data.main.temp), weather: response.data.weather[0].description});
        
        var locations = [];
        var idx = coordinates.length;

        coordinates.forEach(element => {
          axios('https://api.openweathermap.org/data/2.5/weather?lat=' + element.position.latitude + '&lon=' + element.position.longitude + '&units=metric&appid=' + weatherApi)
          .then((response)=>{

            locations.push({lat: element.position.latitude, lon: element.position.longitude, temp: response.data.main.temp, weather: response.data.weather[0].description});

            if (!--idx) {              
              //locations.sort((a,b) => a.temp - b.temp);
              //console.log(coordinates.length);
              //console.log(parseInt(coordinates.length/5));

              var size = parseInt(locations.length/5);
              
              for (var a = 0; a < 5; a++) {
                if(a == 0){
                  var i = 0;
                  var check = size;
                }
                else{
                  check = check + size;
                }
                console.log(i + "|" + check)

                for (; i < check; i++) {
                  tempSave.push(locations[i]);
                }
                
                tempSave.sort((a,b) => a.temp - b.temp);
                tempSave = tempSave.slice(1).slice(-1);
                object.push(tempSave[0]);

                tempSave = [];
              }

              //console.log(object);
              console.log(object);
              res.send({data: object});


              //locations = locations.slice(1).slice(-5);            
              /*
              locations.forEach(element => {
                object.push(element);
              });*/
              res.send({data: object});
            }
          })
          .catch((error)=>{
            console.log(error)
            res.send({data: "Account temporary block"});
          })
        });
      })
      .catch((error)=>{
        console.log(error)
        res.send({data: "Account temporary block"});
      })
    })
    .catch((error)=>{
      console.log(error)
      res.send({data: "Account temporary block"});
    })
  })
  .catch((error)=>{
    console.log(error)
    res.send({data: "Account temporary block"});
  })
});

app.listen(9000, function(mssg){
  console.log('Listening to port 8080');
});
