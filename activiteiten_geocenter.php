
<?php

require_once $_SERVER['DOCUMENT_ROOT']."/common/db.php"; 

$debug = true;

if ($debug) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}

$startdate = "[should be defined in GET]";
if(isset($_GET["startdate"])) {
	$startdate = mysqli_real_escape_string($conn_drupal, $_GET["startdate"]);
}
else die("?startdate=.. should be defined");


$sql_query="SELECT tEvent.entity_id,field_activiteit_locatie_lat as lat,field_activiteit_locatie_lon as lon, tAlgemeen.organisator_19
	FROM field_data_field_activiteit_civicrm_event tEvent
	INNER JOIN field_revision_field_activiteit_locatie tLocatie ON tEvent.entity_id=tLocatie.entity_id
   LEFT JOIN jnet1980_test_civicrm.civicrm_value_algemeen_8 tAlgemeen ON field_activiteit_civicrm_event_target_id=tAlgemeen.entity_id;";



$res_event_details = mysqli_query($conn_drupal, $sql_query) or die("Error in Selecting " . mysqli_error($conn_drupal));



$event_details = array();
while($row =mysqli_fetch_assoc($res_event_details))
{
	$event_details[] = $row;
}



echo json_encode($event_details, JSON_PRETTY_PRINT);

?>
