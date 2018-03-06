// calls nominatim to translate an address into a coordinate
// usefull for activities with an address where google didn't find where it was


function queryOSM(street, postal, city){

	var query = "https://nominatim.openstreetmap.org/search/"+street+", "+postal+" "+city+"?format=json";
	var xmlHttp = new XMLHttpRequest();
   xmlHttp.open( "GET", query, false ); // false for synchronous request
   xmlHttp.send( null );
   console.log(xmlHttp.responseText);

}
