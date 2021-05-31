// DOMContentLoaded
window.addEventListener("DOMContentLoaded", async function () {
    let listOfLocations = [];

    // === Clinic geojson data ===
    let clinicsResponse = await axios.get("geojson/chas_clinics.geojson");
    let clinicsData = clinicsResponse.data.features

    // === Customize clinic icon ===
    let clinicIcon = L.icon({
        iconUrl: 'images/clinic.png',
        iconSize: [38, 38], 
        iconAnchor: [-5, -5], 
        popupAnchor: [20, -10] 
    });

    // === Create clinic cluster ===
    let clinicClusterLayer = L.markerClusterGroup();

    // === Add clinic cluster to clinic layer ===
    let clinicGroup = L.layerGroup();
    clinicClusterLayer.addTo(clinicGroup);
    clinicGroup.addTo(map);

    for (let clinic of clinicsData) {

        // === Clinic details ===
        let clinicName = extractDetail(clinic, 2).toUpperCase();
        listOfLocations.push(clinicName)
        let clinicTelephone = extractDetail(clinic, 4);
        clinicTelephone = clinicTelephone.substring(0, 4) + " " + clinicTelephone.substring(4, clinicTelephone.length)
        let clinicPostal = extractDetail(clinic, 5)
        let clinicBlock = extractDetail(clinic, 7);
        let clinicStreetName = extractDetail(clinic, 10).toUpperCase();

        // === Add clinics into map via coordinates ===
        let clinicLocation = clinic.geometry.coordinates
        let clinicMarker = L.marker([clinicLocation[1], clinicLocation[0]], { icon: clinicIcon })
        clinicMarker.addTo(clinicClusterLayer).bindPopup(clinicName)

        let lat = clinicLocation[1]
        let lon = clinicLocation[0]


        // === Show description and focus on clinic when it is clicked ===
        clinicMarker.addEventListener("click", function () {
            displayClinicDescription(clinicName, clinicBlock, clinicStreetName, clinicPostal, clinicTelephone, lat, lon);

            // Focus on clicked clinic 
            map.setView([clinicLocation[1], clinicLocation[0]], 20);

            if (document.querySelector("#descriptionBox").classList.contains("hidden")) {
                document.querySelector("#descriptionBox").classList.remove("hidden");
                document.querySelector("#descriptionBox").classList.add("show");
            }
        })

    }

    // === Pharmacy geojson Data ===
    let pharmacyResponse = await axios.get("geojson/retail_pharmacy.geojson");
    var pharmacyData = pharmacyResponse.data.features

    // === Customize pharmacy icon ===
    let pharmacyIcon = L.icon({
        iconUrl: 'images/pharmacy.png',
        iconSize: [38, 38], 
        iconAnchor: [5, 5], 
        popupAnchor: [20, -10] 
    });

    // === Create pharmacy cluster layer ===
    let pharmacyClusterLayer = L.markerClusterGroup();

    // === Add pharmacy cluster to pharmacy layer ===
    let pharmacyGroup = L.layerGroup();
    pharmacyClusterLayer.addTo(pharmacyGroup);
    pharmacyGroup.addTo(map);


    for (let pharmacy of pharmacyData) {

        // === Pharmacy details ===
        let pharmacyName = extractDetail(pharmacy, 7).toUpperCase();
        listOfLocations.push(pharmacyName)
        let postalCode = extractDetail(pharmacy, 1);
        let roadName = extractDetail(pharmacy, 5).toUpperCase();


        // === Add pharmacies into map via coordinates ===
        let pharmacyLocation = pharmacy.geometry.coordinates
        let pharmacyMarker = L.marker([pharmacyLocation[1], pharmacyLocation[0]], { icon: pharmacyIcon })
        pharmacyMarker.addTo(pharmacyClusterLayer).bindPopup(pharmacyName)

        let lat = pharmacyLocation[1]
        let lon = pharmacyLocation[0]

        // === Show description and focus on pharmacy when it is clicked ===
        pharmacyMarker.addEventListener("click", function () {
            displayPharmacyDescription(pharmacyName, roadName, postalCode, lat, lon);

            // === Focus on clicked pharmacy ===
            map.setView([pharmacyLocation[1], pharmacyLocation[0]], 20);

            if (document.querySelector("#descriptionBox").classList.contains("hidden")) {
                document.querySelector("#descriptionBox").classList.remove("hidden");
                document.querySelector("#descriptionBox").classList.add("show");
            }
        })
    }

    // === Clicking on search button ===
    document.querySelector("#innerSearchBtn").addEventListener("click", function () {
        document.querySelector("#suggestedList").innerHTML = ""
        if (!document.querySelector(".suggestedResults")){
            document.querySelector("#innerTextBox").style.borderRadius = "5px 0 0 5px"
        } 
        let innerSearch = document.querySelector("#innerTextBox").value;
        
        // === Field Validation ===
        // if substring of search does not match any location
        let similarResult = 0;
        for (each_location of listOfLocations) {
            if (each_location.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1) {
                similarResult++
            }
        }

        if (similarResult == 0) {
            showAlert();
        }

        // if no search term is keyed
        if (innerSearch == "") {
            showAlert();
            return;
        }

        for (let clinic of clinicsData) {
            // === Clinic details ===
            let clinicName = extractDetail(clinic, 2).toUpperCase();
            let clinicTelephone = extractDetail(clinic, 4);
            clinicTelephone = clinicTelephone.substring(0, 4) + " " + clinicTelephone.substring(4, clinicTelephone.length)
            let clinicPostal = extractDetail(clinic, 5)
            let clinicBlock = extractDetail(clinic, 7);
            let clinicStreetName = extractDetail(clinic, 10).toUpperCase();

            let clinicLocation = clinic.geometry.coordinates
            let lat = clinicLocation[1]
            let lon = clinicLocation[0]

            if (innerSearch.toUpperCase() == clinicName.toUpperCase()) {
                // === Focus on searched clinic ===
                map.setView([clinicLocation[1], clinicLocation[0]], 20);
                displayClinicDescription(clinicName, clinicBlock, clinicStreetName, clinicPostal, clinicTelephone, lat, lon);
            } else if (clinicName.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1) {
                // === Jump to region ===
                map.setView([clinicLocation[1], clinicLocation[0]], 15);
                displayClinicDescription(clinicName, clinicBlock, clinicStreetName, clinicPostal, clinicTelephone, lat, lon);
            }
        }

        for (let pharmacy of pharmacyData) {
            // === Pharmacy details ===
            let pharmacyName = extractDetail(pharmacy, 7).toUpperCase();
            let postalCode = extractDetail(pharmacy, 1);
            let roadName = extractDetail(pharmacy, 5).toUpperCase();

            let pharmacyLocation = pharmacy.geometry.coordinates
            let lat = pharmacyLocation[1]
            let lon = pharmacyLocation[0]

            if (innerSearch.toUpperCase() == pharmacyName.toUpperCase()) {
                // === Focus on searched pharmacy ===
                map.setView([pharmacyLocation[1], pharmacyLocation[0]], 20);
                displayPharmacyDescription(pharmacyName, roadName, postalCode, lat, lon);
            } else if (pharmacyName.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1) {
                // === Jump to region ===
                map.setView([pharmacyLocation[1], pharmacyLocation[0]], 15);
                displayPharmacyDescription(pharmacyName, roadName, postalCode, lat, lon)
            }
        }
    })

    // === Toggle layer groups ===
    let clinicBtn = document.querySelector("#toggleClinicBtn")
    clinicBtn.addEventListener("change", function () {
        if (map.hasLayer(clinicGroup)) {
            map.removeLayer(clinicGroup)
        } else {
            map.addLayer(clinicGroup)
        }
    })

    let pharmacyBtn = document.querySelector("#togglePharmacyBtn")
    pharmacyBtn.addEventListener("change", function () {
        if (map.hasLayer(pharmacyGroup)) {
            map.removeLayer(pharmacyGroup)
        } else {
            map.addLayer(pharmacyGroup)
        }
    })

}) // End of DOMContentLoaded


// === Expand toggle layer box on click ===
document.querySelector("#toggleLayerBtn").addEventListener("click", function () {
    if (document.querySelector("#expandedToggle").classList.contains("show")) {
        document.querySelector("#expandedToggle").classList.remove("show")
        document.querySelector("#expandedToggle").classList.add("hidden")
    } else {
        document.querySelector("#expandedToggle").classList.remove("hidden")
        document.querySelector("#expandedToggle").classList.add("show")
    }
})


// === Search on key change ===
const debounce = (func, delay) => {
    let timeOutId;
    return function () {
        if (timeOutId) {
            clearTimeout(timeOutId)
        }
        timeOutId = setTimeout(() => {
            func()
        }, delay)
    }
}

document.querySelector("#innerTextBox").addEventListener("keyup", debounce(filter, 300))


async function filter() {
    document.querySelector("#suggestedList").innerHTML = "";
    let innerSearch = document.querySelector("#innerTextBox").value;

    if (!innerSearch) {
        return;
    }

    // === Clinic geojson data ===
    let clinicsResponse = await axios.get("geojson/chas_clinics.geojson");
    let clinicsData = clinicsResponse.data.features

    for (let clinic of clinicsData) {
        // === Clinic details ===
        let clinicName = extractDetail(clinic, 2).toUpperCase();
        let clinicTelephone = extractDetail(clinic, 4);
        clinicTelephone = clinicTelephone.substring(0, 4) + " " + clinicTelephone.substring(4, clinicTelephone.length)
        let clinicPostal = extractDetail(clinic, 5)
        let clinicBlock = extractDetail(clinic, 7);
        let clinicStreetName = extractDetail(clinic, 10).toUpperCase();

        let clinicLocation = clinic.geometry.coordinates

        if (clinicName.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1) {
            newElement = document.createElement("li")
            newElement.classList.add("suggestedResults")
            newElement.innerHTML = clinicName
            newElement.setAttribute('data-lat', clinicLocation[1]);
            newElement.setAttribute('data-lon', clinicLocation[0]);
            newElement.setAttribute('data-clinicName', clinicName.toUpperCase());
            newElement.setAttribute('data-clinicTelephone', clinicTelephone)
            newElement.setAttribute('data-clinicPostal', clinicPostal)
            newElement.setAttribute('data-clinicBlock', clinicBlock)
            newElement.setAttribute('data-clinicStreetName', clinicStreetName)
            document.querySelector("#suggestedList").appendChild(newElement);
            if (document.querySelector(".suggestedResults") != null) {
                // === Close Warning Alert ===
                validationMsg.classList.remove("show")
                validationMsg.classList.add("hidden")
            }
            if (document.querySelector(".suggestedResults")){
                document.querySelector("#innerTextBox").style.borderRadius = "5px 0 0 0px"
            } 
        }
    }

    // === Pharmacy geojson Data ===
    let pharmacyResponse = await axios.get("geojson/retail_pharmacy.geojson");
    let pharmacyData = pharmacyResponse.data.features

    for (let pharmacy of pharmacyData) {

        // === Pharmacy details ===
        let pharmacyName = extractDetail(pharmacy, 7).toUpperCase();
        let postalCode = extractDetail(pharmacy, 1);
        let roadName = extractDetail(pharmacy, 5).toUpperCase();

        let pharmacyLocation = pharmacy.geometry.coordinates

        if (pharmacyName.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1) {
            newElement = document.createElement("li")
            newElement.classList.add("suggestedResults")
            newElement.innerHTML = pharmacyName
            newElement.setAttribute('data-lat', pharmacyLocation[1]);
            newElement.setAttribute('data-lon', pharmacyLocation[0]);
            newElement.setAttribute('data-pharmacyName', pharmacyName.toUpperCase())
            newElement.setAttribute('data-postalCode', postalCode)
            newElement.setAttribute('data-roadName', roadName)
            document.querySelector("#suggestedList").appendChild(newElement);
            if (document.querySelector(".suggestedResults") != null) {
                // Close Warning Alert
                validationMsg.classList.remove("show")
                validationMsg.classList.add("hidden")
            }
            if (document.querySelector(".suggestedResults")){
                document.querySelector("#innerTextBox").style.borderRadius = "5px 0 0 0px"
            } 
        }
    }


    // === Highlighting search suggestions on mouse interaction ===
    // === Clicking on suggestion sets map to location and show description ===
    for (let each_suggestedResult of document.querySelectorAll(".suggestedResults")) {
        each_suggestedResult.addEventListener("mouseover", function (e) {
            e.target.style.backgroundColor = "rgba(0,0,0,0.2)"
            e.target.style.cursor = "pointer"
        })
        each_suggestedResult.addEventListener("mouseout", function (e) {
            e.target.style.backgroundColor = "white"
        })
        each_suggestedResult.addEventListener("click", function (e) {
            map.setView([e.target.getAttribute('data-lat'), e.target.getAttribute('data-lon')], 20);
            document.querySelector("#suggestedList").innerHTML = ""
            if (!document.querySelector(".suggestedResults")){
                document.querySelector("#innerTextBox").style.borderRadius = "5px 0 0 5px"
            } 
            
            document.querySelector("#innerTextBox").value = each_suggestedResult.innerText

            // 1. Show clinic description
            let clinicName = e.target.getAttribute('data-clinicName')
            let lat = e.target.getAttribute('data-lat')
            let lon = e.target.getAttribute('data-lon')

            if (clinicName != null) {
                let clinicBlock = e.target.getAttribute('data-clinicBlock')
                let clinicStreetName = e.target.getAttribute('data-clinicStreetName')
                let clinicPostal = e.target.getAttribute('data-clinicPostal')
                let clinicTelephone = e.target.getAttribute('data-clinicTelephone')
                displayClinicDescription(clinicName, clinicBlock, clinicStreetName, clinicPostal, clinicTelephone, lat, lon);

            } else {
                // 2. Show pharmacy description
                let pharmacyName = e.target.getAttribute('data-pharmacyName')
                let postalCode = e.target.getAttribute('data-postalCode')
                let roadName = e.target.getAttribute('data-roadName')
                displayPharmacyDescription(pharmacyName, roadName, postalCode, lat, lon);
            }
        })
    }
}

// === Close location tracking box when close button is clicked ===
document.querySelector("#closeBtn").addEventListener("click", function () {
    document.querySelector("#content").style.display = "none";
    document.querySelector("#locationTrackingContainer").style.display = "none";
    document.querySelector("#map").style.zIndex = "0";
    document.querySelector("#descriptionBox").style.zIndex = "1";
    document.querySelector("#innerContainer").style.zIndex = "2";
    document.querySelector("#searchContentBox").style.zIndex = "1";
    document.querySelector("#toggleLayer").style.zIndex = "1";
    document.querySelector("#brandBar").style.zIndex = "1";
})

// === About Us Popup ===
document.querySelector("#aboutUsBtn").addEventListener("click", function () {
    document.querySelector("#aboutUsOverlay").style.display = "flex"
    document.querySelector("#searchContentBox").style.zIndex = "-1"
})

// === Close About Us Popup ===
document.querySelector("#aboutUsCloseBtn").addEventListener("click", function () {
    document.querySelector("#aboutUsOverlay").style.display = "none"
    document.querySelector("#searchContentBox").style.zIndex = "1"
})




