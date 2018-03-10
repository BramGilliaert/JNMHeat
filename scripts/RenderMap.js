

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
			
			if(lat == null || lon == null){
				if(act.properties.adres_string !== ""){
					var result = queryOSM(act.properties.adres_thoroughfare, act.properties.adres_postal_code, act.properties.adres_locality);
					if(result){
						lat = result[0];
						lon = result[1];
					}else{
						continue;
					}
				}else{
					continue;
				}
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
			if(filterSettings.count_afdeling_only && act.properties.organisator != afdId){
				// pass
			}else{
				locationInfo.count += 1;
			}
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
			var msg = "<br /> "+ d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + 
							": <a href='https://www.jnm.be/node/"+ act.properties.activiteit_entity_id +"' target='_blank'>"+act.properties.title+"</a>";

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
				if(!(center[0] && center[1])){
					console.log("No activities for chapter", afdNaam);
					return;
				}


				try{
					var geoCenterPin;
					geoCenterPin = L.marker(center, {icon : icon});
					var msg = "Geografisch centrum van <a href='https://jnm.be/afdeling/"+afdNaam+"' target='_blank'>JNM "+afdNaam+"</a><br />";
					msg += total+" activiteiten met adres gevonden";
					geoCenterPin.bindPopup(msg);
					geoCentersLayer.addLayer(geoCenterPin);
					return geoCenterPin;
				}catch(e){
					console.log("Could not render geocenter for "+afdId+" "+afdNaam, e, center);
				}
	}











	function createAfdelingLayer(afdId, afdNaam, filterSettings){

		var layer = newLayer("activiteiten "+afdNaam);
		var source =    "https://tools.jnm.be/jnm_heat/activiteiten_geojson.php?afdeling="+afdId;

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
				});
				
		

		return layer;
	}


	// ------------------------------- LAYER OF CENTERS -------------------------
	/*
	Create a layer with geocenters based on the direct query
	*/
	function createCentersLayer(filterSettings){

		var geoCenterLayer= newLayer("geocenters by database");
		var query="https://tools.jnm.be/jnm_heat/activiteiten_geocenter.php?startdate=20180310";
		$.get(query, function(data) {
			var afdelingCenters = JSON.parse(data);
			for(var i = 0; i < afdelingCenters.length; i++){
				var cent = afdelingCenters[i];

				var pin = L.marker([cent.lat_center, cent.lon_center]);
				var afdId = cent.organiserende_afdeling;
				var name = id2name(afdId);
				pin.bindPopup("Geografisch gemiddelde van <a href='https://jnm.be/afdeling/"+name+"' target='_blank'>JNM "+name+"</a>");
				geoCenterLayer.addLayer(pin);

			}

		});


		return geoCenterLayer;

	}

	// ------------------------------- MAIN PROGRAM -------------------

	// loads all the layers
	function renderAnalysis(filterSettings){
		cleanLayers();

		createLokalenLayer().show();

		filterSettings = getPublicFilterSettings();
		var geoCentersLayer = createCentersLayer(filterSettings);
		geoCentersLayer.show();

		createActiviteitenLayer(12).show();

		// load data about the spaces from file, and use it
		/*$.get("afdelingen.json", function( data ) {
			for(var i = 0; i < data.length; i++){
				createAfdelingLayer(data[i].id, data[i].display_name, geoCentersLayer, filterSettings);
			}
		});*/
	}

	function renderPublic(){
		cleanLayers();

		

		createLokalenLayer().show();
		filterSettings = getPublicFilterSettings();
		createCentersLayer(filterSettings).show();
		

		// load data about the spaces from file, and use it
		$.get("afdelingen.json", function( data ) {
			for(var i = 0; i < data.length; i++){
				createAfdelingLayer(data[i].id, data[i].display_name, filterSettings);
			}
		});

		

	}


