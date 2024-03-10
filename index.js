import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import myKey from "./key.js";

const port = 3000;
const app = express();
const latLong = `https://api.openweathermap.org/data/2.5/weather?q=`;
const baseURL = `https://api.openweathermap.org/data/2.5/weather?lat=`;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("first.ejs", { content: "Enter a city first" });
});

app.post("/get-weather",async (req, res) => {
    try {
        const address = req.body.city;

        //getting latitude and longitude
        const result1 = await axios.get(`${latLong}${address}&appid=${myKey}`);
        const data1 = result1.data;
        const {coord:{lat, lon} } = data1;
        
        // //getting weather data
        const result2 = await axios.get(`${baseURL}${lat}&lon=${lon}&appid=${myKey}`);
        const data2 = result2.data;
        
        //now integrating
        res.render("second.ejs", {content: data2});
    } catch (error) {
        res.render("first.ejs", {content: `Weather data for this location is not available. \n\n${error.message}`});
    }
});

app.listen(port, () => {
    console.log(`Listening from port ${port}.`);
});