'use strict';

// fancy icons to show
var lokaalIcon = L.icon({iconUrl: 'img/Lokaal.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var winkelIcon = L.icon({iconUrl: 'img/Winkel.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var bondssecIcon = L.icon({iconUrl: 'img/Bondssec.png', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
var geoCenterIcon = L.icon({iconUrl: 'img/GeoCenter.png', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});

var activiteitIcon = L.icon({iconUrl: 'img/VoorbijeAct.png', iconSize: [15,15], iconAnchor: [7, 7], popupAnchor: [0,0]});
var activiteitenCenterIcon = L.icon({iconUrl: 'img/ActiviteitCenterIcon.png', iconSize: [10,10], iconAnchor: [4, 5], popupAnchor: [0,0]});

var activiteitGeplandIcon = L.icon({iconUrl : 'img/ToekomstAct.png', iconSize: [15,15], icondAnchor: [0,0], popupAnchor: [0,0]});

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

// Converts the chapter id into its display name.
function id2name(id){
	// 50; 52; 57; 
	var dict = {
		1:"Nationaal",
		6:"Poekebeek",
		7:"Akerland",
		8:"Alken",
		9:"Antwerpen",
		10:"Krabboen",
		11:"Aa-Beek",
		12:"Brugge",
		13:"Brussel",
		14:"Ninove-Geraardsbergen",
		15:"Durmeland",
		16:"Eeklo",
		17:"Fruitstreek",
		18:"Gent",
		19:"Hageland-Zuiderkempen",
		20:"Klein-Brabant",
		21:"Kortrijk",
		22:"Krekenland",
		23:"LageKempen",
		24:"Leievallei",
		25:"Leuven",
		26:"Markvallei",
		27:"Mechelen",
		28:"Middenkust",
		29:"Midden-Limburg",
		30:"Zandland",
		31:"Neteland",
		32:"Teutenland",
		33:"Noordwest-Brabant",
		34:"Oost-Brabant",
		35:"Pajottenland",
		36:"Pallieterland",
		37:"Roeselare",
		38:"'SHeerenbosch",
		39:"Scheldeland",
		40:"Taxandria",
		41:"VlaamseArdennen",
		42:"Voorkempen",
		43:"Waasland",
		44:"Westkust",
		45:"Westland",
		46:"West-Limburg",
		47:"Zottegem",
		48:"Zuid-Limburg",
		49:"Zuidwest-Brabant",
		50:"Milieuwerkgroep",
		52:"Natuurstudiewerkgroep",
		51:"Onderstebovenschelde",
		53:"LandVanAalst",
		54:"Moervallei",
		55:"Maasland",
		56:"HogeKempen",
		57:"Beheerwerkgroep",
		58:"Aalter",
		59:"Midden-Brabant",
		14070:"Demervallei",
		15651:"ProvincieLimburg"}
	return dict[id]
}

function allAfdelingIds(){
	return  [13,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,51,53,54,55,56,57,58,59,14070,15651];
}
