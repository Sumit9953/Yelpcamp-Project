const mongoose = require("mongoose")
const cities = require("./cities")
const {places,descriptors} = require("./seedHelper")
const Campground = require("../models/campground")


mongoose.connect("mongodb://localhost:27017/yelp-camp2");

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open" , () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random()*1000);
         const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '634a93871cde814786be3ca2',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores, illum. Veritatis doloremque quod laudantium voluptatibus.",
            price ,
            geometry: { 
              type: 'Point', 
              coordinates: [ -113.133115, 47.020078 ] 
            },
            images :  [
                {
                  url: 'https://res.cloudinary.com/da5md6spw/image/upload/v1666766176/YelpCamp/dsa6wm7pw3u5ocmz1rcf.jpg',
                  filename: 'YelpCamp/ue6g6h8urnxgra8ii9mr' 
                },
                {
                  url: 'https://res.cloudinary.com/da5md6spw/image/upload/v1666681975/YelpCamp/fsjpprdliuu9s5chgpok.png',
                  filename: 'YelpCamp/fsjpprdliuu9s5chgpok'
                }
              ],

        })
        await camp .save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
}) ;