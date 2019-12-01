'use strict';

// Needed variables

var allLayers = [];
var controlBoxes = [];
var map;
var leden_per_afdeling = {};

function initializeMap(){
	map = L.map('map').setView([50.9, 3.9], 9);

	// load the tile layer from GEO6
	/*L.tileLayer('https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png',
		{
		attribution: 'Map Data © <a href="osm.org">OpenStreetMap</a> | Tiles hosted by <a href="https://geo6.be/">GEO-6</a>; thx JBelien!',
		maxZoom: 21,
		minZoom: 1
		}).addTo(map);
		*/
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoiZW1pbGVzb25uZXZlbGQiLCJhIjoiY2ptNXlodWo3MjAxMzNsbXlibDliaDFxayJ9.KyJrscbJtvVispyZvJCknw'
	}).addTo(map);
	/*
	// Nice map, but no labels
	L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 1,
		maxZoom: 16,
		// tileSize: 128, Dosn't scale with coordinates
		ext: 'png'
	}).addTo(map);
	*/
	// Map with focus on railways: https://www.thunderforest.com/maps/pioneer/
}

function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }


function DownloadLedenPerAfdeling()
{
	var today = new Date()
	var dateString = today.getFullYear()+''+pad(today.getMonth()+1)+''+pad(today.getDate());

	var query= jnmHeatUrlBase+"leden_per_afdeling.php?sample_date="+dateString;
	// $.get(query, function(data) {
	// 	leden_per_afdeling = data;
	// });
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", query, false ); // false for synchronous request
	xmlHttp.send( null );
	var response = JSON.parse(xmlHttp.responseText);
	if(response.length == 0){
		return;
	}
	leden_per_afdeling = response;
}
DownloadLedenPerAfdeling();


function cleanLayers(){
	// cleanup of the layers which might already exist
	for(var i = 0; i < allLayers.length; i++){
		allLayers[i].hide();
		allLayers[i].scrap();
	}
	allLayers = [];
	while(controlBoxes[0] && controlBoxes[0].parentNode){
		var toRemove = controlBoxes[0];
		toRemove.parentNode.removeChild(toRemove);
	}
	controlBoxes = [];
}

function newLayer(name, pin){
	var layer = new L.FeatureGroup();
	var loaded = false;
	var shown = false;
	layer.loader = null;
	allLayers.push(layer);

	layer.show = function(){
		map.addLayer(layer);
		shown = true;
		if(pin)
			pin.setIcon(shown?geoCenterIcon_empty:geoCenterIcon);
		if(layer.loader && !loaded){
			layer.loader(layer);
		} 

		if(layer.control){
			layer.control.checked = true;
		}
		return layer;
	};

	layer.hide = function(){
		map.removeLayer(layer);
		shown = false;
		if(pin)
			pin.setIcon(shown?geoCenterIcon_empty:geoCenterIcon);
		if(layer.control){
			layer.control.checked = false;
		}
		return layer;
	};

	layer.toggle = function(){
		if(shown){
			layer.hide();
		}else{
			layer.show();
		}
	}


	layer.title = name;


	layer.scrap = function(){
		map.removeLayer(layer);
		if(layer.control){
			layer.control.checked = false;
			layer.control.onclick = null;
		}
	}

	function getControls(){
		return document.getElementById("layer"+layer.title)
	}

	// create controls
	function createControls(){
		var container = document.getElementById('layerControls');
		if(container==null){
			return;
		}

		var idCB = "layer"+layer.title;;
		var checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.name = "layer"+layer.title;
		checkbox.value = "value";
		checkbox.id = idCB;

		var label = document.createElement('label')
		label.htmlFor = idCB;
		label.className = "inl"
		label.appendChild(document.createTextNode(layer.title));

		var div = document.createElement("div");
		div.className = "flow-element"
		div.appendChild(checkbox);
		div.appendChild(label);
		controlBoxes.push(div);
		container.appendChild(div);
		
		/*
		var tr = document.createElement('tr');
		controlBoxes.push(tr);
		var td = document.createElement('td');
		container.appendChild(tr);
		tr.appendChild(td);
		td.appendChild(checkbox);
		td.appendChild(label);
		*/

		layer.control = document.getElementById(idCB)
		layer.control.onclick = function() {
		 if (this.checked ) {
			layer.show();
		 } else {
			layer.hide();
		 }
		};
	}

	var controls = getControls();
	if(controls){
		layer.control = controls;
		controls.onclick =  function() {
		 if (this.checked ) {
			layer.show();
		 } else {
			layer.hide();
		 }
		};
	}else{
		createControls();
	}

	return layer;
}


function selectAll(selected){
	for(var i = 0; i < allLayers.length; i++){
		if(selected){
			allLayers[i].show();
		}else{
			allLayers[i].hide();
		}
	} 
}





// ------------------------------- LAYER OF CENTERS -------------------------
var pinForAfdId = [];

/*
Create a layer with geocenters based on the direct query
Onclick is a function which, given the afdId, should give a new function. This new function is called when the pin is clicked
*/
function createCentersLayer(){
	var geoCenterLayer= newLayer("geocenters by database");
	var query= jnmHeatUrlBase+"activiteiten_geocenter.php?"+getFilterSettings();
	$.get(query, function(data) {
		var afdelingCenters = data; //JSON.parse(data);
		for(var i = 0; i < afdelingCenters.length; i++){
			var cent = afdelingCenters[i];

			var afdId = cent.organiserende_afdeling;
			if(isWerkgroepOrNationaal(afdId)) {
				continue; // Skip
			}
			if(isDodeAfdeling(afdId)) {
				continue; // Skip
			}
			var name = id2name(afdId);
			var pin = L.marker([cent.lat_center, cent.lon_center], {icon: geoCenterIcon});
			pinForAfdId[afdId] = pin;
			var htmlContent = "Kern van <a href='https://jnm.be/afdeling/"+name.replace("'", "")+"' target='_blank'>JNM "+name+"</a><br/>"+leden_per_afdeling[afdId]["aantal_leden"]+" leden."
			//var popup = L.popup({closeOnClick : false, autoClose : false, closeButton : false}).setContent(htmlContent);
			//pin.bindPopup(popup);
			var elem = document.getElementById("geselecteerde_afdeling_tekstje")
			BindSidebar(pin, elem, htmlContent)

			pin.on('click', showActiviteiten(afdId));
			geoCenterLayer.addLayer(pin);

		}

	});

	return geoCenterLayer;
}


function loadAllLayers(){
	for (var pinForAfdId in pinForAfdId) {
    	if (!pinForAfdId.hasOwnProperty(pinForAfdId)) continue;
		var layer = obtainActiviteitenLayer(afdId, pinForAfdId[afdId])
		layer.show();
	}
}

// ------------------------------- MAIN PROGRAM -------------------

function showActiviteiten(afdId){
	return function(evt){
		var layer = obtainActiviteitenLayer(afdId, pinForAfdId[afdId])
		layer.toggle();
	};
}


// loads all the layers
function renderAnalysis(){
	cleanLayers(); // ?

	createLokalenLayer("lokalenLayer").show();

	var geoCentersLayer = createCentersLayer();
	geoCentersLayer.show();
}

function renderPublic(){
	cleanLayers();

	createLokalenLayer().show();
	createCentersLayer().show();
}
