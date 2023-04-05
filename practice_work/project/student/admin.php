<?php
?>
<html>
    <head>
        <title>
            Academic:
        </title>
        <style>
        * {
            font-size: 30px;
            margin: 5px;
        }
    
        label {
            display: block;
        }
    </style>
    </head>
    <body>
        <div id="acad">
            <div id="acd reg">
                <center>
                    <h1>
                        Academic
                    </h1>
                </center>
            </div>
            <!-- label for student academic registration process;programme enrolled,sch,level,campus,
            studymethod,adm year-->
            <div id="content">
            <fieldset>
                 <label>
                        Programme: 
                        <input type="text" name="School">
                 </label>
                    <!-- for the school department allocated -->
                    <label>
                        School: 
                        <input type="text" name="School">
                    </label>
                    <!-- label for the level of education -->
                    <label>
                        Level: 
                        <select id="level">
                    <option value="doctral">Doctorate Degree</option>
                    <option value="bachelor"> Bachelor's Degree</option>
                    <option value="Masters"> Master's Degree</option>
                    <option value="degree">  Degree</option>
                    <option value="diploma">  Diploma</option>
                    <option value="certificate">Certificate</option>
                         </select>
                 </label>
                    <!-- label for the name campus to be joined -->
                    <label>
                        Campus: 
                        <input type="text" name="Campus">
                    </label>
                    <!-- label for the status of the campus;town;main.. -->
                    <label>
                        Center:
                        <select id="Center">
                <option value="full time">Main_Campus</option>
                <option value="part time">Town_Campus</option>
                        </select> 
                    </label>
                    <!-- label for the study method,full_time,part_time;and the year of admission -->
                    <label>
                    Study method: 
                        <select id="study method">
                <option value="full time">Full-time</option>
                <option value="part time">Part-time</option>
                        </select>
                    </label>
                    <label>
                            Admission year: 
                        <input type="No" name="Admission year">
                    </label>
            </fieldset>
            </div>
        </div>

    </body>