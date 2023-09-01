<?php
    include 'database.php';


    print_r($_POST["shift"]);

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $shift = json_decode($_POST["shift"]);

        $sql = "insert into shift (isTemplate, startH, endH, division)
        Values (0,".$shift["startH"].")";

        /*
        $result = $con->query($sql);
        $con->commit();
        mysqli_close($con);   
        */ 
    }
    else{
        http_response_code(404);
    }
?>