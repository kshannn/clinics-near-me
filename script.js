// Singapore map
let singapore = [1.35, 103.81];
let map = L.map('map').setView(singapore, 12);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);



window.addEventListener("DOMContentLoaded", async function () {

    // Clinic locations
    let clinicsResponse = await axios.get("geojson/chas-clinics.geojson");
    let clinicsData = clinicsResponse.data

    // Clinic Icon
    let clinicIcon = L.icon({
        iconUrl: 'images/clinic.png',
        iconSize: [38, 38], // size of the icon
        iconAnchor: [-5, -5], // point of the icon which will correspond to marker's location
        popupAnchor: [20, -10] // point from which the popup should open relative to the iconAnchor
    });


    // Create clinic cluster layer
    let clinicClusterLayer = L.markerClusterGroup();
    clinicClusterLayer.addTo(map);

    for (let clinic of clinicsData.features) {
        let clinicName = clinic.properties.Description.split("<td>")
        clinicName = clinicName[2].split("</td>")
        clinicName = clinicName[0]

        let clinicLocation = clinic.geometry.coordinates
        L.marker([clinicLocation[1], clinicLocation[0]], { icon: clinicIcon }).addTo(clinicClusterLayer).bindPopup(clinicName)
    }


    // Pharmacy locations
    let pharmacyResponse = await axios.get("geojson/retail-pharmacy.geojson");
    let pharmacyData = pharmacyResponse.data

    // Pharmacy Icon
    let pharmacyIcon = L.icon({
        iconUrl: 'images/pharmacy.png',
        iconSize: [38, 38], // size of the icon
        iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
        popupAnchor: [20, -10] // point from which the popup should open relative to the iconAnchor
    });


    // Create pharmacy cluster layer
    let pharmacyClusterLayer = L.markerClusterGroup();
    pharmacyClusterLayer.addTo(map);

    // Create pharmacy layer group
    // let pharmacyGroup = L.layerGroup();
    // pharmacyGroup.addTo(map);


    //Create baselayer/overlays(s) and add to map
    // let baseLayers = {
    //     "Pharmacies": pharmacyGroup
    // }

    // L.control.layers(baseLayers).addTo(map);

    for (let pharmacy of pharmacyData.features) {

        let pharmacyName = pharmacy.properties.Description.split("<td>")
        pharmacyName = pharmacyName[7].split("</td>")
        pharmacyName = pharmacyName[0]

        let pharmacyLocation = pharmacy.geometry.coordinates
        let pharmacyMarker = L.marker([pharmacyLocation[1], pharmacyLocation[0]], { icon: pharmacyIcon })
        pharmacyMarker.addTo(pharmacyClusterLayer).bindPopup(pharmacyName)
        // L.marker([pharmacyLocation[1], pharmacyLocation[0]]).addTo(pharmacyGroup);

        let buildingName = pharmacy.properties.Description.split("<td>")
        buildingName = buildingName[2].split("</td>")
        buildingName = buildingName[0]

        let roadName = pharmacy.properties.Description.split("<td>")
        roadName = roadName[5].split("</td>")
        roadName = roadName[0]

        let levelNum = pharmacy.properties.Description.split("<td>")
        levelNum = levelNum[4].split("</td>")
        levelNum = levelNum[0]

        // Description pop up when marker is clicked
        pharmacyMarker.addEventListener("click",function(){
            document.querySelector("#descriptionBox").innerHTML = `
            <p>${pharmacyName}</p>
            <p>${buildingName}, ${levelNum}</p>
            <p>${roadName}</p>
            `
            console.log(pharmacyName, buildingName, roadName, levelNum)

        })

    }

})


// Main search box disappear when clicked away
document.querySelector("#contentContainer").addEventListener("click", function (event) {
    if (document.querySelector("#content").contains(event.target)) {
        // pass
    } else {
        // hide div
        document.querySelector("#content").style.display = "none";
        document.querySelector("#contentContainer").style.display = "none";
        document.querySelector("#map").style.zIndex = "0";
        document.querySelector("#descriptionBox").style.zIndex = "1";
        document.querySelector("#innerContainer").style.zIndex = "1";
        document.querySelector("#innerContentBox").style.zIndex = "1";
    }

})

// Toggle buttons
// let pharmacyBtn = document.querySelector("#togglePharmacyBtn")
// pharmacyBtn.addEventListener("change", function{

// })


// Inner search box nav button
document.querySelector("#navBtn").addEventListener("click", function () {
    // document.querySelector("#toggleLayer").style.display = "none";


    if (document.querySelector("#toggleLayer").classList.contains("hidden")) {
        document.querySelector("#toggleLayer").classList.remove("hidden");
        document.querySelector("#toggleLayer").classList.add("show");
    } else {
        document.querySelector("#toggleLayer").classList.remove("show");
        document.querySelector("#toggleLayer").classList.add("hidden");
    }
})





