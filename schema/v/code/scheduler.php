<?php

namespace mutall;
//
//Resolve the reference to the database
include_once 'schema.php';
//
//The scheduler is responsible for creating jobs that are repetitive and those
//that are not repetitive.
class scheduler extends component {

    //
    //This is the full path to the file constructed from the document root and
    //the partial path.
    public string $crontab_data_file;
    //
    //This is the full path to the constructed at files from the document root
    //and it includes the partial path
    public string $at_batch_file;
    //
    //The database object that allows for retrieving queried data(why private??)
    private database $database;
    //
    //THe connection to the database
    public $db;
    //
    //The recursion associated with an event
    public object $recursion;
    //
    //The pk of a job
    public int $pk;
    //
    //The message of a job
    public string $message;
    //
    //The start date of a crontab event
    public  string $start_date;
    //
    //The end date of an event, and on this date, the event should be removed
    //from the database
    public string $end_date;
    //
    //The start date associated with at jobs
    public string $date;
    //
    //The errors associated with the event
    public array $errors = [];
    //
    //The errors that are flagged during the execution of at jobs
    public string $at_error;
    //
    //Errors flagged during the update of cron jobs
    public string $update_error;
    //
    //The name of the job that is saved into the database
    public string $job_name;
    //
    //constructor
    function __construct() {
        //
        //The crontab data file
        $this->crontab_data_file = component::home . component::crontab_file;
        //
        //The at job batch file
        $this->at_batch_file = component::home . component::at_file;
        //
        //
        //Establish a connection to the database(using an incomplete database)
        $this->database = new database("mutall_users", false);
    }
    //
    //Scheduling the requested job
    public function execute(
        //
        //Get the name of the job saved in the database
        string $job_name,
        //
        //It is true when we need to rebuild the crontab, otherwise it is false
        bool $update,
        //
        //The list of at commands as defined in the run_at_commands() below
        array/*<at>*/ $ats
    ): array /*errors|output*/ {
        //
        //Save the job name for use later
        $this->job_name = $job_name;
        //
        //2. Refresh the crontab if necessary
        if ($update) $this->update_cronfile();
        //
        //1. Issue the at commands
        //Loop through all the at commands and execute each one of them
        foreach ($ats as $at) {
            $this->run_at_command($at);
        }
        //
        //Return the collected errors
        return $this->errors;
    }
    //
    //Run the at commands on a given date with a specific message
    /**
     * 
    The at command is either for:-
    type at =
        //
        //- sending a message indirectly using a job number(from which the message
        //can be extracted from the database)
        { type: "message", date: string, message: number,recipient:recipient }
        //
        //- or for initiating a fresh cronjob on the specified date
        | { type: "refresh", start_date: string, end_date: string };
     */
    public function run_at_command(object $at): void {
        //
        //Set the home directory reference for the command.
        $home = component::home;
        //
        //Set the log file to record the errors if any.
        $log = component::log_file;
        //
        //1. Write a query to extract the at job from the database
        $sql = '
        select 
            activity.name,
            activity.msg,
            activity.command,
            activity.recursion->>"$.repetitive" as repetitive,
            recursion->>"$.send_date" as send_date
        from activity 
        where activity.recursion->>"$.repetitive"="no" 
        and recursion->>"$.send_date">= now()
        ';
        //
        //2. Run the query and return the results
        $jobs = $this->database->get_sql_data($sql);
        //
        //3. Compile the batch of at jobs to be executed
        $batch = "";
        //
        //3. Iterate through all the at jobs, creating setting a different execution depending on their types
        // to eventually compile the jobs
        foreach ($jobs as $job) {
            //
            //Extract the send date for the job
            $date = $job["send_date"];
            //
            //There are three types of at commands:- 
            switch ($at->type) {
                    //
                case "message":
                    //
                    //A command for sending a message to a user at a specified time.
                    //
                    //Get the message to send as a job.
                    $msg = $at->message;
                    //
                    //We also need the type of recipient(individual or group) 
                    //to send the message.
                    $type = $at->recipient->type;
                    //
                    //Get the message recipient depending on the type.
                    $recipient = $type === "group" ? $at->recipient->business->id : $at->recipient->user;
                    //
                    //Formulate the linux command to run.
                    //
                    //The command parameters. They are:- msg(job_number),type(of
                    //recipient), and extra(further details depending on the type
                    //of recipient).
                    $parameters = "$msg $type $recipient";
                    //
                    //The schedule messenger file
                    $file = "$home/scheduler_messenger.php";
                    //
                    //Modify the permissions on the messenger file
                    \shell_exec("chmod 777 $file");
                    //
                    //Remove the additional line feeds in the file
                    \shell_exec("dos2unix $file");
                    //
                    //The file to execute at the requested time.
                    $command = "$file $parameters | at $date";
                    //
                    //Add this at job to the batch of at jobs
                    $batch .= $command;
                    //
                    break;
                    //
                case "refresh":
                    //
                    //The command for rebuilding the crontab
                    $command = "$home/scheduler_crontab.php | at $date ";
                    //
                    //Add this type of job to the batch of at jobs
                    $batch .= $command;
                    //
                    break;
                    //
                case "other":
                    //
                    //The user specified at jobs
                    $other = $job["command"];
                    //
                    //The file to execute in the case of other types of at jobs
                    $file = "$home" . "/$other";
                    //
                    //A user defined command to run.
                    $command =  "$file | at $date";
                    //
                    //Add the other type of a at job to the batch of at jobs
                    $batch .= $command;
                    //
                    //
                    //Remove the trailing characters generated by the different operating systems
                    shell_exec("dos2unix $file");
                    //
                    //modify the permissions to allow saving the job to the database
                    shell_exec("chmod 777 $command");
                    //
                    break;
                    //
                default:
                    //
                    //Any other unhandled type should be reported as an error.
                    throw new \Exception("Command type for an at job is not supported.");
            }
        }
        //
        //Compile the batch of at jobs into a at file
        \file_put_contents($this->at_batch_file, $batch);
        //
        //Make the batch file executable from the command line
        \shell_exec("chmod 777 $this->at_batch_file");
        //
        //Clear the at queue before loading the new batch of at jobs
        \shell_exec(" atrm $(atq | cut -f1)");
        //
        //The at command that loads the batch file
        $at = "at -f $this->at_batch_file now";
        //
        //Run the at batch file to load the at jobs from the batch file
        $result = \shell_exec($at);
        // //
        // //Construct the command to be executed at the requested date. All the at 
        // //commands are constrained to run at midday.
        // $exe = "echo '$command' | at $time $date >> $log";
        // //
        // //Execute the command and collect the results.
        // //(Put the shell_exe in component class).
        // $result = shell_exec($exe);
        //
        //If the result is null, there is a problem with the at command.
        if (is_null($result)) {
            //
            //Log the error
            array_push($this->errors, "This at command '$at' returned an unexpected null.");
            //
            //Stop the process.
            return;
        }
        //
        //Test whether the at command executed at all.
        if (!$result) {
            //
            array_push($this->errors, "The at command '$at' failed to execute.");
        }
    }
    //
    //Refreshing the cron-file with the newly created crontab. This method runs a
    //query that extracts all jobs that are active. i.e jobs started earlier than 
    //today and end later than today. start_date<job>end_date
    public function update_cronfile(): void {
        //
        //1. Formulate the query that gets all the current jobs 
        //i.e., those whose start date is older than now and their end date is
        //younger than now(start_date <= now()< end_date)
        $sql = '
        select 
            activity.name,
            activity.msg,
            activity.command,
            activity.recursion->>"$.repetitive" as repetitive,
            recursion->>"$.start_date" as start_date,
            recursion->>"$.end_date" as end_date,
            recursion->>"$.frequency" as frequency 
        from activity 
        where activity.recursion->>"$.repetitive"="yes" 
        and recursion->>"$.start_date"<= now()<recursion->>"$.end_date"
        ';
        //
        //2. Run the query and return the results
        $jobs = $this->database->get_sql_data($sql);
        //
        //3. Initialize the crontab entries
        $entries = "";
        //
        //4. Loop over each job, extracting the frequency as part of the entry.
        foreach ($jobs as $job) {
            //
            //Get the frequency of the job
            $freq = $job['frequency'];
            //
            //Compile the user
            $user = component::user;
            //
            //The directory where the command file is located
            $directory = component::home;
            //
            //The php command file
            $file = $job['command'];
            //
            //The arguments passed
            $arg = $job['name'];
            //
            //The log file
            $log = ">> " . $directory . component::log_file;
            //
            //The crontab file and the job number makes up the command
            $command = $directory . $file . " " . $arg . "";
            //
            //The crontab entry for sending messages
            $entry = "$freq $command $log \n";
            //
            //Add it to the list of entries
            $entries .= $entry;
            //
            //Remove the trailing characters generated by the different operating systems
            shell_exec("dos2unix $file");
            //
            //modify the permissions to allow saving the job to the database
            shell_exec("chmod 777 $command");
        }
        //
        //5. Create a cron file that contains all crontab entries.
        file_put_contents($this->crontab_data_file, $entries);
        //
        //Modify the file permissions
        shell_exec("chmod 777 $this->crontab_data_file");
        //
        //6. Compile the cronjob. 
        //NOTE:- The php user is identified by www-data
        //and a user needs permissions to set up a crontab otherwise it wont execute
        $command = "crontab " . component::user . $this->crontab_data_file . "";
        //$command= "lss -l";
        //  
        //7. Run the cron job
        $result = shell_exec($command);
        //
        //At this the shell command executed successfully
        if (is_null($result)) {
            //
            //This is a successful execution. Return nothing
            return;
        }
        //At this the shell command executed successfully or it failed. Test whether
        //it failed or not.
        if (!$result)
            throw new \Exception("The crontab command for '$command' failed with the "
                . "following '$result'");
        //
        //The shell command succeeded with a resulting (error) message. Add it to
        //the error collection for reporting purposes.
        array_push($this->errors, $result);
    }
}
