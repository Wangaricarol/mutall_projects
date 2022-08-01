<?php
//
//This has to be teh first statement in a file
namespace rentize;
//
//Resolve the library config file
include_once "../../../schema/v/code/config.php";
//
//The local config file extends the config in the libary
class config extends \config{
    //
    //Title appearing on navigation tab should be the same as the namespace 
    //of this application.
    public string $id =__NAMESPACE__;
    //
    //The systems title
    public string $title = __NAMESPACE__;
        // 
    //The name of the application's database.
    public string $app_db = "rentize"; 
    //
    //This is the logo's file name in the images sub-folder.
    public string $logo = "rentize.png";
    //
    //Subject comprises of the entity name to show in the home page
    //plus the database it comes from.
    public string $subject_ename="wmeter";
    public array $subject;
     //
    //The full trademark name of the application
    public string $trade = "Managing rental services";
    //
    //For advertising purposes
    public string $tagline= "Delivering easier housing and management";
    //
    //Name of the application developer
    public string $developer = "James Ndichu";
    //
    //This is the developers file name image.
    public string $developer_image = "carol.jpg";
    //
    //The path from where this application was loaded
    public string $path=__DIR__;
    //
    function __construct(){
        //
        parent::__construct();
        //
        //Subject comprises of the entity name to show in the home page
        //plus the database it comes from.
        $this->subject= [$this->subject_ename, $this->app_db];
    }
}
