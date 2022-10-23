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
            author: '634a84a7b52c10ecc3cb4d78',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://picsum.photos/400 ",
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores, illum. Veritatis doloremque quod laudantium voluptatibus.",
            price

        })
        await camp .save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
}) ;