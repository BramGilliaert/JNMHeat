
	// fancy icons to show
	var lokaalIcon = L.icon({iconUrl: 'img/Lokaal', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var winkelIcon = L.icon({iconUrl: 'img/Winkel', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var bondssecIcon = L.icon({iconUrl: 'img/Bondssec', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var geoCenterIcon = L.icon({iconUrl: 'img/GeoCenter', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});	

	var activiteitIcon = L.icon({iconUrl: 'img/VoorbijeAct', iconSize: [15,15], iconAnchor: [7, 7], popupAnchor: [0,0]});
	var activiteitenCenterIcon = L.icon({iconUrl: 'img/ActiviteitCenterIcon', iconSize: [10,10], iconAnchor: [4, 5], popupAnchor: [0,0]});
		
	var activiteitGeplandIcon = L.icon({iconUrl : 'img/ToekomstAct', iconSize: [15,15], icondAnchor: [0,0], popupAnchor: [0,0]});



// given an array of points, will return a histogram of the points
function createCluster(points, getLatLon){
	var cluster = new Object();
	
	for(var i = 0; i < points.length; i++){
		var latlon = getLatLon(points[i]);
		if(latlon == null){
			continue;
		}
		if(cluster[ latlon ] == null){
			cluster[ latlon ] = [];
		}
		cluster[ latlon ].push(points[i]);
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
		var dict = {13:"JNM",6:"Poekebeek",7:"Akerland",8:"Alken",9:"Antwerpen",10:"Krabboen",11:"Aa-Beek",12:"Brugge",13:"Brussel",14:"Ninove-Geraardsbergen",15:"Durmeland",16:"Eeklo",17:"Fruitstreek",18:"Gent",19:"Hageland-Zuiderkempen",20:"Klein-Brabant",21:"Kortrijk",22:"Krekenland",23:"LageKempen",24:"Leievallei",25:"Leuven",26:"Markvallei",27:"Mechelen",28:"Middenkust",29:"Midden-Limburg",30:"Zandland",31:"Neteland",32:"Teutenland",33:"Noordwest-Brabant",34:"Oost-Brabant",35:"Pajottenland",36:"Pallieterland",37:"Roeselare",38:"'SHeerenbosch",39:"Scheldeland",40:"Taxandria",41:"VlaamseArdennen",42:"Voorkempen",43:"Waasland",44:"Westkust",45:"Westland",46:"West-Limburg",47:"Zottegem",48:"Zuid-Limburg",49:"Zuidwest-Brabant",51:"Onderstebovenschelde",53:"LandVanAalst",54:"Moervallei",55:"Maasland",56:"HogeKempen",58:"Aalter",59:"Midden-Brabant",14070:"Demervallei",15651:"ProvincieLimburg"}
		return dict[id]
	}
