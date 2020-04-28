async function displayPlants() {
    let response = await fetch('/api/plants');
    let plantsJSON = await response.json();
    let plantsDiv = document.getElementById("plants-div");
    plantsDiv.innerHTML = "";

    for(i in plantsJSON) {
        let plant = plantsJSON[i];
        plantsDiv.append(getPlantItem(plant));
    }
}

function getPlantItem(plant){
    let plantSection = document.createElement("section");
    plantSection.classList.add("plant");

    //Adding Name
    let aName = document.createElement("a");
    aName.setAttribute("plant-id", plant._id);
    aName.href = "#";
    aName.onclick = showPlantDetails;
    let h2Elem = document.createElement("h2");
    h2Elem.textContent = plant.name;
    aName.append(h2Elem)
    plantSection.append(aName);

    let plantContinentsString = "";
    for(let i = 0; i <= plant.continents.length-1; ++i) {
        plantContinentsString = plantContinentsString.concat(plant.continents[i],' , ');
    }

    //Adding description
    let plantDescription = document.createElement("p");
    plantDescription.innerHTML = ("<b>Scientific Name: </b>"+plant.species+" "+plant.genus+"<br><b>Life Span (years)</b>: "+plant.lifespan+"<br><b>Height (meters)</b>: "+plant.height+"<br><b>Found on the contienent(s)</b>: "+plantContinentsString);
    plantSection.append(plantDescription);

    //Adding edit button
    let plantDisplayEditorButton = document.createElement("button");
    plantDisplayEditorButton.textContent = "Edit";
    plantDisplayEditorButton.onclick = toggleEditor;
    plantSection.append(plantDisplayEditorButton);

    return plantSection;
}

async function showPlantDetails(){
    let id = this.getAttribute("plant-id");
    let response = await fetch(`/api/plants/${id}`);

    if(response.status != 200) {
        console.log("Error reciving plant");
        let span = document.getElementById("span-response-details");
        span.textContent = "ERROR: plant could not be shown";
        return;
    }

    let plant = await response.json();
    document.getElementById("plant-id").textContent = plant._id;
    document.getElementById("txt-name").value = plant.name;
    document.getElementById("txt-species").value = plant.species;
    document.getElementById("txt-genus").value = plant.genus;
    document.getElementById("txt-life-span").value = plant.lifespan;
    document.getElementById("txt-height").value = plant.height

    //Listing continents
    let plantContinentsString = "";
    for(let i = 0; i <= plant.continents.length-1; ++i) {
        plantContinentsString = plantContinentsString.concat(plant.continents[i],', ');
    }
    document.getElementById("txt-continents").value = plantContinentsString;
}

async function addPlant() {
    let plantName = document.getElementById("txt-add-name").value;
    let plantSpecies = document.getElementById("txt-add-species").value;
    let plantGenus = document.getElementById("txt-add-genus").value;
    let plantLifeSpan = document.getElementById("txt-add-life-span").value;
    let plantHeight = document.getElementById("txt-add-height").value;
    let plantContinents = document.getElementById("txt-add-continents").value;

    let span = document.getElementById("span-response-add");

    let plant = {"name":plantName, "species":plantSpecies, "genus":plantGenus, "lifespan":plantLifeSpan, "height":plantHeight, "continents":plantContinents.split(',')};

    let response = await fetch('/api/plants', {
        method:"POST",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        body:JSON.stringify(plant)
    });

    if(response.status != 200){
        console.log("ERROR Posting data");
        span.textContent = "ERROR: Plant could not be added!";
        window.setTimeout(clearSpans, 5000);
        return;
    }

    span.textContent = "Plant has been Added!";
    window.setTimeout(clearSpans, 5000);

    let result = await response.json();
    console.log(result);
    displayPlants();
}

async function editPlant() {
    let plantId = document.getElementById("plant-id").textContent;
    let plantName = document.getElementById("txt-name").value;
    let plantSpecies = document.getElementById("txt-species").value;
    let plantGenus = document.getElementById("txt-genus").value;
    let plantLifeSpan = document.getElementById("txt-life-span").value;
    let plantHeight = document.getElementById("txt-height").value;
    let plantContinents = document.getElementById("txt-continents").value;
    let span = document.getElementById("span-response-details");

    
    let plant = {"name":plantName, "species":plantSpecies, "genus":plantGenus, "lifespan":plantLifeSpan, "height":plantHeight
    , "continents":plantContinents.split(',')};

    let response = await fetch(`/api/plants/${plantId}`, {
        method:'PUT',
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(plant)
    });

    if(response.status != 200){
        console.log("Error updating plant");
        span.textContent = "ERROR: plant could not be updated!";
        setTimeout(clearSpans(), 5000);
        return;
    }

    span.textContent = "plant has been updated!";
    window.setTimeout(clearSpans, 5000);

    let result = await response.json();
    displayPlants();
}

async function deletePlant() {
    console.log("In delete function");
    let plantId = document.getElementById("plant-id").textContent;
    let span = document.getElementById("span-response-details");

    let response = await fetch(`/api/plants/${plantId}`,{
        method:"DELETE",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        }
    });

    if(response.status != 200) {
        console.log("Error deleting");
        span.textContent = "ERROR: Plant could not be deleted!";
        return;
    }

    span.textContent = "Plant has been deleted!";
    window.setTimeout(clearSpans, 5000);

    let result = await response.json();
    displayPlants();
}

function clearSpans() {
    console.log("Clearing spans...");
    let detailsSpan = document.getElementById("span-response-details");
    let addSpan = document.getElementById("span-response-add");

    detailsSpan.textContent = "";
    addSpan.textContent = "";
}

function toggleEditor() {
    console.log("Toggling plant editor...");
    var editor = document.getElementById("plant-details");
    editor.classList.toggle("hidden");
}

function toggleAdder() {
    console.log("Toggling add plant menu...");
    var adder = document.getElementById("add-plant");
    adder.classList.toggle("hidden");
}

window.onload = function(){
    this.displayPlants();

    let toggleEditBtn = document.getElementById("btn-open-editor");
    toggleEditBtn.onclick = toggleEditor;

    let toggleAddBtn = document.getElementById("btn-open-adder");
    toggleAddBtn.onclick = toggleAdder;

    let addBtn = document.getElementById("btn-add-plant");
    addBtn.onclick = addPlant;

    let editBtn = document.getElementById("btn-edit-plant");
    editBtn.onclick = editPlant;

    let deleteBtn = document.getElementById("btn-delete-plant");
    deleteBtn.onclick = deletePlant;
}