function setCurrentLocation() {
    // 1. Close location tracking box when location toggle is triggered
    document.querySelector("#content").style.display = "none";
    document.querySelector("#locationTrackingContainer").style.display = "none";
    document.querySelector("#map").style.zIndex = "0";
    document.querySelector("#descriptionBox").style.zIndex = "1";
    document.querySelector("#innerContainer").style.zIndex = "2";
    document.querySelector("#searchContentBox").style.zIndex = "1";
    document.querySelector("#toggleLayer").style.zIndex = "1";
    document.querySelector("#brandBar").style.zIndex = "1";

    // 2. Set view to current location
    map.locate({ setView: true, maxZoom: 20 });

    // 3. Add "you are here" in current location
    function youAreHere(e) {
        // 3a. Customize person icon
        let personIcon = L.icon({
            iconUrl: 'images/person.png',
            iconSize: [50, 45],
            iconAnchor: [23, 20],
            popupAnchor: [0, -30]
        });

        L.marker(e.latlng, { icon: personIcon }).addTo(map).bindPopup("You are here").openPopup();
        L.circle(e.latlng).addTo(map);

        // 3b. Description box popup
        document.querySelector("#descriptionBox").innerHTML = `
        <p class="showNearby">Show CHAS clinics and pharmacies within 500m:</p>
        <input type="checkbox" data-toggle="toggle" onchange="showCircle(${e.latlng.lat}, ${e.latlng.lng})">
        `
        document.querySelector("#descriptionBox").classList.remove("hidden");
        document.querySelector("#descriptionBox").classList.add("show");
        $('#descriptionBox [data-toggle="toggle"]').bootstrapToggle();
    }
    map.on('locationfound', youAreHere);
}

function extractDetail(place, index) {
    let tmp = place.properties.Description.split("<td>")
    tmp = tmp[index].split("</td>")
    tmp = tmp[0]
    return tmp
}

let circleLayer = L.layerGroup();
function showCircle(lat, lon) {
    if (map.hasLayer(circleLayer)) {
        map.removeLayer(circleLayer);
    } else {
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

function displayClinicDescription(clinicName, clinicBlock, clinicStreetName, clinicPostal, clinicTelephone, lat, lon) {
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
            <a href="tel:${clinicTelephone}"><div id="call"><strong>CALL</strong></div></a>
        </div>
    </div>
    <p class="showNearby">Show other CHAS clinics and pharmacies within 500m:</p>
    <input type="checkbox" data-toggle="toggle" onchange="showCircle(${lat}, ${lon})">
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
    $('#descriptionBox [data-toggle="toggle"]').bootstrapToggle();

}

function displayPharmacyDescription(pharmacyName, roadName, postalCode, lat, lon) {
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
    <p class="showNearby">Show other CHAS clinics and pharmacies within 500m:</p>
    <input type="checkbox" data-toggle="toggle" onchange="showCircle(${lat}, ${lon})">
    `
    document.querySelector("#descriptionBox").classList.remove("hidden");
    document.querySelector("#descriptionBox").classList.add("show");
    $('#descriptionBox [data-toggle="toggle"]').bootstrapToggle();
}

let validationMsg = document.querySelector(".alert")
function showAlert() {
    // === Validation message appear ===
    if (validationMsg.classList.contains("hidden")) {
        validationMsg.classList.remove("hidden");
        validationMsg.classList.add("show")
    }
    // === Close Warning Alert ===
    document.querySelector(".close").addEventListener("click", function () {
        validationMsg.classList.remove("show")
        validationMsg.classList.add("hidden")
    })
}