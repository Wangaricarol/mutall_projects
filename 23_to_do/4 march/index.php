<?php
//
//get the file
$content=file_get_contents("./before.txt");
//echo $content;
// 
// Remove additional character from the file 
$results=preg_replace("/[.]$/","",$content);
echo $results;
$result=preg_replace("/[.*]\s*/",",",$results);
// 
// Write the changes to the csv files 
$after=file_put_contents("after.csv",$result);
echo $after;
// 
// 