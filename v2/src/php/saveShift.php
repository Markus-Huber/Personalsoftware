<?php
    include 'database.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $shift = json_decode($_POST["shift"], true);
        $mitarbeiter = $shift["_mitarbeiter"];

        $sql = "insert into shift (startH, endH, division, scheduledDate)
        Values (\"".$shift["_begin"]."\",\"".$shift["_end"]."\",".$shift["_cm"].",\"".$shift["_referenceDate"]."\")";

        $con->begin_transaction();
        try{
            $con->query($sql);
            echo("\n");
            $result = $con->query("select max(id) as id from shift");

            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) 
                {
                    $shiftId = $row["id"];

                    $sql = "insert into employeeshift (shift, employee)
                    Values ";

                    $numItems = count($mitarbeiter);
                    $i = 0;
                    foreach ($mitarbeiter as &$arbeiter) {
                        $sql = $sql."(".$shiftId.",".$arbeiter.")";
                        if(++$i != $numItems) {
                            $sql = $sql.",";
                        }
                    }
                    unset($arbeiter);

                    $con->query($sql);
                }
            }

            $con->commit();
        } catch (mysqli_sql_exception $exception) {
            echo($exception);
            $con->rollback();
        }
        mysqli_close($con);       
    }
    else{
        http_response_code(404);
    }
?>