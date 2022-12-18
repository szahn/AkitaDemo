const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser')
const axios = require('axios');
const uuid = require('uuid');
const {findIndex} = require('lodash');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());

const googleMapsApi = "https://maps.googleapis.com/maps/api";
const apiKey = "";

const places = [];

app.post("/api/place", (req, res) => {
    const id = uuid.v4();
    const record = {
        lat: 0,
        lng: 0,
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        ...req.body,
        id: id,
        created: new Date(),
        modified: new Date()
    };

    places.push(record);

    return res.send(record);
});

app.put("/api/place/:placeId", (req, res) => {
    const placeId = req.params.placeId;

    const index = findIndex(places, p => p.id = placeId);
    if (index < 0){
        return res.sendStatus(404);
    }
    const currentPlace = places[index];

    const place = {
        ...currentPlace, 
        ...req.body,
        modified: new Date()
    };

    places.splice(index, 1, place);

    return res.send(place);
});

app.get("/api/place/:placeId", (req, res) => {
    const placeId = req.params.placeId;

    const index = findIndex(places, p => p.id = placeId);
    if (index < 0){
        return res.sendStatus(404);
    }

    const place = places[index];

    return res.send(place);
});

app.get("/api/places", (req, res) => {
    console.log(`${places.length} places`)
    return res.send(places);
});

app.delete("/api/place/:placeId", (req, res) => {
    const placeId = req.params.placeId;

    const index = findIndex(places, p => p.id == placeId);
    if (index < 0){
        return res.sendStatus(404);
    }

    places.splice(index, 1);
    
    return res.status(200).json();
});

app.get("/api/geocode", async (req, res) => {  
    const lat = req.query.lat;
    const lng = req.query.lng;

    const results = await axios.get(`${googleMapsApi}/geocode/json?latlng=${lat},${lng}&result_type=locality|neighborhood|postal_code|administrative_area_level_1|country&key=${apiKey}`);

    return res.send(results.data);
});

app.get("/api/placeDetails", async (req, res) => {  
    const placeId = req.query.placeId;
    const url = `${googleMapsApi}/place/details/json?place_id=${placeId}&fields=address_component,geometry,name&key=${apiKey}`;
    const results = await axios.get(url);
    const result = results.data.result;

    return res.send(result);
});

app.get("/api/suggest", async (req, res) => {  
    const lat = req.query.lat;
    const lng = req.query.lng;
    const type = req.query.type;

    const radius = milesToMeters(5);
    const url = `${googleMapsApi}/place/nearbysearch/json?location=${lat},${lng}&type=${type}&radius=${radius}&key=${apiKey}`;
    const results = await axios.get(url);

    return res.send(results.data);
  });
  
app.listen(PORT, () => {
  console.log("Server started listening on port : ", PORT);
});

function milesToMeters(miles) {
    return miles * 1609.34;
}
