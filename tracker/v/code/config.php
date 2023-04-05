<?php
//
//This has to be teh first statement in a file
namespace tracker;

use mutall;

//
//Resolve the library config file
include_once "../../../schema/v/code/config.php";
//
//The local config file extends the config in the libary
class config extends mutall\config {
    //
    //Title appearing on navigation tab should be the same as the namespace 
    //of this application.
    public string $id = __NAMESPACE__;
    // 
    //The name of the application's database.
    public string $app_db = "mutall_tracker";
    //
    //The title of the application
    public string $title = __NAMESPACE__;
    //
    //
    //Subject comprises of the entity name to show in the home page
    //plus the database it comes from.
    public string $subject_ename = "intern";
    public array $subject;
    //
    //The logo to the application
    public string $logo = "../images/tracker.png";
    //
    //The full trademark name of the application
    public string $trade = "Tracking mutall_data Activities";
    //
    //For advertising purposes
    public string $tagline = "Ensuring Effectiveness in What We Do";
    //
    //The developer image
    public string $dev_img = "../images/carol.jpg";
    //
    //Name of the application developer
    public string $developer = "Carolyne Wangari";
    //
    //The path from where this application was loaded
    public string $path = __DIR__;
    //
    function __construct($path) {
        //
        parent::__construct($path);
        //
        //Subject comprises of the entity name to show in the home page
        //plus the database it comes from.
        $this->subject = [$this->subject_ename, $this->app_db];
    }
}
