<?php
//This are the login credentials
$servername = "localhost";
$username = "root";
$password = "";
//
//connecting to the database

$conn = new PDO("mysql:host=$servername;dbname=school_2", $username, $password);
  
$sql="select  distinct grade, percent from score";

//use a connection 
foreach ($conn->query($sql) as $row) {
     print $row['grade'] . "<br>";
      print $row['percent']."\n";
   }
   
//converting an array into a string
 
?>
