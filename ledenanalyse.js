
	var lokaalIcon = L.icon({iconUrl: 'img/Lokaal', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var winkelIcon = L.icon({iconUrl: 'img/Winkel', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var bondssecIcon = L.icon({iconUrl: 'img/Bondssec', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var geoCenterIcon = L.icon({iconUrl: 'img/GeoCenter', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});	

	var activiteitIcon = L.icon({iconUrl: 'img/VoorbijeAct', iconSize: [15,15], iconAnchor: [7, 7], popupAnchor: [0,0]});
	var activiteitenCenterIcon = L.icon({iconUrl: 'img/ActiviteitCenterIcon', iconSize: [10,10], iconAnchor: [4, 5], popupAnchor: [0,0]});
		
	var activiteitGeplandIcon = L.icon({iconUrl : 'img/ToekomstAct', iconSize: [15,15], icondAnchor: [0,0], popupAnchor: [0,0]});

function createCluster(points){
	var cluster = new Object();
	
	for(var i = 0; i < points.length; i++){
		var latlon = points.latlon[i];
		if(cluster[ latlon ] == null){
			cluster[ latlon ] = [];
		}
		cluster[ latlon ].push(points[i]);
	}
	return cluster;

}


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
	console.log("createPin: ", latlon, persons);

	pin = L.marker(latlon, {icon : activiteitIcon});

	var msg = "";
	for(var i = 0; i < persons.length; i ++){
		msg += persons[i][0]+"<br />";
	}
	msg += "<b>"+persons.length+" in total</b>";
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
	
	var street = person[2];
	var postal_code =  person[3];
	var city = person[4];
	console.log("Getting position of ", person[0]);
	var lat_lon = queryOSM(street, postal_code, city);
	console.log(lat_lon);
	if(!(lat_lon && lat_lon[0] && lat_lon[1])){
		console.log("Lookup failed!");
		return null;
	}

	person.latlon = lat_lon;

	return person;
}

function analyseContacts(csvPath){
	var layer = newLayer("Leden");
	console.log("Loading", csvPath);

	var client = new XMLHttpRequest();
	client.open('GET', csvPath);
	client.onreadystatechange = function() {

		if(client.readyState !== XMLHttpRequest.DONE || client.status !== 200) {
			return;
		}


		var data = client.responseText;
		data = $.csv.toArrays(data);
		console.log(data);
		document.getElementById("totaal").innerHTML= data.length - 1;

		var successess = [];
		var failed = 0;

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

		forEachInOverview(cluster, function(latlon, persons){
			createPin(latlon, persons, layer);
		});

		layer.show();
	}
	client.send();
	return layer;
}
