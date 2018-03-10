<?php
function execPrint($command) {
    $result = array();
    exec($command, $result);
    foreach ($result as $line) {
        print($line . "<br/>\n");
    }
}
// Print the exec output inside of a pre element
print("<pre>" . execPrint("wget https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%28node%5B%22operator%22%3D%22JNM%22%5D%2848%2E951366470948%2C0%2E59326171875%2C52%2E583025861416%2C8%2E6846923828125%29%3Bway%5B%22operator%22%3D%22JNM%22%5D%2848%2E951366470948%2C0%2E59326171875%2C52%2E583025861416%2C8%2E6846923828125%29%3B%29%3Bout%3B%3E%3Bout%20skel%20qt%3B%0A -O lokalen.json && echo 'Cache was updated' && cat lokalen.json | grep \'name\'") . "</pre>");

?>
