
	// ------------------------ Icons ---------------------------------


	// fancy icons to show
	var lokaalIcon = L.icon({iconUrl: 'img/Lokaal', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var winkelIcon = L.icon({iconUrl: 'img/Winkel', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var bondssecIcon = L.icon({iconUrl: 'img/Bondssec', iconSize: [20, 20], iconAnchor: [10, 0], popupAnchor: [0,0]});
	var geoCenterIcon = L.icon({iconUrl: 'img/GeoCenter', iconSize: [25,41], iconAnchor: [12, 41], popupAnchor: [0, -41]});	

	var activiteitIcon = L.icon({iconUrl: 'img/VoorbijeAct', iconSize: [15,15], iconAnchor: [7, 7], popupAnchor: [0,0]});
	var activiteitenCenterIcon = L.icon({iconUrl: 'img/ActiviteitCenterIcon', iconSize: [10,10], iconAnchor: [4, 5], popupAnchor: [0,0]});
		
	var activiteitGeplandIcon = L.icon({iconUrl : 'img/ToekomstAct', iconSize: [15,15], icondAnchor: [0,0], popupAnchor: [0,0]});


   // Needed variables
		
	var allLayers = [];
	var controlBoxes = [];
	var map;





	function initializeMap(){	
		map = L.map('map').setView([50.9, 3.9], 9);

		// load the tile layer from GEO6
		L.tileLayer('http://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png',
			{
			attribution: 'Map Data Copyright OpenStreetMap | Tiles hosted by geo6; thx JBelien!',
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
		layer.loader = null;
		allLayers.push(layer);


		layer.show = function(){
			map.addLayer(layer);
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
			if(layer.control){
				layer.control.checked = false;
			}
			return layer;
		};
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
			var idCB = "layer"+layer.title;;
			var checkbox = document.createElement('input');
			checkbox.type = "checkbox";
			checkbox.name = "layer"+layer.title;
			checkbox.value = "value";
			checkbox.id = idCB;

			var label = document.createElement('label')
			label.htmlFor = idCB;
			label.appendChild(document.createTextNode(layer.title));

			var container = document.getElementById('controls');

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



	// ------------------------------------- HANDLING LOCATIONS ----------------------------------------------



	/* The string (html) that is shown on a popup of a venue
	*/
	function popupString(lokaal) {
		
		var link = lokaal.tags.website;
		if(link == null){
			link = lokaal.tags.name;
		}else{
			link = "<a href='"+lokaal.tags.website+"' target='_blank'>"+lokaal.tags.name+"</a>"
		}

		var descr;
		if(lokaal.tags.shop == "gift"){
			// This is a special case for the shop
			descr = "";;
		}else{
			// This is a generic youth movement space
			descr = "Lokaal van "
		}


		var findOn = "<br /><a href='https://openstreetmap.org/"+lokaal.type+"/"+lokaal.id+"' target='_blank'>Bekijk op kaart en Routeplanning</a>";

		return descr + link + findOn;

	}


	function pickIcon(lokaalInfo){
		if(lokaalInfo.tags.shop === "gift"){
			return winkelIcon;
		}else if(lokaalInfo.tags.office === "administrative"){
			return bondssecIcon;
		}else{
			return lokaalIcon;
		}
	}

	// load data about the spaces from file, and use it
	function createLokalenLayer(){
		var lokalenLayer = newLayer("Lokalen van JNM-afdelingen (+bondsec)");

		// query openstreetmap for venues of JNM. It looks to 'operator=JNM'
		var query = "https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22operator%22%3D%22JNM%22%5D%2848%2E951366470948%2C0%2E59326171875%2C52%2E583025861416%2C8%2E6846923828125%29%3Bway%5B%22operator%22%3D%22JNM%22%5D%2848%2E951366470948%2C0%2E59326171875%2C52%2E583025861416%2C8%2E6846923828125%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A";

		
		lokalenLayer.loader = function() {$.get(query, function( lokalen ) {
				// maps ids on their nodes; we'll need it later
				var nodes = nodeDict(lokalen);

				for (var i = 0; i < lokalen.elements.length; i++){
					var lokaal = lokalen.elements[i];

					if(lokaal.tags == null){
						// probably just part of a building. Skip this shit
						continue;
					}

					if(lokaal.tags.name == null){
							console.log("Name not defined for location, skipping it");
							console.log(lokaal);
							continue;
					}

					if(lokaal.lat == null || lokaal.lon == null){
						lokaal.lat = nodes[lokaal.nodes[0]].lat;
						lokaal.lon = nodes[lokaal.nodes[0]].lon;
					}

					// create a marker, add it to the layer
					var lokaalM = L.marker([lokaal.lat, lokaal.lon], {icon: pickIcon(lokaal)});
					lokaalM.bindPopup(popupString(lokaal));
					lokalenLayer.addLayer(lokaalM);
				} // end of for each venue
			}); // end of data crunching for venues
		}
		return lokalenLayer;
	}



	// ---------------------------------------------------- HANDLING ACTIVITIES -----------------------------------------------------
	
	function forEachInOverview(dict, func){
		for(var key in dict){
			if (!dict.hasOwnProperty(key) || key == null) {
				continue;
			}
			var value = dict[key];
			func(key, value);			
		}
	}


	function geoCenter(dict, filterSettings){
		var total = 0;
		var lat = 0;
		var lon = 0;
		
		forEachInOverview(dict, function(key, locInfo){
			if(locInfo.count >= filterSettings.geocenter_min_activities){
				lat += locInfo.count * parseFloat(locInfo.location[0]);
				lon += locInfo.count * parseFloat(locInfo.location[1]);
				total += locInfo.count;
			}

		});
		lat /= total;
		lon /= total;
		return [lat, lon];

	}






	function sortActivitiesArray(array){
		array.sort(function(a,b){
			return a.properties.start_date - b.properties.start_date;
			});
	}

	// Builds an object containing an overview of activities on each location ([lat, lon] indexed)
	function createOverview(afdId, activiteiten, filterSettings){
		var allActivities = new Object();

		for(var i = 0; i < activiteiten.length; i++){
			var act = activiteiten[i];			
			var startD = new Date(act.properties.start_date);
			act.properties.start_date = startD;
			var endD = new Date(act.properties.end_date);
			act.properties.end_date = endD;


			var MS_PER_HOUR = 1000*60*60;
			var duration =  Math.floor((endD - startD) / (MS_PER_HOUR));
			if(filterSettings.afdeling_only && act.properties.organisator != afdId){
				continue; 
			}

			if(!(filterSettings.activity_minimal_length < duration)){
				continue;
			} 

			if(filterSettings.activity_maximal_length && !(duration < filterSettings.activity_maximal_length)){
				continue;
			}

			if(filterSettings.activity_starts_before && startD >= filterSettings.activity_starts_before){
				continue;
			}

			if(filterSettings.activity_starts_after && startD <= filterSettings.activity_starts_after){
				continue;
			}

			var lat = act.properties.field_activiteit_locatie_lat;
			var lon = act.properties.field_activiteit_locatie_lon;
			
			console.log(act.id);
			if(lat == null || lon == null){

				console.log("No address determined by google!", act.properties);
				continue;
			}
			
			var locationInfo = allActivities[ [lat, lon] ]
			if(locationInfo == null){
				locationInfo = { 
					location :  [lat, lon],
					activities : [],
					count : 0, 
					};
				allActivities[ [lat, lon] ] = locationInfo;
				
			}
			locationInfo.activities.push(act);
			locationInfo.count += 1;
		}


		forEachInOverview(allActivities, 
			function(w, loc){sortActivitiesArray(loc.activities);});
		return allActivities;

	}

	// Create a point for a single location
	function createLocationMarker(locationInfo, filterSettings){

		// locationInfo contains .activities, containing all activities
		// and a count. Lets make something neat of it!
		
		var acts = locationInfo.activities;
		
		var futureEventCount = 0;
		var pastEventCount = 0;
		var total = locationInfo.count;

		if(total < filterSettings.min_act_geo_center){
			return;
		}

		var futureEventStrings = "";
		var pastEventStrings = "";
		
		var msg;

		for(var i = 0; i < acts.length; i++){
			var act = acts[i];

			var d	=  act.properties.start_date;
			var msg = "<br /> "+ d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + 
							": <a href='https://www.jnm.be/node/"+ act.properties.entity_id +"' target='_blank'>"+act.properties.title+"</a>";

			if(new Date(Date()) < act.properties.start_date){
				futureEventCount += 1;
				futureEventStrings += msg;
			}else{
				pastEventCount += 1;
				pastEventStrings += msg;
			}

		}

		var msg = "";
		var actIcon = activiteitIcon;
		if(futureEventCount > 0){
			msg += "<b>"+futureEventCount+" geplande activiteiten:</b>";
			msg += futureEventStrings + "<br  />";
			actIcon = activiteitGeplandIcon;
		}


		if(pastEventCount > 0){
			msg += "<b>"+pastEventCount+" voorbije activiteiten:</b>";
			msg += pastEventStrings + "<br />";
		}

		if(pastEventCount + futureEventCount >= 2){
			msg+="<br /><b>"+(pastEventCount + futureEventCount)+" activiteiten in totaal</b>";
		}

		var pin = L.marker(locationInfo.location, { icon :  actIcon});
		pin.bindPopup(msg);
		return pin;
	}


	function plotGeoCenter(afdId, afdNaam, overview, total, geoCentersLayer, icon, filterSettings){
				if(total == 0){
					console.log("No activities for chapter", afdNaam);
					return;
				}

				var center = geoCenter(overview, filterSettings);
				try{
					var geoCenterPin;
					geoCenterPin = L.marker(center, {icon : icon});
					var msg = "Geografisch centrum van <a href='https://jnm.be/afdeling/"+afdNaam+"' target='_blank'>JNM "+afdNaam+"</a><br />";
					msg += total+" activiteiten gevonden";
					geoCenterPin.bindPopup(msg);
					geoCentersLayer.addLayer(geoCenterPin);
				}catch(e){
					console.log("Could not render geocenter for "+afdId+" "+afdNaam, e, center);
				}
	}


	function createAfdelingLayer(afdId, afdNaam, geoCentersLayer, filterSettings){

		var layer = newLayer("activiteiten "+afdNaam);
		var altSource = "https://tools.jnm.be/jnm_heat/activiteiten_geojson.php?afdeling="+afdId
		var source = "https://tools.jnm.be/jnm_heat/activiteiten_geojson.php?afdeling="+afdId;

		// do the lookups ourselves
		var useRawData = false;
		if(useRawData){
			source = useRawData;
		}

		$.get(source, function(data){
				try{
					var activiteitenData = JSON.parse(data).features;
				}catch(e){
					console.log("Could not parse data for ",afdNaam,data);
					return;
				}
				var overview = createOverview(afdId, activiteitenData, filterSettings);
				var total = 0;
				forEachInOverview(overview, function(loc, actData){
					total += actData.count;
					var pin = createLocationMarker(actData, filterSettings);
					layer.addLayer(pin);
				});
				plotGeoCenter(afdId, afdNaam, overview, total, layer, activiteitenCenterIcon, filterSettings);
				plotGeoCenter(afdId, afdNaam, overview, total, geoCentersLayer, geoCenterIcon, filterSettings);
				
		});

		return layer;
	}



	// ------------------------------- MAIN PROGRAM -------------------

	// loads all the layers
	function renderAnalysis(filterSettings){
		cleanLayers();
		var geoCentersLayer = newLayer("geographical centers");
		createLokalenLayer().show();
		geoCentersLayer.show();

		// load data about the spaces from file, and use it
		$.get("afdelingen.json", function( data ) {
			for(var i = 0; i < data.length; i++){
				createAfdelingLayer(data[i].id, data[i].display_name, geoCentersLayer, filterSettings);
			}
		});
	}


