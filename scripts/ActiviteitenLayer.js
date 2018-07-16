'use strict';


function createPin(latlon, acts){

	var futureEventStrings = "";
	var pastEventStrings = "";
	var futTotal = 0;
	var pastTotal = 0;
	for(var i = 0; i < acts.length; i++){
		var act = acts[i];

		var d	=  new Date(act.start_date);
		act.start_date = d;
		var msg = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + 
						": <a href='https://www.jnm.be/node/"+ act.id +"' target='_blank'>"+act.naam+"</a><br />";

		if(new Date(Date()) < act.start_date){
			futureEventStrings += msg;
			futTotal += 1;
		}else{
			pastEventStrings += msg;
			pastTotal += 1;
		}

	}


	var msg = "";
	var actIcon = activiteitIcon;

	function activiteitenMv(i){
		if(i == 1){
			return "activiteit";
		}
		return "activiteiten";
	}

	if(futTotal > 0){
		if(futTotal > 1){	msg += "<b>"+futTotal+" geplande "+activiteitenMv(futTotal)+":</b><br />";}
		msg += futureEventStrings;
		actIcon = activiteitGeplandIcon;
	}


	if(pastTotal > 0){
		if(pastTotal > 1) {msg += "<b>"+pastTotal+" voorbije "+activiteitenMv(pastTotal)+":</b><br />";}
		msg += pastEventStrings;
	}

	var total = pastTotal + futTotal;
	if(total >= 2 && pastTotal != 0 && futTotal != 0){
		msg+="<br /><b>"+total +" activiteiten in totaal</b>";
	}
	var pin = L.marker(latlon, {icon: actIcon});
	pin.bindPopup(msg);
	return pin;
}



function createActiviteitenLayer(cachedLayers, afdId){
	if(cachedLayers[afdId]){
		return cachedLayers[afdId];
	}
	console.log("Creating layer for", afdId);


	var afdNaam = id2name(afdId);
	var layer = newLayer("activiteiten_"+afdNaam);
	cachedLayers[afdId] = layer;

	var source = "https://tools.jnm.be/jnm_heat/activiteiten_geojson2.php?afdeling="+afdId+getFilterSettings();
	console.log("Querying", source);
	$.get(source, function(data){
			try{
				var activiteitenData = JSON.parse(data);
			}catch(e){
				console.log("Could not parse data for ",afdNaam,data);
				return;
			}
			var cluster = createCluster(activiteitenData, function(act){console.log(act); return act.geometry.coordinates;});

			cluster.forEach(function(latlon, val){
				if(val.length < minActivitiesAtLocation()){
					return;
				}
				var pin = createPin(latlon, val);
				layer.addLayer(pin);

			});


		});

	return layer;
}
