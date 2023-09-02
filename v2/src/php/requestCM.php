<?php
    include 'database.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $sql = "select * from division where isActive = 1";

        $result = $con->query($sql);
        
        if ($result->num_rows > 0) {
            $arr = [];
            while ($row = $result->fetch_assoc()) 
            {
                $jsonArrayObject = (array('id' => $row["id"], 'name' => $row["name"], 'color' => $row["color"]));
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