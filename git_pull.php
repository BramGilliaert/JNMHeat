<?php
function execPrint($command) {
    $result = array();
    exec($command, $result);
    foreach ($result as $line) {
        print($line . "<br/>\n");
    }
}
// Print the exec output inside of a pre element
print("<pre>" . execPrint("git commit -a -m \"change color image Lokaal.png\"") . "</pre>");

?>