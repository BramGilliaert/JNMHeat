
<?php

require_once $_SERVER['DOCUMENT_ROOT']."/common/db.php"; // gives $conn_civi and $conn_drupal

// Much code is recycled from event.php


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

$afdelingen = $afdeling;

$sql_afdeling_to_event = "SELECT field_civicrm_contact_contact_id, tAfdeling.entity_id, tActiviteit.entity_id, field_activiteit_civicrm_event_target_id, node.status
	FROM field_data_field_civicrm_contact tAfdeling
	INNER JOIN field_data_field_activiteit_deelnemende_afd tActiviteit
		ON tAfdeling.entity_id = field_activiteit_deelnemende_afd_target_id
	INNER JOIN field_data_field_activiteit_civicrm_event tEvent
		ON tActiviteit.entity_id = tEvent.entity_id
	INNER JOIN node
		ON tActiviteit.entity_id = node.nid
	WHERE field_civicrm_contact_contact_id IN ($afdelingen)
		AND node.status=1
	ORDER BY field_activiteit_civicrm_event_target_id DESC LIMIT 1000;"; // Assuming that more recent events have higher IDs
$res_afdeling_to_event = mysqli_query($conn_drupal, $sql_afdeling_to_event) or die("Error in Selecting " . mysqli_error($conn_drupal));

//$merged_events = array();
while($row =mysqli_fetch_assoc($res_afdeling_to_event))
{
	$merged_events[] = $row["field_activiteit_civicrm_event_target_id"];
}


$merged_events = array_unique($merged_events, SORT_REGULAR);
sort($merged_events);
$merged_csv = implode(",", $merged_events);


$sql_event_details = "SELECT tEvent.id,tDrupalEvent.entity_id,title,start_date,end_date FROM civicrm_event tEvent LEFT JOIN jnet1980_test_drupal.field_data_field_activiteit_civicrm_event tDrupalEvent on tDrupalEvent.field_activiteit_civicrm_event_target_id=tEvent.id WHERE tEvent.id IN (".$merged_csv.");";

$res_event_details = mysqli_query($conn_civi, $sql_event_details) or die("Error in Selecting " . mysqli_error($conn_civi));

$event_details = array();
while($row =mysqli_fetch_assoc($res_event_details))
{
	$event_details[] = $row;
}




function decorateEvent($event)
{
	global $conn_drupal;

	$sql_event_to_adres = "SELECT tEvent.entity_id,field_activiteit_adres_thoroughfare,field_activiteit_adres_locality,field_activiteit_adres_premise,field_activiteit_adres_postal_code,
	field_activiteit_locatie_lon,field_activiteit_locatie_lat, tAlgemeen.organisator_19, categorie_20, leeftijdscategorie_21
	FROM field_data_field_activiteit_civicrm_event tEvent
	LEFT JOIN field_revision_field_activiteit_adres tAdres ON tEvent.entity_id=tAdres.entity_id
	LEFT JOIN field_revision_field_activiteit_locatie tLocatie ON tEvent.entity_id=tLocatie.entity_id
    LEFT JOIN jnet1980_test_civicrm.civicrm_value_algemeen_8 tAlgemeen ON field_activiteit_civicrm_event_target_id=tAlgemeen.entity_id
	WHERE field_activiteit_civicrm_event_target_id=".$event["id"]."
	LIMIT 3;";

	$res_event_to_adres = mysqli_query($conn_drupal, $sql_event_to_adres) or die("Error in Selecting " . mysqli_error($conn_drupal)."  id=".$event["id"]);

	$adres_row = null;
	while($row =mysqli_fetch_assoc($res_event_to_adres))
	{
		$adres_row = $row;
		break;
	}

	$adres = $adres_row["field_activiteit_adres_thoroughfare"]." ".$adres_row["field_activiteit_adres_postal_code"].", ".$adres_row["field_activiteit_adres_locality"];
	if (empty($adres_row["field_activiteit_adres_thoroughfare"]) &&
		empty($adres_row["field_activiteit_adres_postal_code"]) && 
		empty($adres_row["field_activiteit_adres_locality"]))
		$adres = "";
	if(empty($adres)) $adres = "";

	$tmp = $event; //new object();
	$tmp["adres_string"] = $adres;
	$tmp["adres_thoroughfare"] = $adres_row["field_activiteit_adres_thoroughfare"];
	$tmp["adres_postal_code"] = $adres_row["field_activiteit_adres_postal_code"];
	$tmp["adres_locality"] = $adres_row["field_activiteit_adres_locality"];
	$tmp["field_activiteit_locatie_lon"] = $adres_row["field_activiteit_locatie_lon"];
	$tmp["field_activiteit_locatie_lat"] = $adres_row["field_activiteit_locatie_lat"];
	$tmp["organisator"] = $adres_row["organisator_19"];
	$tmp["categorie"] = $adres_row["categorie_20"];
	$tmp["leeftijdscategorie"] = $adres_row["leeftijdscategorie_21"];
	return $tmp;
}


$features = array();

$all = new stdClass();

foreach($event_details as &$event) // Note the & to pass by reference
{
	$tmp = decorateEvent($event);

	if($tmp["field_activiteit_locatie_lon"] == null || $tmp["field_activiteit_locatie_lon"] == "")
	{
		continue;
	}

	$coordinates = array();
	array_push($coordinates, $tmp["field_activiteit_locatie_lon"]);
	array_push($coordinates, $tmp["field_activiteit_locatie_lat"]);

	$geometry = new stdClass();
	$geometry->coordinates = $coordinates;
	$geometry->type = "Point";

	$feature = new stdClass();
	$feature->geometry = $geometry;
	$feature->properties = new stdClass();
	$feature->type = "Feature";

	array_push($features, $feature);

	foreach ($tmp as $key => $value) {
		$feature->properties->{$key} = $value;
	}
}
$all->features =  $features;
echo json_encode($all, JSON_PRETTY_PRINT);

?>
