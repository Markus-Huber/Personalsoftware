<?php
    include 'database.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $shift = json_decode($_POST["shift"], true);
        $mitarbeiter = $shift["_mitarbeiter"];

        $sql;

        if($_POST["update"] === 'true'){
            $sql = "update shift set startH = \"".$shift["_begin"]."\", endH = \"".$shift["_end"]."\", division = ".$shift["_cm"].", scheduledDate =\"".$shift["_referenceDate"]."\" 
            where id = ".$shift["_id"];
        }else{
            $sql = "insert into shift (startH, endH, division, scheduledDate)
            Values (\"".$shift["_begin"]."\",\"".$shift["_end"]."\",".$shift["_cm"].",\"".$shift["_referenceDate"]."\")";    
        }

        $con->begin_transaction();
        try{
            $con->query($sql);
            $result;

            if($_POST["update"] === 'true'){
                $sql = "delete from employeeshift where shift=".$shift["_id"];
                $con->query($sql);

                $result = $con->query("select id from shift where id=".$shift["_id"]);
            }else{
                $result = $con->query("select max(id) as id from shift");
            }

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

                    $sql = "select * from (select s.*, GROUP_CONCAT(es.employee) as employees from shift s left join employeeshift es on s.id = es.shift group by s.id) shifts 
                    where shifts.id = ".$shiftId." order by shifts.scheduledDate";

                    $result2 = $con->query($sql);
                    
                    if ($result2->num_rows > 0) {
                        while ($row2 = $result2->fetch_assoc()) 
                        {
                            $jsonArrayObject = (array('id' => $row2["id"], 'referenceDate' => $row2["scheduledDate"], 'cm' => $row2["division"],
                            'mitarbeiter' => $row2["employees"], 'begin' => $row2["startH"], 'end' => $row2["endH"]));
                            echo json_encode($jsonArrayObject);
                        }
                    }
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