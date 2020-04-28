const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/plants', {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=> console.log("Connected to Mongbo DB"))
    .catch(err => console.log("Couldn't connect to MongoDB.", err));

const plantSchema = new mongoose.Schema({
    name:String,
    species:String,
    genus:String,
    lifespan:Number,
    height:Number,
    continents:[String]
});

const Plant = mongoose.model('Plant',plantSchema);

//Function for creating a plant obj
async function createPlant(){
    const plant = new Plant({
        name:"Elephant Cactus",
        species:"Pachycereus",
        genus:"pringlei",
        lifespan:100,
        height:10.0,
        continents:["North America"]
    });

    const result = await plant.save();
    console.log(result);
}

createPlant();