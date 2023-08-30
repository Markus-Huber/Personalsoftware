<?php
    include 'database.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $sql = "select * from employee where isActive = 1 and id in (select employee from employeestandort where standort = ".$_POST["standort"].")";

        $result = $con->query($sql);
        
        if ($result->num_rows > 0) {
            $arr = [];
            while ($row = $result->fetch_assoc()) 
            {
                $jsonArrayObject = (array('id' => $row["id"], 'firstName' => $row["firstName"], 'lastName' => $row["lastName"],
                'workingHours' => $row["workingHours"]));
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