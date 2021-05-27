function extractDetail(place, index) {
    let tmp = place.properties.Description.split("<td>")
    tmp = tmp[index].split("</td>")
    tmp = tmp[0]
    return tmp
}

function showCircle(lat, lon){
    let circleLayer = L.layerGroup();
    if (map.hasLayer(circleLayer)) {
        map.removeLayer(circleLayer);
        console.log(1) // Issue: if block not running
    } else {
        console.log(2)
        let clinicCircle = L.circle([lat, lon], {
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
    document.querySelector("#descriptionBox").innerHTML = `
    <h2>${clinicName}</h2>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="details detailsLocation">
            <p>${clinicBlock} ${clinicStreetName}, Singapore ${clinicPostal}</p>
        </div>
    </div>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-phone-alt"></i>
        </div>
        <div class="details detailsTelephone">
            <p>${clinicTelephone}</p>     
        </div>
    </div>
    <p class="showNearby">Show CHAS clinics and pharmacies within 500m:</p>
    <input type="checkbox" data-toggle="toggle" id="clinicDistanceBtn" onchange="showCircle(${lat}, ${lon})">
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
    $('#descriptionBox [data-toggle="toggle"]').bootstrapToggle();
    
}


function displayPharmacyDescription(pharmacyName,roadName,postalCode,lat,lon) {
    document.querySelector("#descriptionBox").innerHTML = `
    <h2>${pharmacyName}</h2>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="details">
            <p>${roadName}, Singapore ${postalCode}</p>
        </div>
    </div>
    <p class="showNearby">Show CHAS clinics and pharmacies within 500m:</p>
    <input type="checkbox" data-toggle="toggle" id="pharmacyDistanceBtn" onchange="showCircle(${lat}, ${lon})">
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
    $('#descriptionBox [data-toggle="toggle"]').bootstrapToggle();
}

