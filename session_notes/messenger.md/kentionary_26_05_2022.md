**Agenda in Kentionary.**
___
![messenger_module](messenger.svg)

## Content

___

### (1)TextAreas

1.[x] Research about all properties and methods of a textArea to understand its capabilities and limitations  
        1.1 [x] Demo on how this validation work in a textarea(PK)  
            - You can set a custom validity for any type if input type.  
        1.2 [x] How would you mark a section in a textarea(FN)  
        1.3 [x]How to extract selected text in a textarea(JN)  
            1.3.1 Next session show a demo on how to extract the selected text.  

### (2) Special-Editors

1. [x] Research on web based editors that can overcome the limits of a textarea  
        1.1 List atleast 3 web based editors that are available on the internet(CW)  
            1.1.1 Some a demo on Ace and Monaco.
2. [ ] Understand the documentation of Monaco(PK)
3. [x] Install and set it up(PK)
4. [ ] Run a demo on your machine
5. [ ] Investigate the Monaco textarea methods that supercede those of the TextAreaElement.(Investigate multiple highlighting).
      1. If you have some text such as *My namee is Muraya*. Mark the `namee` and `Muraya`.(PK)

## Services

___

### (3) Send Messages

1. [x] Work on the current template and make it up to date(MW)  
        1.2 Add a button for creating an new event.  
        - Seek clarification from PM.
2. [x]The new message class has been created lets revise that.  
    2.1 Harmonize the new_message class in Fn-tracker with PK-Kentionary.  
3. [ ]How do we collect the data that we require for all the interfaces that we implement.  
        4.1 Complete the get_layout() method of the new_message class(PK)  
            4.1.1 Get the updated template  
            4.1.2 Complete the individual method to get data from the template.  
        4.2 Revise the check() method of the new class so that it  logically follows the template(FN)  

### (4) Reply Messages

1. [x] Design the message reply template(JN)
  
        1.1 [x] Add the source of original message  
            1.1.1 Should be a non-editable textarea element that display the original message.  
        1.2 Add facilities for supporting contributions.  
            1.2.1 Make the facility live by adding the amount to contribute if its contributory.

2.[ ] Design the code for replying to a selected message using the template(FN).

        2.1. [x] Figure out how to get the selected message from the message panel in application page.
            2.1.1 Investigate where the message panel is displayed in the outlook library.  
            2.1.2 Understand the theme class methods and properties.  
            2.1.3 Use the message to find out what the message selected is.  
            2.1.4 Extract the message primary key from the selected.  
        2.2. [x] Copy the new_message.get_layout steps from kentionary to tracker and implement them.  
            2.2.1 Document the get_layout code.  
            2.2.2 Push layouts to array rather than simple expressions.  
            2.2.3 Implement the journal interface for a reply message if there is a contribution amount invovled(PM).  
        2.3. [x] Complete the reply_message.check() method(FN).  
            2.3.1 Collect and check the reply message properties.  
        2.4 Complete the save method in the writer module(PK)  

## Technology

___

### (5) Sms

1. Write a twilio class to send messages in js(PK).  
        1.0 Harmonize manually the module ts in tracker n kentionary.  

        1.1 [x] Set up ways of collaborating with git so that this harmonization is activated.  
        1.2 [ ] Address all the errors in your twilio class so we are left those ones that need further work.  
        1.3 Follow up on this status call back and how we can use it to communicate with js code.  

### (6) Email

1. Makes sure the same way he created a class for twiilio he should do the same for phpmailer(PK).  
        1.1 Test this class in php and adapt it so that we have mailer class in js that calls this php.  
        1.2 implement the mailer class in js constraining the send_message() method to 2 parameters i.e. sender and body for this version.

### (7) WhatsApp

1. Develop a senario whether the whatsapp messaging system would be suitable for messaging(FN)  

## Event-Listeners

___

### (8) Listen to last word typed

1. [x] How to get the last word typed using regular expression(PK)

### (9) Create Event  
  
### (10) Lookup new keyword

1.[ ] Lookup the last word typed,search that word in the dictionary if not found in the dictionary mark it(PK)