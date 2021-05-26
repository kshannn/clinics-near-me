function extractDetail(place, index) {
    let tmp = place.properties.Description.split("<td>")
    tmp = tmp[index].split("</td>")
    tmp = tmp[0]
    return tmp
}

function displayClinicDescription(clinicName,clinicBlock,clinicStreetName,clinicPostal,clinicTelephone, lat,lon){
    document.querySelector("#descriptionBox").innerHTML = `
    <h2>${clinicName}</h2>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="details">
            <p>${clinicBlock} ${clinicStreetName}, Singapore ${clinicPostal}</p>
        </div>
    </div>
    <div class="locationInfo">
        <div class="icon">
            <i class="fas fa-phone-alt"></i>
        </div>
        <div class="details">
            <p>${clinicTelephone}</p>     
        </div>
    </div>
    <p>Show CHAS clinics and pharmacies within:</p>
    <button id="clinicDistanceBtn" onClick="showCircle(${lat}, ${lon})">500m</button>
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
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
    <p>Show CHAS clinics and pharmacies within:</p>
    <button id="pharmacyDistanceBtn" onClick="showCircle(${lat},${lon})">500m</button>
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
}

function showCircle(lat, lon){
    let clinicCircleLayer = L.layerGroup();
    if (map.hasLayer(clinicCircleLayer)) {
        map.removeLayer(clinicCircleLayer);
    } else {
        console.log(1234);
        let clinicCircle = L.circle([lat, lon], {
            color: 'red',
            fillColor: "orange",
            fillOpacity: 0.25,
            radius: 500
        }).addTo(clinicCircleLayer);
        map.addLayer(clinicCircleLayer);
    }

    //3. zoom out to view full circle
    map.setView([lat, lon], 16);
}