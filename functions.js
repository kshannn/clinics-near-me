function extractDetail(place, index) {
    let tmp = place.properties.Description.split("<td>")
    tmp = tmp[index].split("</td>")
    tmp = tmp[0]
    return tmp
}


let circleLayer = L.layerGroup();
function showCircle(lat, lon){
    console.log(circleLayer)
    if (map.hasLayer(circleLayer)) {
        map.removeLayer(circleLayer);
        console.log(1)
    } else {
        console.log(2)
        circleLayer.clearLayers();
        let circles = L.circle([lat, lon], {
            color: 'red',
            fillColor: "orange",
            fillOpacity: 0.25,
            radius: 500
        }).addTo(circleLayer);
        map.addLayer(circleLayer);
    }

    //3. zoom out to view full circle
    map.setView([lat, lon], 15);
}

function displayClinicDescription(clinicName,clinicBlock,clinicStreetName,clinicPostal,clinicTelephone, lat,lon){
    if (map.hasLayer(circleLayer)) {
        map.removeLayer(circleLayer);
    } 
    document.querySelector("#descriptionBox").innerHTML = `
    <h2>${clinicName}</h2>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="details detailsLocation">
            <p>${clinicBlock} ${clinicStreetName}, SINGAPORE ${clinicPostal}</p>
        </div>
    </div>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-phone-alt"></i>
        </div>
        <div class="details detailsTelephone">
            <p>${clinicTelephone}</p>
            <div class="test"><i class="fas fa-phone-alt"></i></div>     
        </div>
    </div>
    <p class="showNearby">Show pharmacies within 500m:</p>
    <input type="checkbox" data-toggle="toggle" onchange="showCircle(${lat}, ${lon})">
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
    $('#descriptionBox [data-toggle="toggle"]').bootstrapToggle();
    
}


function displayPharmacyDescription(pharmacyName,roadName,postalCode,lat,lon) {
    if (map.hasLayer(circleLayer)) {
        map.removeLayer(circleLayer);
    } 
    document.querySelector("#descriptionBox").innerHTML = `
    <h2>${pharmacyName}</h2>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="details">
            <p>${roadName}, SINGAPORE ${postalCode}</p>
        </div>
    </div>
    <p class="showNearby">Show pharmacies within 500m:</p>
    <input type="checkbox" data-toggle="toggle" onchange="showCircle(${lat}, ${lon})">
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
    $('#descriptionBox [data-toggle="toggle"]').bootstrapToggle();
}

let validationMsg = document.querySelector(".alert")
function showAlert(){
    // Validation message appear
    if(validationMsg.classList.contains("hidden")){
        validationMsg.classList.remove("hidden");
        validationMsg.classList.add("show")
    }
    // Close Warning Alert
    document.querySelector(".close").addEventListener("click",function(){
        validationMsg.classList.remove("show")
        validationMsg.classList.add("hidden")
    })
}