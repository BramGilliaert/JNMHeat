
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


$sql_query= 
	"SELECT tAfdeling.entity_id as afdeling_id
		FROM field_data_field_civicrm_contact tAfdeling
	";


$sql_query_test = "SELECT tActiviteit.entity_id as activiteit_entity_id, field_activiteit_civicrm_event_target_id as civiEventId, civiEvent.title,start_date,end_date
	FROM field_data_field_civicrm_contact tAfdeling
	INNER JOIN field_data_field_activiteit_deelnemende_afd tActiviteit
		ON tAfdeling.entity_id = field_activiteit_deelnemende_afd_target_id
	INNER JOIN field_data_field_activiteit_civicrm_event tEvent
		ON tActiviteit.entity_id = tEvent.entity_id
	INNER JOIN node
		ON tActiviteit.entity_id = node.nid
	LEFT JOIN jnet1980_test_civicrm.civicrm_event civiEvent
		ON field_activiteit_civicrm_event_target_id = civiEvent.id
	WHERE node.status=1
		AND start_date >= ;";
$res_event_details = mysqli_query($conn_drupal, $sql_query) or die("Error in Selecting " . mysqli_error($conn_drupal));


/*
SELECT tEvent.entity_id,field_activiteit_adres_thoroughfare,field_activiteit_adres_locality,field_activiteit_adres_premise,field_activiteit_adres_postal_code,
	field_activiteit_locatie_lon,field_activiteit_locatie_lat, tAlgemeen.organisator_19, categorie_20, leeftijdscategorie_21
	FROM field_data_field_activiteit_civicrm_event tEvent
	LEFT JOIN field_revision_field_activiteit_adres tAdres ON tEvent.entity_id=tAdres.entity_id
	LEFT JOIN field_revision_field_activiteit_locatie tLocatie ON tEvent.entity_id=tLocatie.entity_id
    LEFT JOIN jnet1980_test_civicrm.civicrm_value_algemeen_8 tAlgemeen ON field_activiteit_civicrm_event_target_id=tAlgemeen.entity_id
	WHERE field_activiteit_civicrm_event_target_id=".$event["civiEventId"]."
	LIMIT 3;"
*/

$event_details = array();
while($row =mysqli_fetch_assoc($res_event_details))
{
	$event_details[] = $row;
}



echo json_encode($event_details, JSON_PRETTY_PRINT);

?>
