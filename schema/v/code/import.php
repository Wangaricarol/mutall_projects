<?php
//
//This is the file to be used to control server to server operations
//
//The namespace through of all our applications
namespace mutall;
//
//Initialize the buffer.
\ob_start();
//
//Set the error handler mechanism to catch errors and warnings during the
//programs' execution
\set_error_handler(function (
    $errno,
    $errstr,
    $errfile,
    $errline /*, $errcontext*/
) {
    throw new \ErrorException($errstr, $errno, \E_ALL, $errfile, $errline);
});
//
//Include all the needed files for server side execution within a try catch block
//and collect the errors into an error log
try{
    //
    //Set the server document root
    //
    //Include all the necessary files
    //
    //Initialize the connection to the mutall_users data base

}
catch($ex){
    //
    //Log any exception into the error log file created

}