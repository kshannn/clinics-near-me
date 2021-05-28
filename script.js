// DOMContentLoaded
window.addEventListener("DOMContentLoaded", async function () {
    let listOfLocations = [];

    // Clinic geojson data
    let clinicsResponse = await axios.get("geojson/chas-clinics.geojson");
    let clinicsData = clinicsResponse.data.features

    // Customize clinic icon
    let clinicIcon = L.icon({
        iconUrl: 'images/clinic.png',
        iconSize: [38, 38], // size of the icon
        iconAnchor: [-5, -5], // point of the icon which will correspond to marker's location
        popupAnchor: [20, -10] // point from which the popup should open relative to the iconAnchor
    });

    // Create clinic cluster 
    let clinicClusterLayer = L.markerClusterGroup();

    // Add clinic cluster to clinic layer
    let clinicGroup = L.layerGroup();
    clinicClusterLayer.addTo(clinicGroup);
    clinicGroup.addTo(map);

    for (let clinic of clinicsData) {

        // Clinic details
        let clinicName = extractDetail(clinic, 2).toUpperCase();
        listOfLocations.push(clinicName)
        let clinicTelephone = extractDetail(clinic, 4);
        let clinicPostal = extractDetail(clinic, 5)
        let clinicBlock = extractDetail(clinic, 7);
        let clinicStreetName = extractDetail(clinic, 10).toUpperCase();


        // Add clinics into map via coordinates
        let clinicLocation = clinic.geometry.coordinates
        let clinicMarker = L.marker([clinicLocation[1], clinicLocation[0]], { icon: clinicIcon })
        clinicMarker.addTo(clinicClusterLayer).bindPopup(clinicName)

        let lat = clinicLocation[1]
        let lon = clinicLocation[0]
        

        // Show big description and focus on clinic when it is clicked
        clinicMarker.addEventListener("click", function () {
            displayClinicDescription(clinicName,clinicBlock,clinicStreetName,clinicPostal,clinicTelephone, lat, lon);
            
            // Focus on clicked clinic 
            map.setView([clinicLocation[1], clinicLocation[0]], 20);

            if (document.querySelector("#descriptionBox").classList.contains("hidden")) {
                document.querySelector("#descriptionBox").classList.remove("hidden");
                document.querySelector("#descriptionBox").classList.add("show");
                document.querySelector("#descriptionBox").classList.add("statusShown");
            }

        })

    }




    // Pharmacy geojson Data
    let pharmacyResponse = await axios.get("geojson/retail-pharmacy.geojson");
    var pharmacyData = pharmacyResponse.data.features

    // Customize pharmacy icon
    let pharmacyIcon = L.icon({
        iconUrl: 'images/pharmacy.png',
        iconSize: [38, 38], // size of the icon
        iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
        popupAnchor: [20, -10] // point from which the popup should open relative to the iconAnchor
    });

    // Create pharmacy cluster layer
    let pharmacyClusterLayer = L.markerClusterGroup();

    // Add pharmacy cluster to pharmacy layer
    let pharmacyGroup = L.layerGroup();
    pharmacyClusterLayer.addTo(pharmacyGroup);
    pharmacyGroup.addTo(map);


    for (let pharmacy of pharmacyData) {

        // Pharmacy details
        let pharmacyName = extractDetail(pharmacy,7).toUpperCase();
        listOfLocations.push(pharmacyName)
        let postalCode = extractDetail(pharmacy,1);
        let roadName = extractDetail(pharmacy,5).toUpperCase();


        // Add pharmacies into map via coordinates
        let pharmacyLocation = pharmacy.geometry.coordinates
        let pharmacyMarker = L.marker([pharmacyLocation[1], pharmacyLocation[0]], { icon: pharmacyIcon })
        pharmacyMarker.addTo(pharmacyClusterLayer).bindPopup(pharmacyName)

        let lat = pharmacyLocation[1]
        let lon = pharmacyLocation[0]

        // Show big description and focus on pharmacy when it is clicked
        pharmacyMarker.addEventListener("click", function () {
          
            displayPharmacyDescription(pharmacyName,roadName,postalCode,lat,lon);

            // Focus on clicked pharmacy
            map.setView([pharmacyLocation[1], pharmacyLocation[0]], 20);


            if (document.querySelector("#descriptionBox").classList.contains("hidden")) {
                document.querySelector("#descriptionBox").classList.remove("hidden");
                document.querySelector("#descriptionBox").classList.add("show");
                document.querySelector("#descriptionBox").classList.add("statusShown");
            }

        })
    } // end of pharmacy loop

   

    
    

    //Clicking on search suggestion zooms to map location
    document.querySelector("#innerSearchBtn").addEventListener("click", function () {
        document.querySelector("#suggestedList").innerHTML = ""

        let innerSearch = document.querySelector("#innerTextBox").value;
        
        // validation check
        // if substring of search does not match any locations, 
        let similarResult = 0;
        for (each_location of listOfLocations){
            if (each_location.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1){
                similarResult ++
            } 
        }
        if (similarResult == 0){
            showAlert();

        }

        

        // if no search term is keyed
        if (innerSearch == "") {
            showAlert();
            return;
        } 

        // If at least one li suggestion is shown
        


            
        for (let clinic of clinicsData) {
            

            // Clinic details
            let clinicName = extractDetail(clinic, 2).toUpperCase();
            let clinicTelephone = extractDetail(clinic, 4);
            let clinicPostal = extractDetail(clinic, 5)
            let clinicBlock = extractDetail(clinic, 7);
            let clinicStreetName = extractDetail(clinic, 10).toUpperCase();


            let clinicLocation = clinic.geometry.coordinates
            let lat = clinicLocation[1]
            let lon = clinicLocation[0]

            if (innerSearch.toUpperCase() == clinicName.toUpperCase()) {
                // Focus on clicked clinic 
                map.setView([clinicLocation[1], clinicLocation[0]], 20);
                displayClinicDescription(clinicName,clinicBlock,clinicStreetName,clinicPostal,clinicTelephone,lat,lon);
            } else if (clinicName.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1) {
                // Jump to region
                map.setView([clinicLocation[1], clinicLocation[0]], 20);
                displayClinicDescription(clinicName,clinicBlock,clinicStreetName,clinicPostal,clinicTelephone,lat,lon);
                                
            }
        }

        // validation check
        if (innerSearch == "") {
            showAlert();
            return
        } 


        for (let pharmacy of pharmacyData) {
            // Pharmacy details
            let pharmacyName = extractDetail(pharmacy,7).toUpperCase();
            let postalCode = extractDetail(pharmacy,1);
            let roadName = extractDetail(pharmacy,5).toUpperCase();


            let pharmacyLocation = pharmacy.geometry.coordinates
            let lat = pharmacyLocation[1]
            let lon = pharmacyLocation[0]

            if (innerSearch.toUpperCase() == pharmacyName.toUpperCase()) {
                // Focus on clicked pharmacy
                map.setView([pharmacyLocation[1], pharmacyLocation[0]], 20);
                
                displayPharmacyDescription(pharmacyName,roadName,postalCode,lat,lon);


            } else if (pharmacyName.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1) {
                // Jump to region
                map.setView([pharmacyLocation[1], pharmacyLocation[0]], 20); 
                displayPharmacyDescription(pharmacyName,roadName,postalCode,lat,lon)
                
            
            } 

        }



        // CSS styling of search suggestions upon interaction
        // Clicking on suggestions zooms to location
        for (let each_suggestedResult of document.querySelectorAll(".suggestedResults")) {
            each_suggestedResult.addEventListener("mouseover", function (event) {
                event.target.style.backgroundColor = "rgba(0,0,0,0.2)"
                event.target.style.cursor = "pointer"
            })
            each_suggestedResult.addEventListener("mouseout", function (event) {
                event.target.style.backgroundColor = "white"
            })
            each_suggestedResult.addEventListener("click", function (e) {
                map.setView([e.target.getAttribute('data-lat'), e.target.getAttribute('data-lon')], 20);
                document.querySelector("#suggestedList").innerHTML = ""
                document.querySelector("#innerTextBox").value = each_suggestedResult.innerText
            })
        }

    })


    // Toggle buttons
    let clinicBtn = document.querySelector("#toggleClinicBtn")
    clinicBtn.addEventListener("change", function () {
        if (map.hasLayer(clinicGroup)) {
            map.removeLayer(clinicGroup)
        } else {
            map.addLayer(clinicGroup)
        }
    })

    // map.removeLayer(pharmacyGroup); // hide pharmacy markers by default

    let pharmacyBtn = document.querySelector("#togglePharmacyBtn")
    pharmacyBtn.addEventListener("change", function () {
        if (map.hasLayer(pharmacyGroup)) {
            map.removeLayer(pharmacyGroup)
        } else {
            map.addLayer(pharmacyGroup)
        }
    })


}) //end of DOMContentLoaded









//Toggle Layer Button
document.querySelector("#toggleLayerBtn").addEventListener("click", function () {
    if (document.querySelector("#expandedToggle").classList.contains("show")) {
        document.querySelector("#expandedToggle").classList.remove("show")
        document.querySelector("#expandedToggle").classList.add("hidden")
    } else {
        document.querySelector("#expandedToggle").classList.remove("hidden")
        document.querySelector("#expandedToggle").classList.add("show")
    }
})



// Search on key change
// Testing debounce

const debounce = (fn, delay) => {
    let timeOutId;
    return function (...args) {

        if (timeOutId) {
            clearTimeout(timeOutId)
        }
        timeOutId = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}



document.querySelector("#innerTextBox").addEventListener("keyup", debounce(filter, 300))



// Search on key change
// document.querySelector("#innerTextBox").addEventListener("keyup", filter)


async function filter() {
    // let combinedList = [];
    document.querySelector("#suggestedList").innerHTML = "";

    let innerSearch = document.querySelector("#innerTextBox").value;

    
    // Clinic geojson data
    let clinicsResponse = await axios.get("geojson/chas-clinics.geojson");
    let clinicsData = clinicsResponse.data.features


    for (let clinic of clinicsData) {
        // Clinic details
        let clinicName = extractDetail(clinic, 2).toUpperCase();
        let clinicTelephone = extractDetail(clinic, 4);
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
            newElement.setAttribute('data-clinicName',clinicName.toUpperCase());
            newElement.setAttribute('data-clinicTelephone',clinicTelephone)
            newElement.setAttribute('data-clinicPostal',clinicPostal)
            newElement.setAttribute('data-clinicBlock',clinicBlock)
            newElement.setAttribute('data-clinicStreetName',clinicStreetName)
            document.querySelector("#suggestedList").appendChild(newElement);
            if(document.querySelector(".suggestedResults")!= null){
                // Close Warning Alert
                validationMsg.classList.remove("show")
                validationMsg.classList.add("hidden")
            }
            // combinedList.push(newElement)

            // // if there is list suggestions, change border radius of bottom left to none
            // if (document.querySelector(".suggestedResults")){
            //     document.querySelector("#innerTextBox").style.borderRadius = "5px 0 0 0px"
            // } 
        }
    }

    

    // // Pharmacy geojson Data
    let pharmacyResponse = await axios.get("geojson/retail-pharmacy.geojson");
    let pharmacyData = pharmacyResponse.data.features

    for (let pharmacy of pharmacyData) {

        // Pharmacy details
        let pharmacyName = extractDetail(pharmacy,7).toUpperCase();
        let postalCode = extractDetail(pharmacy,1);
        let roadName = extractDetail(pharmacy,5).toUpperCase();
        

        let pharmacyLocation = pharmacy.geometry.coordinates

        if (pharmacyName.toUpperCase().indexOf(innerSearch.toUpperCase()) > -1){
            newElement = document.createElement("li")
            newElement.classList.add("suggestedResults")
            newElement.innerHTML = pharmacyName
            newElement.setAttribute('data-lat', pharmacyLocation[1]);
            newElement.setAttribute('data-lon', pharmacyLocation[0]);
            newElement.setAttribute('data-pharmacyName',pharmacyName.toUpperCase())
            newElement.setAttribute('data-postalCode',postalCode)
            newElement.setAttribute('data-roadName',roadName)
            document.querySelector("#suggestedList").appendChild(newElement);
            if(document.querySelector(".suggestedResults")!= null){
                // Close Warning Alert
                validationMsg.classList.remove("show")
                validationMsg.classList.add("hidden")
            }
            // combinedList.push(newElement)
        }

    }

    
    // for (let result of combinedList){
    //     console.log(result.innerHTML)
    // }
    // console.log(combinedList)
    // console.log(combinedList.sort())

    // CSS styling of search suggestions upon interaction
    // Clicking on suggestions zooms to location
    for (let each_suggestedResult of document.querySelectorAll(".suggestedResults")) {
        each_suggestedResult.addEventListener("mouseover", function (event) {
            event.target.style.backgroundColor = "rgba(0,0,0,0.2)"
            event.target.style.cursor = "pointer"
        })
        each_suggestedResult.addEventListener("mouseout", function (event) {
            event.target.style.backgroundColor = "white"
        })
        each_suggestedResult.addEventListener("click", function (e) {
            map.setView([e.target.getAttribute('data-lat'), e.target.getAttribute('data-lon')], 20);
            document.querySelector("#suggestedList").innerHTML = ""
            document.querySelector("#innerTextBox").value = each_suggestedResult.innerText
            
            // TODO: show description box when clicked

            // 1. show clinic desc
            
            let clinicName = e.target.getAttribute('data-clinicName')
            let lat = e.target.getAttribute('data-lat')
            let lon = e.target.getAttribute('data-lon')

            if(clinicName != null){
                let clinicBlock = e.target.getAttribute('data-clinicBlock')
                let clinicStreetName = e.target.getAttribute('data-clinicStreetName')
                let clinicPostal = e.target.getAttribute('data-clinicPostal')
                let clinicTelephone = e.target.getAttribute('data-clinicTelephone')
                displayClinicDescription(clinicName,clinicBlock,clinicStreetName,clinicPostal,clinicTelephone,lat,lon);
    
            } else{
                 // 2. show pharmacy desc
                let pharmacyName = e.target.getAttribute('data-pharmacyName')
                let postalCode = e.target.getAttribute('data-postalCode')
                let roadName = e.target.getAttribute('data-roadName')
                displayPharmacyDescription(pharmacyName,roadName,postalCode,lat,lon);
            }

           


        })
    }
    

}



// Close overlay
document.querySelector("#closeBtn").addEventListener("click",function(){
    document.querySelector("#content").style.display = "none";
    document.querySelector("#contentContainer").style.display = "none";
    document.querySelector("#map").style.zIndex = "0";
    document.querySelector("#descriptionBox").style.zIndex = "1";
    document.querySelector("#innerContainer").style.zIndex = "2";
    document.querySelector("#innerContentBox").style.zIndex = "1";
    document.querySelector("#toggleLayer").style.zIndex = "1";
    document.querySelector("#brandBar").style.zIndex = "1";
})




function setCurrentLocation(){
    // 1. close overlay on click
    document.querySelector("#content").style.display = "none";
    document.querySelector("#contentContainer").style.display = "none";
    document.querySelector("#map").style.zIndex = "0";
    document.querySelector("#descriptionBox").style.zIndex = "1";
    document.querySelector("#innerContainer").style.zIndex = "2";
    document.querySelector("#innerContentBox").style.zIndex = "1";
    document.querySelector("#toggleLayer").style.zIndex = "1";
    document.querySelector("#brandBar").style.zIndex = "1";

    // 2. set view to current location
    map.locate({setView: true, maxZoom: 20});

    // 3. Add "you are here" in current location
    function youAreHere(e) {
        // 3a. Customize person icon
        let personIcon = L.icon({
            iconUrl: 'images/person.png',
            iconSize: [50, 45], // size of the icon
            iconAnchor: [23, 20], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
        });
    
        L.marker(e.latlng, {icon:personIcon}).addTo(map).bindPopup("You are here").openPopup();
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




// About Us Popup
document.querySelector("#aboutUsBtn").addEventListener("click", function(){
    document.querySelector("#aboutUsOverlay").style.display = "flex"
    document.querySelector("#innerContentBox").style.zIndex = "-1"
})

// Close About Us Popup
document.querySelector("#aboutUsCloseBtn").addEventListener("click", function(){
    document.querySelector("#aboutUsOverlay").style.display = "none"
    document.querySelector("#innerContentBox").style.zIndex = "1"
})



