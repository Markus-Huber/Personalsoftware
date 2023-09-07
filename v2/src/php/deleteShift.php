<?php
    include 'database.php';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        //select s.*, GROUP_CONCAT(es.employee) as employees from shift s left join employeeshift es on s.id = es.shift and s.scheduledDate between '2023-08-31' and '2028-09-06' group by s.id;
        $sql = "update shift set isActive = 0 where id = ".$_POST["shift"];
        $con->query($sql);        
        $con->commit();
        mysqli_close($con);    
    }
    else{
        http_response_code(404);
    }
?>