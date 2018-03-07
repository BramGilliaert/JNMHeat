// calls nominatim to translate an address into a coordinate
// usefull for activities with an address where google didn't find where it was

var found = 0;
var cacheHits = 0;

var cache = new Object();

function queryOSM(street, postal, city){
	if(cache[ [street, postal, city] ]){
		return cache[ [street, postal, city] ];
	}

	
	result = queryRealOSM(street, postal, city);
	cache[ [street, postal, city] ] = result;

	return result;
}

function queryRealOSM(street, postal, city){

	window.navigator.userAgent = "JNM Analysis tools";
	

	var query = "https://nominatim.openstreetmap.org/search/"+street+", "+postal+" "+city+"?format=json";
	var xmlHttp = new XMLHttpRequest();
   xmlHttp.open( "GET", query, false ); // false for synchronous request
   xmlHttp.send( null );
	var response = JSON.parse(xmlHttp.responseText);
	if(response.length == 0){
		return;
	}

	var result = response[0];
	found ++;
	console.log("OSM ROCKS!", found, "("+ cacheHits, "from cache)");
	return [result.lat, result.lon];

}
