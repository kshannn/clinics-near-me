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

    // Pharmacy locations
    let pharmacyResponse = await axios.get("geojson/retail-pharmacy.geojson");
    let pharmacyData = pharmacyResponse.data

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
        L.marker([pharmacyLocation[1], pharmacyLocation[0]]).addTo(pharmacyClusterLayer).bindPopup(pharmacyName)
        // L.marker([pharmacyLocation[1], pharmacyLocation[0]]).addTo(pharmacyGroup);
    }

})


// Main search box disappear when clicked away
document.querySelector("#contentContainer").addEventListener("click",function(event){
    if (document.querySelector("#content").contains(event.target)){
        // pass
    } else {
        // hide div
        document.querySelector("#content").style.display="none";
        document.querySelector("#contentContainer").style.display="none";
        document.querySelector("#map").style.zIndex = "0";
        
    }
    
})

// Toggle buttons
// let pharmacyBtn = document.querySelector("#togglePharmacyBtn")
// pharmacyBtn.addEventListener("click", function{

// })