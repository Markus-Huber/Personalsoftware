<?php
    include 'database.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        //select s.*, GROUP_CONCAT(es.employee) as employees from shift s left join employeeshift es on s.id = es.shift and s.scheduledDate between '2023-08-31' and '2028-09-06' group by s.id;
        $sql = "select * from (select s.*, GROUP_CONCAT(es.employee) as employees from shift s left join employeeshift es on s.id = es.shift group by s.id) shifts 
                where shifts.scheduledDate between '".$_POST["from"]."' and '".$_POST["till"]."' order by shifts.scheduledDate";

        $result = $con->query($sql);
        
        if ($result->num_rows > 0) {
            $arr = [];
            while ($row = $result->fetch_assoc()) 
            {
                $jsonArrayObject = (array('id' => $row["id"], 'referenceDate' => $row["scheduledDate"], 'cm' => $row["division"],
                'mitarbeiter' => $row["employees"], 'begin' => $row["startH"], 'end' => $row["endH"]));
                $arr[$row["id"]] = $jsonArrayObject;
            }
            $json_array = json_encode($arr);
            echo $json_array;
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