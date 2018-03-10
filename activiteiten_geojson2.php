
<?php

require_once $_SERVER['DOCUMENT_ROOT']."/common/db.php"; 

$debug = true;

if ($debug) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}

$afdeling = "[should be defined in GET]";
if(isset($_GET["afdeling"])) {
	$afdeling = mysqli_real_escape_string($conn_drupal, $_GET["afdeling"]);
}
else die("?afdeling=.. should be defined");


$startdate = "20100101";
if(isset($_GET["startdate"])) {
	$startdate = mysqli_real_escape_string($conn_drupal, $_GET["startdate"]);
}


$enddate = "29990101";
if(isset($_GET["enddate"])) {
	$enddate = mysqli_real_escape_string($conn_drupal, $_GET["enddate"]);
}

$min_duration = "0";
if(isset($_GET["min_duration"])) {
	$min_duration = mysqli_real_escape_string($conn_drupal, $_GET["min_duration"]);
}




$sql_query="
	SELECT
		tEvent.entity_id as id,
		field_activiteit_locatie_lat as lat,
		field_activiteit_locatie_lon as lon,
		start_date,
		end_date,
		categorie_20,
		leeftijdscategorie_21,
		civiEvent.title as naam,
		tAlgemeen.organisator_19 as organiserende_afdeling,
		TIMESTAMPDIFF(second, start_date, end_date) / 3600.0 as duration
	FROM field_data_field_activiteit_civicrm_event tEvent
	INNER JOIN field_revision_field_activiteit_locatie tLocatie
		ON tEvent.entity_id=tLocatie.entity_id
	INNER JOIN node
		ON tEvent.entity_id = node.nid
	LEFT JOIN jnet1980_test_civicrm.civicrm_event civiEvent
		ON field_activiteit_civicrm_event_target_id = civiEvent.id
   LEFT JOIN jnet1980_test_civicrm.civicrm_value_algemeen_8 tAlgemeen
		ON field_activiteit_civicrm_event_target_id=tAlgemeen.entity_id
	WHERE tAlgemeen.organisator_19 = '$afdeling'
		AND start_date >= $startdate
		AND end_date <= $enddate
		AND duration >= $min_duration
	;";



$res_event_details = mysqli_query($conn_drupal, $sql_query) or die("Error in Selecting " . mysqli_error($conn_drupal));



$event_details = array();
while($row =mysqli_fetch_assoc($res_event_details))
{
	$event_details[] = $row;
}



echo json_encode($event_details, JSON_PRETTY_PRINT);

?>
