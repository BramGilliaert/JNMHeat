'use strict';

// Needs a few input fields which contain the settings, such as 'datepicker_before', datepicker_after, min_act_geocenter, min_act_duration, max_axt_duration

function initFilterSettings(){
	$( "#datepicker_before" ).datepicker();
	$( "#datepicker_before" ).datepicker("option", "dateFormat", "yymmdd");
	$( "#datepicker_after" ).datepicker();
	$( "#datepicker_after" ).datepicker("option", "dateFormat", "yymmdd");
	document.getElementById("datepicker_after").value = "20010101";
	document.getElementById("datepicker_before").value = "29990101";
	document.getElementById("cat_picker").value = "%";
	document.getElementById("min_act_duration").value = "0";
	document.getElementById("max_act_duration").value = "24"; // 8760
	document.getElementById("min_act").value = "1";
}

function getMonthFormatted(d){
	var m = d.getMonth();
	m++;
	if(m < 10){
		return "0"+m;
	}
	return m;
}

function getPublicFilterSettings(){
	var d = new Date();
	return "&startdate="+(d.getFullYear()-1) + getMonthFormatted(d)+d.getDate()+"&max_duration=24";
}

function minActivitiesAtLocation(){
	try{
		return parseInt(document.getElementById("min_act").value);
	}catch(e){
		return e;
	}
}

function getFilterSettings(){
	try{
		var query = "";
		query +="&startdate="+document.getElementById("datepicker_after").value;
		query +="&enddate="+document.getElementById("datepicker_before").value;
		query +="&categorie="+document.getElementById("cat_picker").value;
		query +="&min_duration="+document.getElementById("min_act_duration").value;
		query +="&max_duration="+document.getElementById("max_act_duration").value;

		console.log("query is",query);

		return query;
	}catch(e){
		return getPublicFilterSettings();
	}
}
