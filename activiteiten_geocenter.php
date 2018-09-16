
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

# Belgium bounding box:   longmin 2.367  latmin  49.500   longmax  6.400  latmax 51.683 
$sql_query="SELECT AVG(field_activiteit_locatie_lat) as lat_center, AVG(field_activiteit_locatie_lon) as lon_center, tAlgemeen.organisator_19 as organiserende_afdeling
	FROM field_data_field_activiteit_civicrm_event tEvent
	INNER JOIN field_revision_field_activiteit_locatie tLocatie ON tEvent.entity_id=tLocatie.entity_id 
   LEFT JOIN jnet1980_test_civicrm.civicrm_value_algemeen_8 tAlgemeen ON field_activiteit_civicrm_event_target_id=tAlgemeen.entity_id
	WHERE field_activiteit_locatie_lon > 2.367 AND field_activiteit_locatie_lon < 6.400 
		AND field_activiteit_locatie_lat > 49.500 AND field_activiteit_locatie_lat < 51.683 
	GROUP BY organiserende_afdeling;";



$res_event_details = mysqli_query($conn_drupal, $sql_query) or die("Error in Selecting " . mysqli_error($conn_drupal));



$event_details = array();
while($row =mysqli_fetch_assoc($res_event_details))
{
	$event_details[] = $row;
}



header('Content-Type: application/json');
echo json_encode($event_details, JSON_PRETTY_PRINT);

?>
