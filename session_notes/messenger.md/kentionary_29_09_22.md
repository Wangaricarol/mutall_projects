**Agenda in Kentionary.**

___
![messenger_module](messenger.svg)

## Content

___

### (1) TextAreas

1. Research about all properties and methods of a textArea to understand its capabilities and limitations  
        1.1 [x] Demo on how this validation work in a textarea(PK)  
            - You can set a custom validity for any type if input type.  
        1.2 [x] How would you mark a section in a textarea(FN)  
        1.3 [x]How to extract selected text in a textarea(JN)  
            1.3.1 Next session show a demo on how to extract the selected text.  

### (2) Special-Editors

1. [ ] Understand the documentation of Monaco(PK)
2. [x] Install and set it up(PK)
3. [ ] Run a demo on your machine
4. [ ] Investigate the Monaco textarea methods that supercede those of the TextAreaElement.(Investigate multiple highlighting).
      1. If you have some text such as *My namee is Muraya*. Mark the `namee` and `Muraya`.(PK)

## Services

___

### (3) Send Messages

1. [ ]How do we collect the data that we require for all the interfaces that we implement.  
        1.1[x] Complete the get_layout() method of the new_message class(PK)  
            1.1.1 [x] Get the updated template  
            1.1.2 [x] Complete the individual method to get data from the template.  
        1.2[x] Revise the check() method of the new class so that it  logically follows the template(FN)  

### (4) Reply Messages

1.[ ] Design the code for replying to a selected message using the template(FN).

        1.1[x] Figure out how to get the selected message from the message panel in application page.
            2.1.1[x] Investigate where the message panel is displayed in the outlook library.  
            2.1.2[x] Understand the theme class methods and properties.  
            2.1.3[x] Use the message to find out what the message selected is.  
            2.1.4[x] Extract the message primary key from the selected.  
        1.2 Copy the new_message.get_layout steps from kentionary to tracker and implement them.  
            2.2.1[x] Document the get_layout code.  
            2.2.2[x] Push layouts to array rather than simple expressions.  
            2.2.3 Implement the journal interface for a reply message if there is a contribution amount invovled(PM).  
        1.3[x] Complete the reply_message.check() method(FN).  
            2.3.1 Collect and check the reply message properties.  
        1.4[x] Complete the save method in the writer module(PK)  

## Technology

___

### (5)Sms

1. Write a twilio class to send messages in js(PK).  
        1.0 Harmonize manually the module ts in tracker n kentionary.  

        1.1 [x] Set up ways of collaborating with git so that this harmonization is activated.  
        1.2 [x] Address all the errors in your twilio class so we are left with ones that need further work.
        Follow up on this status call back and how we can use it to communicate with js code.
        1.3 [x] Modify the messager template for users to select the desired technology to use(Carol)
            1.3.1 [x] Use checkboxes to select the technology to use,by default none is checked(Carol) 
            1.3.2 [ ] Add a listener to the sms checkbox to show the cost (FN)  
            1.3.3[ ]  Add a listener to the email checkbox to see the potential reach for the people.(FN)
            1.3.4 [ ] Modify the messenger to include the sending technology(PK)
        1.4 [ ] Revist the send message method to remove deplicate codesfor individual and groups(FN)  
        1.5 [ ] Formulate sql statement for picking the primary phone number as addresses(FN)  
        1.6 [ ] Merge the mailer and the twilio code together(PK)  
        1.7 [ ] Progress on the reply option(PK) 

### (6) Email

1. Make sure the same way he created a class for twiilio he should do the same for php mailer(PK).  
        1.1.[x] Test this class in php and adapt it so that we have mailer class in js that calls this php.  
        1.2.[ ] Implement the mailer class in js constraining the send_message() method to 2 parameters i.e. sender and body for this version.

### (7) WhatsApp

1.[x]Develop a senario whether the whatsapp messaging system would be suitable for messaging(FN)  
1.1[x] There is no senario that can be used instead prefered to use the GET method.

## Event-Listeners

___

### (8)Listen to last word typed

___

1. [x] How to get the last word typed using regular expression(PK)

### (9) Create Event  

### (10) Lookup new keyword

1. Lookup the last word typed,search that word in the dictionary if not found in the dictionary mark it(PK)