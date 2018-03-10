

   // Needed variables
		
	var allLayers = [];
	var controlBoxes = [];
	var map;

	function initializeMap(){	
		map = L.map('map').setView([50.9, 3.9], 9);

		// load the tile layer from GEO6
		L.tileLayer('http://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png',
			{
			attribution: 'Map Data © <a href="osm.org">OpenStreetMap</a> | Tiles hosted by <a href="https://geo6.be/">GEO-6</a>; thx JBelien!',
			maxZoom: 21,
			minZoom: 1
			}).addTo(map);
	}



	function cleanLayers(){
		// cleanup of the layers which might already exist
		for(var i = 0; i < allLayers.length; i++){
			allLayers[i].hide();
			allLayers[i].scrap();
		}
		allLayers = [];
		while(controlBoxes[0] && controlBoxes[0].parentNode){
			controlBoxes[0].parentNode.removeChild(controlBoxes[0]);
		}
		controlBoxes = [];
	}

	function newLayer(name){
		var layer = new L.FeatureGroup();
		var loaded = false;
		var shown = false;
		layer.loader = null;
		allLayers.push(layer);


		layer.show = function(){
			map.addLayer(layer);
			shown = true;
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
			var container = document.getElementById('controls');
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
			label.appendChild(document.createTextNode(layer.title));



			var tr = document.createElement('tr');
			controlBoxes.push(tr);
			var td = document.createElement('td');
			container.appendChild(tr);
			tr.appendChild(td);
			td.appendChild(checkbox);
			td.appendChild(label);


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
	/*
	Create a layer with geocenters based on the direct query
	Onclick is a function which, given the afdId, should give a new function. This new function is called when the pin is clicked
	*/
	function createCentersLayer(filterSettings, onClick){

		var geoCenterLayer= newLayer("geocenters by database");
		var query="https://tools.jnm.be/jnm_heat/activiteiten_geocenter.php?startdate=20180310";
		$.get(query, function(data) {
			var afdelingCenters = JSON.parse(data);
			for(var i = 0; i < afdelingCenters.length; i++){
				var cent = afdelingCenters[i];

				var afdId = cent.organiserende_afdeling;
				var name = id2name(afdId);
				var pin = L.marker([cent.lat_center, cent.lon_center]);
				pin.bindPopup("Geografisch gemiddelde van <a href='https://jnm.be/afdeling/"+name+"' target='_blank'>JNM "+name+"</a>");

				
				pin.on('click',onClick(afdId));
				geoCenterLayer.addLayer(pin);

			}

		});


		return geoCenterLayer;

	}


	function loadAllLayers(){
		var afds = allAfdelingIds();
		for(var i = 0; i < afds.length; i++){
			createActiviteitenLayer(i).show();
		}
	}

	// ------------------------------- MAIN PROGRAM -------------------

function showActiviteiten(afdId){
	return function(){createActiviteitenLayer(afdId).toggle()};
}


// loads all the layers
function renderAnalysis(filterSettings){
	cleanLayers();

	createLokalenLayer().show();

	filterSettings = getPublicFilterSettings();



	var geoCentersLayer = createCentersLayer(filterSettings, showActiviteiten);
	geoCentersLayer.show();


}



function renderPublic(){
	cleanLayers();

	

	createLokalenLayer().show();
	filterSettings = getPublicFilterSettings();
	createCentersLayer(filterSettings).show();
	
	

}


