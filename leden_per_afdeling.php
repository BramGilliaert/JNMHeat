
<?php

require_once $_SERVER['DOCUMENT_ROOT']."/common/db.php"; // gives $conn_civi and $conn_drupal

$sample_date = null; // new DateTime("2018-08-31");
if(isset($_GET["sample_date"]))
	$sample_date = new DateTime($_GET["sample_date"]);
else die("&sample_date must be set. Example: 20180101");

$sample_date = $sample_date->format('Y-m-d');
$sample_date = "2018-05-31";

$sql_relations_in_period = "SELECT afd_id, afd_name, COUNT(lid_id) as count FROM
(
	SELECT DISTINCT tCont.id as lid_id, tCont.sort_name as lid_name, contact_id_b as afd_id, tAfd.sort_name as afd_name
	FROM civicrm_relationship tRel
	LEFT JOIN jnet1980_test_civicrm.civicrm_contact tCont ON contact_id_a = tCont.id
	LEFT JOIN jnet1980_test_civicrm.civicrm_contact tAfd ON contact_id_b = tAfd.id
	LEFT JOIN jnet1980_test_civicrm.civicrm_value_lid_relatie_7 tLid2 ON tLid2.entity_id=tRel.id
	#LEFT JOIN jnet1980_test_civicrm.civicrm_membership tMem ON tMem.contact_id=tCont.id
	WHERE relationship_type_id=11
	AND contact_id_b in (6,7,9,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,47,48,49,50,51,52,53,54,57,58,59,61,62,64,68,70,78,85,89,98,104,163,170,231,381,483,683,687,692,695,699,717,940,941,944,946,951,962,963,965,973,984,986,988,989,993,994,995,996,997,998,999,1002,1003,1010,12417,12715, 
	    39,14070,15651,1,8,10,11,46,55,56,16783)
	AND tLid2.is_hoofdafdeling__16 = 1
	AND tRel.start_date<'$sample_date' AND (tRel.end_date>'$sample_date' OR (tRel.end_date is NULL AND tRel.is_active))
) as tmp
GROUP BY afd_id
;";

$json_result = array();

$res_relations_in_period = mysqli_query($conn_civi, $sql_relations_in_period) or die("Error in Selecting " . mysqli_error($conn_civi));

while($row = mysqli_fetch_assoc($res_relations_in_period))
{
	$it = $row["afd_id"];
	if (!isset($json_result[$it]))
	{
		$json_result[$it] = array();
	}

	$json_result[$it]["name"] = $row["afd_name"];
	$json_result[$it]["aantal_leden"] = $row["count"];
}

header('Content-Type: application/json');
echo json_encode($json_result, JSON_PRETTY_PRINT);

?>