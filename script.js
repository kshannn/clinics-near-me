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

     // Create clinic layer group
     let clinicGroup = L.layerGroup();
     clinicGroup.addTo(map);
     clinicClusterLayer.addTo(clinicGroup);

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

    // Create pharmacy layer group
    let pharmacyGroup = L.layerGroup();
    pharmacyGroup.addTo(map);
    pharmacyClusterLayer.addTo(pharmacyGroup);


    for (let pharmacy of pharmacyData.features) {

        let pharmacyName = pharmacy.properties.Description.split("<td>")
        pharmacyName = pharmacyName[7].split("</td>")
        pharmacyName = pharmacyName[0]

        let pharmacyLocation = pharmacy.geometry.coordinates
        let pharmacyMarker = L.marker([pharmacyLocation[1], pharmacyLocation[0]], { icon: pharmacyIcon })
        pharmacyMarker.addTo(pharmacyClusterLayer).bindPopup(pharmacyName)

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
        pharmacyMarker.addEventListener("click", function () {
            document.querySelector("#descriptionBox").innerHTML = `
            <p>${pharmacyName}</p>
            <p>${buildingName}, ${levelNum}</p>
            <p>${roadName}</p>
            `

            if (document.querySelector("#descriptionBox").classList.contains("hidden")) {
                document.querySelector("#descriptionBox").classList.remove("hidden");
                document.querySelector("#descriptionBox").classList.add("show");
                document.querySelector("#descriptionBox").classList.add("statusShown");
                document.querySelector("#toggleLayer").classList.remove("hidden");
                document.querySelector("#toggleLayer").classList.add("show")
            } else {
                document.querySelector("#descriptionBox").classList.remove("show");
                document.querySelector("#descriptionBox").classList.add("hidden");
                document.querySelector("#toggleLayer").classList.remove("show");
                document.querySelector("#toggleLayer").classList.add("hidden")
            }

        })

    }

    // Toggle buttons

    let clinicBtn = document.querySelector("#toggleClinicBtn")
    clinicBtn.addEventListener("change", function () {
        if (map.hasLayer(clinicGroup)) {
            map.removeLayer(clinicGroup)
        } else {
            map.addLayer(clinicGroup)
        }
    })

    map.removeLayer(pharmacyGroup); // hide pharmacy markers by default

    let pharmacyBtn = document.querySelector("#togglePharmacyBtn")
    pharmacyBtn.addEventListener("change", function () {
        if (map.hasLayer(pharmacyGroup)) {
            map.removeLayer(pharmacyGroup)
        } else {
            map.addLayer(pharmacyGroup)
        }
    })


}) //end of DOMContentLoaded



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

document.querySelector("#closeBtn").addEventListener("click",function(){
    document.querySelector("#content").style.display = "none";
    document.querySelector("#contentContainer").style.display = "none";
    document.querySelector("#map").style.zIndex = "0";
    document.querySelector("#descriptionBox").style.zIndex = "1";
    document.querySelector("#innerContainer").style.zIndex = "1";
    document.querySelector("#innerContentBox").style.zIndex = "1";
})



// Inner search box nav button
document.querySelector("#navBtn").addEventListener("click", function () {
    
    // if both are hidden, show both
    if (document.querySelector("#toggleLayer").classList.contains("hidden") && document.querySelector("#descriptionBox").classList.contains("hidden") && document.querySelector("#descriptionBox").classList.contains("statusShown")) {
        document.querySelector("#toggleLayer").classList.remove("hidden");
        document.querySelector("#toggleLayer").classList.add("show");
        document.querySelector("#descriptionBox").classList.remove("hidden");
        document.querySelector("#descriptionBox").classList.add("show");
    } 

    else if (document.querySelector("#toggleLayer").classList.contains("show") && document.querySelector("#descriptionBox").classList.contains("hidden")) {
        document.querySelector("#toggleLayer").classList.remove("show");
        document.querySelector("#toggleLayer").classList.add("hidden");
    } 


    // if toggle and description are shown, hide both.
    else if (document.querySelector("#toggleLayer").classList.contains("show") && document.querySelector("#descriptionBox").classList.contains("show")&& document.querySelector("#descriptionBox").classList.contains("statusShown")) {
        document.querySelector("#toggleLayer").classList.remove("show");
        document.querySelector("#toggleLayer").classList.add("hidden");
        document.querySelector("#descriptionBox").classList.remove("show");
        document.querySelector("#descriptionBox").classList.add("hidden");
    } 

    else {
        document.querySelector("#toggleLayer").classList.remove("hidden");
        document.querySelector("#toggleLayer").classList.add("show");
    }


})
