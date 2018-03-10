
var cachedLayers = new Object();


function createActiviteitenLayer(afdId){
	if(cachedLayers[afdId]){
		return cachedLayers[afdId];
	}
	console.log("Creating layer for", afdId);


	var afdNaam = id2name(afdId);
	var layer = newLayer("activiteiten", afdNaam);
	cachedLayers[afdId] = layer;

	var source = "https://tools.jnm.be/jnm_heat/activiteiten_geojson2.php?afdeling="+afdId;

	$.get(source, function(data){
			try{
				var activiteitenData = JSON.parse(data).features;
			}catch(e){
				console.log("Could not parse data for ",afdNaam,data);
				return;
			}

			console.log(activiteitenData);
			var cluster = createCluster(activiteitenData, function(act){console.log(act); return act.geometry.coordinates;});
		/*	var overview = createOverview(afdId, activiteitenData, filterSettings);
			var total = 0;
			forEachInOverview(overview, function(loc, actData){
				total += actData.count;
				var pin = createLocationMarker(actData, filterSettings);
				layer.addLayer(pin);
			});*/


		});
			


		return layer;
}
