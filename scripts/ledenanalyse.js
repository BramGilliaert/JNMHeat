'use strict';

var lokaalIcon = L.icon({iconUrl: 'img/Lokaal.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var winkelIcon = L.icon({iconUrl: 'img/Winkel.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var bondssecIcon = L.icon({iconUrl: 'img/Bondssec.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var geoCenterIcon = L.icon({iconUrl: 'img/GeoCenter.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});

var activiteitIcon = L.icon({iconUrl: 'img/VoorbijeAct.png', iconSize: [15,15], iconAnchor: [7, 7], popupAnchor: [0,0]});
var activiteitenCenterIcon = L.icon({iconUrl: 'img/ActiviteitCenterIcon.png', iconSize: [10,10], iconAnchor: [4, 5], popupAnchor: [0,0]});

var activiteitGeplandIcon = L.icon({iconUrl : 'img/ToekomstAct.png', iconSize: [15,15], icondAnchor: [0,0], popupAnchor: [0,0]});



function createPin(latlon, persons, layer){
	if(latlon == undefined){
		console.warn("undefined latlon for", persons);
		return;
	}

	if(!(latlon[0] && latlon[1])){
		return;
	}

	if(persons.length == 0){
		return;
	}


	var msg = "";
	for(var i = 0; i < persons.length; i ++){
		msg += persons[i][0]+"<br />";
	}

	var ic = activiteitIcon;
	if(persons.length > 1){
		ic = activiteitGeplandIcon;
		msg += "<b>"+persons.length+" in total</b>";
	}

	var pin = L.marker([parseFloat(latlon[0]), parseFloat(latlon[1])], {icon : ic});
	pin.bindPopup(msg);
	layer.addLayer(pin);


}

function addContact(person, layer){

	// 0: name
	// 1: email
	// 2: street
	// 3: postal code
	// 4: city
	// 5: phone
	// 6: birthday
	// 7: "": blank
	// 8: "Gewoon lid"/"Piep"/"ini"
	// 9: "Nee"|"Ja" is main chapter

	// 10: latitude
	// 11: longitude. Requires preprocessing
	var street = person[2];
	var postal_code =  person[3];
	var city = person[4];
	if(person[10] == "[]"){
		return null;
	}

	/*var lat_lon = queryOSM(street, postal_code, city);
	console.log(lat_lon);
	if(!(lat_lon && lat_lon[0] && lat_lon[1])){
		console.log("Lookup failed!");
		return null;
	}*/

	person.latlon = [parseFloat(person[10]), parseFloat(person[11])];

	return person;
}

function analyseContacts(csvPath){
	var layer = newLayer("Leden");
	console.log("Loading", csvPath);

	var client = new XMLHttpRequest();
	client.open('GET', csvPath);
	client.onreadystatechange = function() {
		console.log("Readystate changed: ", client.readyState);

		var data = client.responseText;
		if(data == "" || client.readyState != 4){
			return;
		}
		data = $.csv.toArrays(data);
		console.log("parsed data", data);
		document.getElementById("totaal").innerHTML= data.length - 1;

		var successess = [];
		var failed = 0;
		layer.show();

		for(var i = 1; i < data.length; i++){

			var person = addContact(data[i], layer);
			if(person){
				successess.push(person);
			}else{
				failed ++;
			}

			document.getElementById("geladen").innerHTML= successess.length;
			document.getElementById("failed").innerHTML= failed;
			document.getElementById("resterend").innerHTML= data.length - (i+1);

		}

		cluster = createCluster(successess);
		console.log(cluster);

		forEachInOverview(cluster, function(latlon, persons){
			createPin(persons[0].latlon, persons, layer);
		});
		layer.show();

	}
	client.send();
	return layer;
}


function renderLeden(){
	var filePath = document.getElementById('filename').value;
	analyseContacts(filePath);

}
