<?php
?>
<html>
    <head>
        <title>
            Student Registration
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
        <div id="student">
            <div id="reg">
                <h1>
                    Registration
                </h1>
            </div>
            <div id="nav">
                <ul>
                    <li>Home</li>
                    <li>Academic</li>
                    <li>About</li>
                    <li>Contact</li>
                    <!-- <li></li> -->
                </ul>
            </div>
            <div id="reg-form">
                <fieldset>
                <form>
                <label>
                        Student Number : 
                        <input type="text" name="student no">
                    </label> 
                    <label>
                        First name: 
                        <input type="text" name="last_name">
                    </label>
                    <label>
                        Surname:
                        <input type="text" name="Other_name">
                    </label>
                    <label>
                        Last name: 
                        <input type="text" name="full_name" id="lname">
                    </label>
                    <label for="gender">Gender:
                         <input type="radio" id="male" name="gender">
                         Male:
                     </label>
                    <label>
                         <input type="radio" id="female" name="gender">
                        Female:
                    </label>
                    <label>
                         <input type="radio" id="prefer n" name="gender">
                        Prefer not to say:
                    </label>
                    <label>
                        Birthdate:
                        <input type="text"name="birthdate"id="birthdate">
                    </label>
                </form>
             </div>
            </fieldset>
    </div>
    </body>
</html>