<?php
    include 'database.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $sql = "";
        $withEmployees =  $_POST["withEmployees"] === "true";
        if($withEmployees){
            $sql = "select * from (select s.*, GROUP_CONCAT(es.employee) as employees from shift s left join employeeshift es on s.id = es.shift group by s.id) shifts 
            where shifts.scheduledDate between '".$_POST["oldFrom"]."' and '".$_POST["oldTill"]."' and shifts.isActive = 1 order by shifts.scheduledDate";
        }else{
            $sql = "select * from shift where shift.scheduledDate between '".$_POST["oldFrom"]."' and '".$_POST["oldTill"]."' and shift.isActive = 1";
        }
        
        $result = $con->query($sql);
        
        if ($result->num_rows > 0) {
            $earlier = new DateTime($_POST["oldFrom"]);
            $later = new DateTime($_POST["newFrom"]);

            $days = $later->diff($earlier)->format("%a"); 

            $sqlShift = "insert into shift (startH, endH, division, scheduledDate)
            Values ";
            $sqlEmployee = "insert into employeeshift (shift, employee)
            Values ";

            $rowCount = 0;
            while ($row = $result->fetch_assoc()) 
            {
                $newDate = date("Y-m-d", strtotime($row["scheduledDate"].' + '.$days.' days'));

                $sqlShift = $sqlShift."('".$row["startH"]."', '".$row["endH"]."', ".$row["division"].", '".date("Y-m-d", strtotime($newDate))."')";
                if(++$rowCount < $result->num_rows){
                    $sqlShift = $sqlShift.",";
                }
                else{
                    $sqlShift = $sqlShift.";";    
                }
                if($withEmployees && !empty($row["employees"])){
                    //print_r(explode(",", $row["employees"]));
                    $employees = explode(",", $row["employees"]);
                    $employeeCount = 0;

                    foreach ($employees as $employee) {
                        $sqlEmployee = $sqlEmployee."(%PLACEHOLDER_".$rowCount."_PLACEHOLDER%, ".$employee.")";
                        if($rowCount < $result->num_rows){
                            $sqlEmployee = $sqlEmployee.",\n";
                        }
                        else{
                            if(++$employeeCount < sizeof($employees)){
                                $sqlEmployee = $sqlEmployee.",";
                            }else{
                                $sqlEmployee = $sqlEmployee.";";    
                            }
                        }
                    }
                }
                $sqlShift = $sqlShift."\n";
            }

            $con->begin_transaction();
            try{
                $con->query($sqlShift);

                if($withEmployees){
                    $sql = " select * from (select id from shift order by id desc limit ".$rowCount.") ids order by ids.id asc";

                    $result = $con->query($sql);
                    $rowCount = 0;

                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) 
                        {
                            $shiftId = $row["id"];
                            $sqlEmployee = (str_replace("%PLACEHOLDER_".++$rowCount."_PLACEHOLDER%",$shiftId,$sqlEmployee));
                        }
                    }

                    $con->query($sqlEmployee);
                }
                $con->commit();
            } catch (mysqli_sql_exception $exception) {
                echo($exception);
                $con->rollback();
            }        
        }
        else{
            echo "0 results";
        }
        
        $con->commit();
        mysqli_close($con);    
    }
    else{
        http_response_code(404);
    }
?>