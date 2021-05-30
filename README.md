# CHAS Clinic Finder
<img src='images/all_devices_display.png' style='display:block'>


[Live Demo](https://kshannn.github.io/clinics-near-me/)

## Project Summary

**Project Context**

The _CHAS Clinic Finder_ is an interactive map developed to allow its users to easily search for CHAS clinics around Singapore. CHAS refers to Community Health Assist Scheme (CHAS). Under this scheme, eligible citizens would be able to receive subsidized healthcare treatments in the participating clinic outlets.

**Organisational Goals**

The app aims to provide a service to ease the process of users in their search for CHAS clinics through filtering out clinics that are not associated with CHAS.

**User Goals**

The aim of users is to obtain subsidized healthcare services. The app seeks to help users achieve their needs by providing a quick and user-friendly map to locate nearby CHAS clinic.

**Justification for the App**

While there are location information of CHAS clinic online, the format in which the information are currently presented is not user-friendly (e.g. spreadsheet). Such hurdles could create unnecessary frustration especially for users that are seeking for medical attention urgently. As such, having an interactive map that allow users to see all the locations of CHAS clinics at a glance as well as having a built-in search bar could ease the search process.




## Project Complexity

[Project Complexity Matrix](https://github.com/kshannn/clinics-near-me/blob/e28a549dc7c0a7d06b959cba2dd1d22b4b90bd61/scoring/project_complexity.pdf)

## UX/UI

#### **Strategy**
_Organisation_
* Objective: Provide a service to ease the process of users in their search for CHAS clinics

_User_
* Objective: To receive medical attention and/or healthcare service
* Needs: Quick way to locate nearby CHAS clinic 
* Demographics:
    * Individuals in their middle adulthood
    * From lower-income family
    * Sufficient literacy in using technological devices
* Pain point: Have to seek medical attention but information online cannot be easily accessed


#### **Scope**

_Functional Specifications_
* Search for clinics
* Turn on location service to detect nearby clinics
* Make call to clinics

_Content requirements_
* Information about the application
* Information about CHAS
* Details of clinic and pharmacies

_Non-functional requirements_
* Mobile responsiveness
* Performance


#### **Structure**

* The CHAS Clinic Finder application is structured using a tree hierarchy.
* The navigation bar includes "About Us" to provide more details about the application
* The application uses language that is easy for users to understand and contains no technical jargons

#### **Skeleton**

[Wireframes for mobile, tablet, and laptop display](https://github.com/kshannn/clinics-near-me/blob/a23464666e5f3c939614abe3e776bc484ec67397/wireframes/clinic_finder_mockup.pdf)

#### **Surface**

Colours

<img src='images/colour_palette.png' style='display:block'>
<br>

* The main colour scheme of the app are the different shades of blue as depicted above. 
As the colour blue is often associated with trust and stability, a blue colour scheme was chosen to associate feelings of trust towards the app. In times of emergency (e.g. urgent medical attention is required), it is important that users trust that the app would function properly in helping them search for clinics.
* White font is generally used to contrast with the darker color scheme. This is to make it easier to read for users, where majority are presumed to be in their middle adulthood.


Font
* The font used for the brand name is in san-serif to match the brand logo
* Font size is set to be big to allow users to see better.
* The use of san-serif makes words easier to read, which can be important for older users.

Icons in place of markers
* Instead of using the custom marker designs provided by Leaflet, the markers are replaced with icons that matches the marker (e.g. pharmacy markers are represented with a pill icon).This makes it easier to make the association using the customized icons.

## **Features**

* User would be asked if they would allow the app access to their current location. Upon agreeing, the app would track their current location and immediatelly show where they are on the Leaflet map
* When user does not search for anything or search for an input that does not exist, they would be prompted by an alert message to enter a valid input. The alert message can be dismissed using the close button or when the user re-enters a search term (This feature is implemented using the bootstrap alert class)
* When user searches with the exact clinic or pharmacy name, the map would be set to the targeted place immediatelly.
* When user searches for part of the clinic or pharmacy name, the map would be set to the most similar result available.
* As user types in a search term, similar search results would be suggested and updated at every key press. This feature is paired together with the debounce function so that the function waits before firing instead of updating the search results at every key press.
* Clicking directly on a suggested search result would set the map to the targeted location.
* When a location is being searched, or when user clicks on a marker, a popup describing the name and details of the clinic or pharmacy would appear.
* In each of the description box, users can toggle an on/off button to display a 500m radius circle around the location they are currently at or viewing. This circle allows them to estimate how far they are from other clinics or pharmacies. This can be useful for those who want to be able to easily see which clinics are closest to them, for those who want to find a nearby pharmacy to get additional healthcare supplies, or for those who want to try out other clinic outlets should there be a long queue for the one they are currently at.
* Clicking from one marker to another marker would change the description displayed in the description box.
* There is a feature on the right hand corner of the screen to toggle the clinic and pharmacy layers on and off depending on which markers users would like to view. (This is implemented using leaflet layer group feature)
* Markers within close proximty are clustered together. (This is implemented with leaflet clustering feature)

_Limitations and future implementations_
* Due to leaflet clustering feature, when map is set to view a coordinate, the exact location at the coordinate is not shown but instead a cluster number is shown. Using a higher zoom setting only resolves the problem sometimes.
* Currently, it takes some time to load the location tracking. In the future, I would like to improve the load time for location tracking or add a loading icon to indicate that location tracking is being loaded in the background.
* Include waiting time and vacancies at each clinic. To my knowledge, there is currently no API that provides these details .
* Some names of clinics/pharmarcies are the same as they are chain outlets. This causes repetition of search suggestions. In the future, I would like to differentiate this outlets by including their location details in the suggestions as well.


## **Technologies Used**

* HTML5
    * To create the framework of the web app
* CSS3
    * To style various elements throughout the web app
* JavaScript
    * To include interactive elements throughout the web app
* [Bootstrap v4.6](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
    * To create toggle buttons and alert popup
* [JQuery](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
    * To apply bootstrap properties to dynamic innerHTML
* [Leaflet](https://leafletjs.com/)
    * To create the map of Singapore
    * To add in markers
    * To create layers and clusters for markers
    * To add current location tracking function
* [Font Awesome](https://fontawesome.com/)
    * For icons in the description box
* [Flaticon](https://www.flaticon.com/)
    * For customized marker icons
* [Adobe Color](https://color.adobe.com/create/color-wheel)
    * To create a colour theme for the app
* [Git](https://git-scm.com/)
    * For version control
* [GitHub](http://github.com)
    * To store source code
* [Visual Studio Code](https://code.visualstudio.com/)
    * To edit source code
    * To view changes made to source code live
* [Balsamiq Mockups 3](https://balsamiq.com/)
    * To create wireframes
* [Netlify](https://www.netlify.com/)
    * To deploy web app
* [Google Font](https://fonts.google.com/)
    * To select font families used for web app (i.e. Noto Sans)
* [Multi Device Website Mockup Generator](https://techsini.com/multi-mockup/index.php)
    * To display screen-responsiveness of website across different devices

## **Deployment**

The web app is hosted using _____ .

**Dependencies**

* [Data.gov.sg](https://data.gov.sg/)
    * To obtain GeoJSON files for CHAS clinic locations and pharmacy locations
* [Axios](https://cdnjs.com/libraries/axios)
    * To call API



## **Credits**

* Code for debounce function
    * Taken and edited from techsith's YouTube video - ["Debounce in Javascript"](https://youtu.be/B1P3GFa7jVc)

* Leaflet markers' icons
    * Downloaded and edited from [Flaticon](https://www.flaticon.com/)

* Brand logo
    * Taken end edited from [CHAS website](https://www.chas.sg/default.aspx?type=public)

* Details about Community Health Assist Scheme (CHAS)
    * Extracted from [CHAS website](https://www.chas.sg/content.aspx?id=303)

