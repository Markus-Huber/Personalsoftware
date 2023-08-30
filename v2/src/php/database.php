<?php
ini_set('display_errors', 1); error_reporting(-1);
	
$con = mysqli_connect("localhost", "root", "4PoweR2i16", "shiftscheduler");

if (!$con) {
    echo "Fehler: konnte nicht mit MySQL verbinden." . PHP_EOL;
    echo "Debug-Fehlernummer: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debug-Fehlermeldung: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
$con->begin_transaction();


function endsWith($haystack, $needle) {
    return substr_compare($haystack, $needle, -strlen($needle)) === 0;
}
?>