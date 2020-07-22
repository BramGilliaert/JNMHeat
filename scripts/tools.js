'use strict';

// fancy icons to show
var lokaalIcon = L.icon({iconUrl: 'img/Lokaal.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var winkelIcon = L.icon({iconUrl: 'img/Winkel.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var bondssecIcon = L.icon({iconUrl: 'img/Bondssec.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0], className: 'bondssec'});
var geoCenterIcon = L.icon({iconUrl: 'img/GeoCenter.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});

var geoCenterIcon_green = L.icon({iconUrl: 'img/GeoCenter_green.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_orange = L.icon({iconUrl: 'img/GeoCenter_orange.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_darkblue = L.icon({iconUrl: 'img/GeoCenter_darkblue.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_red = L.icon({iconUrl: 'img/GeoCenter_red.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_lightgreen = L.icon({iconUrl: 'img/GeoCenter_lightgreen.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_brown = L.icon({iconUrl: 'img/GeoCenter_brown.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_pink = L.icon({iconUrl: 'img/GeoCenter_pink.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_blue = L.icon({iconUrl: 'img/GeoCenter_blue.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_yellow = L.icon({iconUrl: 'img/GeoCenter_yellow.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_darkgreen = L.icon({iconUrl: 'img/GeoCenter_darkgreen.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});
var geoCenterIcon_grey = L.icon({iconUrl: 'img/GeoCenter_grey.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});

var cloud_filled = L.icon({iconUrl: 'img/cloud_filled.png', iconSize: [30,30], iconAnchor: [15, 15], popupAnchor: [0, -15]});
var cloud_empty = L.icon({iconUrl: 'img/cloud_empty.png', iconSize: [30,30], iconAnchor: [15, 15], popupAnchor: [0, -15]});

var activiteitIcon = L.icon({iconUrl: 'img/Act.png', iconSize: [15,15], iconAnchor: [7, 7], popupAnchor: [0,0]});

var activiteitGeplandIcon = L.icon({iconUrl : 'img/Act.png', iconSize: [15,15], icondAnchor: [0,0], popupAnchor: [0,0]});


var afdelingRegioMapping = { "Brugge": "West-Vlaanderen", "Kortrijk": "West-Vlaanderen", "Roeselare": "West-Vlaanderen", 
							 "Poekebeek": "West-Vlaanderen", "Diksmuide": "West-Vlaanderen", "Westland": "West-Vlaanderen", 
							 "Leievallei": "Lyscaldia", "Gent West": "Lyscaldia", "Gent Oost": "Lyscaldia", 
							 "Onderstebovenschelde": "Lyscaldia", "Moervallei": "Benedenschelde", "Durmeland": "Benedenschelde",
							 "Klein-Brabant": "Benedenschelde", "'S Heerenbosch": "Benedenschelde", "Vlaamse Ardennen": "Zuidoost-Vlaanderen",
							 "Land Van Aalst": "Zuidoost-Vlaanderen", "Zottegem": "Zuidoost-Vlaanderen", 
							 "Ninove-Geraardsbergen": "Zuidoost-Vlaanderen",  "Pajottenland": "Onderbroexxel", "Zuidwest-Brabant": "Onderbroexxel",
							 "Noordwest-Brabant": "Centraal België", "Midden-Brabant": "Centraal België", "Brussel": "Centraal België", 
							 "Leuven": "Centraal België", "Mechelen": "MAAW", "Akerland": "MAAW", "Antwerpen": "MAAW", "Waasland": "MAAW",
							 "Taxandria": "Kempen", "Neteland": "Kempen", "Voorkempen": "Kempen", 
							 "Zandland": "Binnenstebuiten Kempen", "Pallieterland": "Binnenstebuiten Kempen", "Hageland-Zuiderkempen": "Binnenstebuiten Kempen",
							 "Demervallei": "Limburg", "Fruitstreek": "Limburg", "Lage Kempen": "Limburg", "Midden-Limburg": "Limburg", "Zuid-Limburg": "Limburg" };

var regioIconMapping = { "West-Vlaanderen": geoCenterIcon_green ,"Lyscaldia": geoCenterIcon_orange, "Benedenschelde": geoCenterIcon_darkblue,"Zuidoost-Vlaanderen": geoCenterIcon_red,
						 "Onderbroexxel": geoCenterIcon_lightgreen, "Centraal België": geoCenterIcon_brown, "MAAW": geoCenterIcon_pink, "Kempen": geoCenterIcon_blue, 
						 "Binnenstebuiten Kempen": geoCenterIcon_yellow, "Limburg": geoCenterIcon_darkgreen };

//var jnmHeatUrlBase = "https://tools.jnm.be/jnm_heat/"
var jnmHeatUrlBase = "" // When self hosted

function BindSidebar(pin, elem, htmlContent)
{
	pin.on('click', function()
	{
		elem.innerHTML = htmlContent;

		var h3 = document.getElementById("geselecteerde_afdeling_title");
		h3.style.display = null;
	});
}

// create a dictionary {'node-id' --> node}
function nodeDict(nodeData){
	var dict = new Object();
	for (var i = 0; i < nodeData.elements.length; i++){
		var node = nodeData.elements[i];
		if(node.type != 'node'){
			continue;
		}
		dict[node.id] = node;
	}
	return dict;
}

// given an array of points, will return a histogram of the points
function createCluster(points){
	var cluster = new Object();

	for(var i = 0; i < points.length; i++){
		var latlon = [points[i].lat, points[i].lon];
		if(latlon == null){
			continue;
		}
		if(cluster[ latlon ] == null){
			cluster[ latlon ] = [];
		}
		cluster[ latlon ].push(points[i]);
	}

	cluster.forEach = function (f){
		for(var key in cluster){
			if (!cluster.hasOwnProperty(key) || key == null) {
				continue;
			}
			var value = cluster[key];
			var latlon = key.split(',');
			latlon = [parseFloat(latlon[0]), parseFloat(latlon[1])];
			if(!(latlon[0] && latlon[1])){
				continue;
			}
			f(latlon, value);
		}
	}

	return cluster;
}





function offerAsDownload(filename, text){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


var afdelingenRecords = null
var id2name_dict = null;

function SyncAssureCache()
{
	if(id2name_dict == null)
	{
		var query = "/query/afdelingen.php?include_werkgroep"
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", query, false ); // false for synchronous request
		xmlHttp.send( null );
		var response = JSON.parse(xmlHttp.responseText);
		if(response.length == 0){
			return;
		}
		id2name_dict = {}
		afdelingenRecords = []
		for (var i = 0; i < response.length; i++) {
			var rec = response[i];

			// DIRTY TEMPORARY HACK! Eeklo will be renamed to Meetjesland.
			if (rec.id == 16)
				id2name_dict[rec.id] = "Eeklo/Meetjesland";
			else
				id2name_dict[rec.id] = rec.display_name;
			afdelingenRecords[rec.id] = rec;
		}
	}
}

// Converts the chapter id into its display name.
function id2name(id){
	SyncAssureCache();
	return id2name_dict[id]
}

function isDodeAfdeling(afdId){
	if    (afdId == 16 // Eeklo/Meetjesland
		|| afdId == 26 // Markvallei
		|| afdId == 28 // Middenkust
		|| afdId == 39 // Scheldeland
		|| afdId == 44 // Westkust
		|| afdId == 46 // West-Limburg
		|| afdId == 55 // Maasland
		) {
				return true;
		}
	return false;
}

function isWerkgroepOrNationaal(contactId)
{
	SyncAssureCache();
	var rec = afdelingenRecords[contactId];
	return (rec.contact_sub_type == null || rec.contact_sub_type.indexOf("werkgroep")!=-1)
}
