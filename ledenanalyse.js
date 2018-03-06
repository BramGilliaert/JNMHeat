

function analyseContacts(csvPath){
	console.log("Loading", csvPath);
	var data = $.csv.toArrays(csvPath)
	console.log(data);

}
