
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


$sql_query = "SELECT tActiviteit.entity_id as activiteit_entity_id, field_activiteit_civicrm_event_target_id as civiEventId, civiEvent.title,start_date,end_date
	FROM field_data_field_civicrm_contact tAfdeling
	INNER JOIN field_data_field_activiteit_deelnemende_afd tActiviteit
		ON tAfdeling.entity_id = field_activiteit_deelnemende_afd_target_id
	INNER JOIN field_data_field_activiteit_civicrm_event tEvent
		ON tActiviteit.entity_id = tEvent.entity_id
	INNER JOIN node
		ON tActiviteit.entity_id = node.nid
	LEFT JOIN jnet1980_test_civicrm.civicrm_event civiEvent
		ON field_activiteit_civicrm_event_target_id = civiEvent.id
	WHERE tAfdeling.field_civicrm_contact_contact_id IN ($afdeling)
		AND node.status=1
	ORDER BY field_activiteit_civicrm_event_target_id DESC LIMIT 2000;";
$res_event_details = mysqli_query($conn_drupal, $sql_query) or die("Error in Selecting " . mysqli_error($conn_drupal));


$event_details = array();
while($row =mysqli_fetch_assoc($res_event_details))
{
	$event_details[] = $row;
}



echo json_encode($event_details, JSON_PRETTY_PRINT);

?>
