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

		// just kidding. We actually use the cached version of the jnm site
		query = "https://tools.jnm.be/jnm_heat/lokalen.json"

		
		lokalenLayer.loader = function() {$.get(query, function( lokalen ) {
				// maps ids on their nodes; we'll need it later

				// cache freshness on the JNM side
				var cacheDate = new Date(lokalen.osm3s.timestamp_osm_base);
				var cacheFreshness = (new Date() - cacheDate)/1000;
				cacheFreshness = cacheFreshness / (60*60*24);
				console.log("Oldness of cache van de lokalen in days" , cacheFreshness," of the allowed 30");	
				if(cacheFreshness > 30){
					// the cache on the JNM server is pretty old; we ask it to refresh for the next user
					console.log("Requesting cache update");
					$.get("https://tools.jnm.be/jnm_heat/cache_lokalen.php", function(data){
						console.log("Cache updated. Refresh the page.");
					});
				}		


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

