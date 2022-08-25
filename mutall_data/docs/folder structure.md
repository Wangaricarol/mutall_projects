# FOLDER STRUCTURE

## Why

Written by: [Daniel Kaniu](https://hallelujah-technologies.web.app/)

> There are 2 main frameworks developed by the mutall_data team, namely: - ***outlook*** and ***schema***. 

Outlook best represents the front-end component of applications whilst schema represents the back-end component of applications. 
They were developed to ensure a systemic delivery of service, by the mutall_data team, whereby all the necessary resources (in the form of classes and methods) are put in one place. 
The reason for having the resources in one place is to build capacity to develop and deploy web applications in record time while at the same time incorporating best computer programming practices; borrowed from International Coding Standards and Best Practices.

## Root
> The set up for outlook and schema frameworks, on a personal computer, ought to be implemented in adherence to the mutall_data recommended folder structure. 

Assuming you are developing a web application and you want to use mutall_data frameworks, you will want to folder your application in compliance to the Mutall -specific structure. The structure is represented as follows:-
 
![mutall_data recommended folder structure](/folder.png)

As you can see in picture 1, we have a folder called mutall_projects in the document root path of the computer. It is in the mutall_projects folder that we have put the folders of the specific applications *, i.e., kentionary, chama, tracker, et al*. 

> We have configured xampp server to make mutall_projects folder the root path. Visit the following link to see how to do that. [Change Xampp's root directory](https://stackoverflow.com/questions/18902887/how-to-configuring-a-xampp-web-server-for-different-root-directory)

It is also in the same folder that we have both the outlook and schema frameworks. This makes it possible to have a seamless communication between the applications and the 2 frameworks.

## Applications

When linking an application to the frameworks, we specify paths that allow the application to get access to the required files in the frameworks; in order to access their classes and methods. Let’s illustrate this with an example; let’s say you want to access the app class (which is in outlook framework in a file called app.ts), you will have to include the following path in the application's  file (preferably as the very first line of code) that wants to access the app class. 

>The path is as follows:- 
>>import * as app from "../../../outlook/v/code/app.js";

Mutall team generally codes using Typescript programming language and the Typescript files are transpiled to JavaScript code. And it is this JavaScript file that we use in the path above, instead of the Typescript file. This is because browsers mostly understand JavaScript, which is the main Document Object Module (DOM) manipulation language; and not Typescript. 

## Version & Code (V & Code)
An important aspect to note is the use of the two folders called v and code. Let’s assume you are developing an application called tracker, and you have put the tracker folder in the mutall_projects folder, it will be fundamental to incorporate folder v into your tracker folder then add another folder called code into the v folder. 

Now that you have seen that having v and code folders is important, you can incorporate them into your application by following the steps below:- 
+ Create the folder (in our case we have mutall_projects folder) which is to house all your applications and put it inside your your computer's drive.
+ Make the above created folder the root document path, in xampp server.
+ Create a folder for your application, give it any name you want, e.g., tracker.
+ Create a folder called v and put it inside the tracker folder.
+ Create a folder called code and put it inside the v folder.
+ Put all your source code inside the code folder.

Upon conforming to the stipulated Mutall folder structure, you will now be able to access the public classes and methods (from your application) that are in app.js file which is in this path: -

>import * as app from "../../../outlook/v/code/app.js";. 

In case you are wondering; the v folder is the one that controls the application's versions. For instance, we put the current version of an application, which is in the development phase, in the v folder. This is also the version of the application that you deploy. And when you want to develop a different version of the application, you rename the current v folder to v1, so that you now 2 folders, i.e., v and v1. V1 will be the previous version and v will now be the new version of the application.
