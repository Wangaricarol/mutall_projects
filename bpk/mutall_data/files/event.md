# Events Module

In general, this module is for helping users (service providers and consumers) to plan and execute events pertaining to their business activities.

In particular, for the chama application, it is for helping its group members manage their events in a systematic way.

For this version, chama application's emphasis is on planning. We will focus on:- 

    1. Capture events planned by the group, od hoc events & those that occur on a regular basis.

    2. Communicate to users when events occur. 

    3 Maintain proper accounting books for all contributions made by members.

***Date: 25-03-2022***

![](events.svg)

## User Interface

Involves designing HTML5 data collection templates and collecting data from them. The following are the tasks involved:-

1. Modify the current event planner template(JK).  
    1.1 [x] Rename ID with Name  
    1.2 [x] Add Description section, should a textarea.  
    1.3 [x] Add job table to the events template. The recusion column should be a button that calls a template that can allows us to add the firing pattern.  
    1.4 [ ] Design the firing template with the following fieldsets(PK):  
        - is the job repetitive.
        - the firing times from minutes through to hour to week day.  
        1.4.1 Refine how you capture from events template the repetitive  

2. Include a feature that asks the user if s/he wants to schedule a task to inform the user of the event (JK+FN)  
            2.1. [x] Rename the scheduler table and have it named job in the database.(FN).  
            2.2. [x] Attributes(FN)=> Job.No, Job.Message, Job.Recusion.where:-  
              - the number and event are unique indetifier for the job  
              - the message is the reminder to be sent to users  
              - and recusion is the rate at which the messages are sent.  
             2.3 [ ] Define and document the a formal syntax of the recusion(FN).  
                2.3.1 refine how repetitive tasks are captured in the recursion column in the database(job table)  

3. [ ] Design a event planner class that extends a baby inculding how to call the firing template.(PK/FN)

4. [x] Test if the template viewer works for the new event(JK).
    4.1 [x] Ensure that your library(outook,schema) are syncronised via git repo(JK/FN).
    4.2 [x] Recompile rentize and ensure the html viewer is available(JK/PK)
    4.3 [x] Test if the event template is lively(JK).  
5. [x] Review the agenda and minutes sub-model(FN)  
    5.1 Edit the current model to add minute table. This table has the following foreign key links:-
        - event 
        - user
        - self looping link to minutes  
    - Has the following attributes:-    
        - minute number
        - identication whether its an agenda item or not
        - date when it was done
        - details/descriptions of the minute      
    - its identified by:-
        - minute number.
        - parent minute. 

## Technologies

Involves ***Cron-job tool*** (Cron is a utility program that lets users input commands for scheduling tasks repeatedly at a specific time. Tasks scheduled in cron are called cron jobs) **and** ***SSH2 Library***.

The following are the tasks involved:-

1. [ ] Study more on cron job with a view of controlling their life cycle.  
    1.1 USe the at command and cron tab command to schedule repetitve and non-repetitive tasks(PK).  
        1.1.1 Write a php file that uses SSH2 library to program the server to execute a job  
            - refine how to save repetitive event data.  
        1.1.2 Research on how to use the cron tab to add and remove commands using SSH2.