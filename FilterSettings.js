
// Needs a few input fields which contain the settings, such as 'datepicker_before', datepicker_after, min_act_geocenter, min_act_duration, max_axt_duration


function initFilterSettings(){
	console.log("initializing filter settings element");
	$( "#datepicker_before" ).datepicker();
	$( "#datepicker_before" ).datepicker("option", "dateFormat", "yy-mm-dd");
	$( "#datepicker_after" ).datepicker();
	$( "#datepicker_after" ).datepicker("option", "dateFormat", "yy-mm-dd");
}

function getFilterSettings(){
	var filterSettings =
	{ geocenter_min_activities : 1 // the number of activities that a location should at least have to count against the geografical center
	, activity_starts_after : null // the day an activity shoulds start after to be rendered (and accounted for in geo center as well). Use null if not needed
	, activity_starts_before : null // the day an activity shoulds start before to be rendered (and accounted for in geo center as well). USe null if not needed
	, activity_minimal_length : 0 // the length the activity should take, in hours, to be considered
	, activity_maximal_length: NaN // The length an activity should at least take to be considered
	, afdeling_only: true // only consider and show the activities of the chapter considered
	}
	console.log("Updating filter settings!");
	var min_act_geocenter = parseInt(document.getElementById('min_act_geocenter').value);
	if(min_act_geocenter > 0 && min_act_geocenter != filterSettings.geocenter_min_activities){
		filterSettings.geocenter_min_activities = min_act_geocenter;
	}


	var minL = parseInt(document.getElementById('min_act_duration').value);
	if(minL >= 0 && minL != filterSettings.activity_minimal_length){
		filterSettings.activity_minimal_length = minL;
	}


	var maxL = parseInt(document.getElementById('max_act_duration').value);
	if(maxL >= 0 && minL != filterSettings.activity_maximal_length){
		filterSettings.activity_maximal_length = maxL;
	}

	var dateParts = $('#datepicker_before').val().split('-'); // Format: yyyy-mm-dd
	var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
	if(date && date.valueOf()){
		filterSettings.activity_starts_before = date;
	}

	var dateParts = $('#datepicker_after').val().split('-'); // Format: yyyy-mm-dd
	var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
	if(date && date.valueOf()){
		filterSettings.activity_starts_after = date;
	}

	console.log("Rendering...");
	return filterSettings;
}
