const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/plants", {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=>console.log("Connected to mongodb"))
    .catch(err => console.error("Could not connect to mongodb", err));

const plantSchema = new mongoose.Schema({
    name:String,
    species:String,
    genus:String,
    lifespan:Number,
    height:Number,
    continents:[String]
});

const Plant = mongoose.model('Plant',plantSchema);

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/plants', (req,res)=>{
    getPlants(res);
});

async function getPlants(res) {
    const plants = await Plant.find();
    console.log(plants);
    res.send(plants);
}

app.get('/api/plants/:id', (req,res)=>{
    getPlant(req.params.id, res);
});

async function getPlant(id, res){
    const plant = await Plant.findOne({_id:id});
    console.log(plant);
    res.send(plant);
}

app.post('/api/plants', (req, res)=>{
    const result = validatePlant(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const plant = new Plant({
        name:req.body.name,
        species:req.body.species,
        genus:req.body.genus,
        lifespan:req.body.lifespan,
        height:req.body.height,
        continents:req.body.continents
    });

    createPlant(plant,res);
});

async function createPlant(plant, res) {
    const result = await plant.save();
    console.log(result);
    res.send(plant);
}

app.put('/api/plants/:id',(req,res)=>{
    const plant = validatePlant(req.body);

    if(!plant) res.status(404).send("plant with given id was not found");

    const result = validatePlant(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updatePlant(res, req.params.id, req.body.name, req.body.species, req.body.genus, req.body.lifespan, req.body.height, req.body.continents);
});

async function updatePlant(res, id, name, species, genus, lifespan, height, continents){
    const result = await Plant.updateOne({_id:id}, {
        $set:{
            name:name,
            species:species,
            genus:genus,
            lifespan:lifespan,
            height:height,
            continents:continents
        }
    })

    res.send(result);
}

app.delete('/api/plants/:id',(req,res)=>{
    removePlant(res,req.params.id);
});

async function removePlant(res, id) {
    const plant = await Plant.findByIdAndRemove(id);
    res.send(plant);
}

function validatePlant(plant){
    const schema = {
        name:Joi.string().min(1).required(),
        species:Joi.string().min(1).required(),
        genus:Joi.string().min(1).required(),
        lifespan:Joi.number().min(1).required(),
        height:Joi.number().min(1).required(),
        continents:Joi.array().min(1).required()
    };

    return Joi.validate(plant,schema);
}

//Setting up server
app.listen(3000, ()=>{
    console.log("Listening on port 3000...");
})