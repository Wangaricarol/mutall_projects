#RENTIZE
**Objectives**

Written by [caroline wangari](http://127.0.0.1:5500/curriculum_vitae/carol_cv/cv_assg2/cvc.html)

- The rentize system has two main users, the **landlord** and the **tenant**. It allows for management of
    mutall enterprise.

    | User     | Long-term Objectives                                                           |
    | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | tenant   | 1. They should be able to view the monthly invoices (payments), and the reports `should be accurate`. 2. The client must be able to interrogate the system and view the historical statement of their account. |
    | landlord | 1. KRA Tax Compliance. Using the accounting program, the landlord's tax compliance to KRA should become easier                                                                                                 |

- Upgrade mutall_rental to rentize,i.e., have the accounting bit in mutall_rental separated to
  - rentize.
  - accounting module.
- `Other Objectives`.  
  - Change the database according to the specifications.
  - [ ] Remove the accounting table.`It is part of the Accounting model`,
  - [ ] Change the `client` entity/table to `tenant`.

- The migration module helps in the visualization of the movement of applications and databases from `Mutall.co.ke` to `Digital Ocean`.
  During the migration, the system is set to change its operability style but retain its operability functions.
  The migration module will help do that, and it is visualized below.
  ![migration_module](agendas.svg).

## Agenda

### Past/Timeliness(1):mutall_rental+buis

1. [x] May Invoices for clients to be produced by the second of the month.i.e., May 3.`maggie`  
     1.1 [x] Sort out the error produced out on digital ocean by  the invoice module(FN)  
      1.1.1 [x] Proceed and resolve all errors associated with invoicing. seek further clarification before the next session.  
       1.1.2[x] Fix the "group by" error on d.o(FN)  
  1.2 [x] Continue testing the invoice on d.o until no errors.Any error realised should be pointed out and discussed before next meeting.(Maggie/Camillus)
2. [x] Develop an aplication for monitoring issuance of invoices where emails should be sent to both Maggie and Muraya as soon as they (invoices) become ready.The subject of this email will be closing balance of the previous month and the earliest date when a payment was done.  
  2.1 a [x] Develop a query for calculating balances of this month.(Carol)  
  2.1 b [x] Develop a query for calculating the earliest payment date of this month.(Maggie)  
    2.1.1 [x] Install a copy mutal users on our local machines database  
    2.1.2 [x] Inspect each one record  
    2.1.3 [ ] Find out how many users have their names starting with M.  
  2.2[x]Formulate an email you need  to send using the results of 2.1 and 2.2.(FN)  
    2.2.1 [x] Develop a query for calculating balances of this month.FN)  
    2.2.2 [x] Develop a query for calculating the earliest payment date of this month.(FN)  
    2.2.3 [x] Look on a period table and look on the earliest cutoff date that is in the system.  
    2.2.4 [ ] Complete the script to send the email with data from 2.2.2 to 2.2.4(FN)  
  2.3 [x] Send an email to Muraya and Maggie as soon as the first query yield some reports.(JO)  
      2.3.1 [x] Schedule a cronjob that runs on mutal.co server regularly to check whether the first query yield the results and when it does it sends a message(JO)  
      2.3.2 [x] Echo hello world to a file  
  2.4 [x] Transfer the data changes from mutall co to d.o as soon as they occur.
  The technology to use is database Triger and Cronjob.(PK)  
3. [ ] Crontab services  
    3.1 [ ] Performance monitoring of end of month invoicing  
        3.1.1 [ ] Initiation of email messenging (see 2 above for details) to PM and Maggie(FN)  
    3.2 [ ] Synchronizing mutall c.o and d.o databases  
        3.2.1 [ ] Initiation of data transfer from c.o to d.o (see 2.4 for details)(PK)  
    3.3 [ ] Canceling of 3.1.1 and 3.2.1(JO)

### Present/Differences(2):mutall_rental+outlook

1. [x] Try and produce reports on both BUIS and OUTLOOK and check the differences in the two reports .(Camillus and Maggie)  
  1.1 [x] List the problems encountered when producing the reports and report on the issues in the next session.(Camillus and Maggie)  
  1.1 [x] Transfer a copy of mutall rental from c.o to d.o BEFORE CAPTURING THE END OF MONTH DATA.
  i.e., Bank statements credit and debit notes  
  1.2 [x] Capture the end of month data on mutall current ocean and produce the monthly invoices.  
  1.3 [x]Capture the same data on d.o and produce the monthly invoices.  
  1.4 [x] Compaire the two invoices and list the differences.  
  1.5 [x] Maggie to familiarize with the steps 1.1 to 1.4 with the help of camillus and in  three months time should do it indipendently.
  
### Research:mutall rental+outlook

1.[ ] Make sure all the development is finished before handling the mutall_rental+ Outlook.(FN/PK)  

#### WATER Billing Service(3)

1. [x] Deploy the water billing template.`FN`.  
    1.1  Modify the current template to look like the original.The water meter should be a selector,the last reading should be retrieved from the database and the consumption should be calculated.
    _Negative consumption value should be shown in red._  
    1.1.1  Fetch and fill the previous water readings from the water reading table to the water reading form.  
      _(hint use window functions to solve the problem)._  
    1.2 Complete the show panel method of the water class.

#### ELECTRICITY Billing Service(4)

1. [ ] Develop/deploy the Electricity billing(KPLC) template.`Maggy/FN`.
  
    1.1 [x] Develop a template based on a kplc message.(Maggie).  
      1.1.1 [x] PK to deploy the template made by Maggie.(PK)  
  1.2 [x] Develop the electricity bill class that extends the baby.(PK)  
      1.2.1 [x] Deploy the method on mutall rental.(PK)  
  1.3 [x] The check method should use PK method for extracting the billing details and write to the database.The check method should also update our account,but for now its conditional.(PK)  
      1.3.1 [x] Deploy the check method to check the validity of the data.(PK)  
      1.3.2 [x] Seek clarification on the correct implementation of the accounting method.
    Posting of the electricity bill is conditional.(PK)  
  1.4 [x] Resolve the errors encountered when saving.(PK)  
  1.5 [x] Add a button that allows to access the kenya power as a popup that enable copy and paste  
  1.6 [ ] Improving the user interface  
      1.6.1[ ] Add a panel for error reporting.  
      1.6.2[ ] Put the acc number in the clip board for later copying to the kenya power website.  
      1.6.3 [ ] Clear the text area after a successful transfer of the data.  
      1.6.4 [ ] Put a check mark against the account being processed.  
      1.6.5 [ ] Bring the last unchecked acc number to be the current one.  
  1.7[ ] Debug the saving process and use the error reporting panel appropriately

#### Credit and Debit(5)

1. [x] Deploy the Adjustments Credit and Debit template.`Peter`.  
  1.1 [x] Fill the business selector with the businesses.  
2.[ ] Add a reporting panel and make sure that the saving proceed smoothly.

#### Payment services(6)

1. [x] Deploy the Payment template.(FN).

> 1.1 [x] Improve the developed template by adding client selector and payment references.(FN)  
> 1.2 [x] Deploy the template in the payment class that extends a baby.(FN)  
> 1.3 [x] The check method should update the book of account.(FN)  
> 1.4 [x] Populate the selector with clients from the database.(FN)  
> 1.5 [x] Seek further clarifications on the methods from the journal interface.(FN)

#### Report(7)

##### Debit Analysis(7.1)

1. [x] Procede to calculate the final desired output as follows(PK).  
    1.1 [x] Calculate balances at 0,3,6 and 12 mark intervals.(PK)  
    1.2 [x] Calculate the balances between the intervals.(PK)  
    1.3 [x] Compile the final results.(PK)  
2. [x]Deploy the results of this analysis on rentize application(FN)  
   2.1[x]Use a baby view to display the debts.(FN)  
   2.2[x]Reduce the decimal points to 0 and use a thousand comma separator(PK)  
   2.2.1[x]Format the data at the server(not at the client)(pk)  

##### Historical report (Json) query(7.2)

7.2.1 [ ] Develop Json based queries for generating(FN)  
  7.2.1 [ ] Client historical report.(FN)

##### 7.3. Monthly invoicing (Json)query

7.3.1 [ ] Develop Json based queries for generating(PK)  
  7.3.1.1 [ ]Monthly/Current invoices.(PK)  
7.3.2. [ ] As a base for producing paper copies, emails and short sms.(PK)  

#### Goal/Future

**rentize+outlook.**

#### Data transfer

##### Non-accounting tables(8)

1. [ ] Load the agreement data.`FN and Maggie`.  
  1.1 [x] Refine the source query to take care of the foreign keys (FN)  
  1.2 [x] Repeat the process of all the tables (FN/Maggie)  
  1.2.1 [x] Complete loading the data into the tables and if there are errors seek assistance  before the next session.(FN)  
  1.2.2[ ] Modify the Json files to be suitable for transfering the data from mutall_rental in c.o to mutall_rental d.o.  
  1.2.2.1[ ] Report if you have noticed any pattern for loading.  
  1.2.2.2[ ] Prepare a typscript file for loading the first two tables before we expand it to include the other tables.  
  1.3 [ ]Combine all the Json files used for transfering data to a single file and test the loading(FN).  
 1.3.1[ ] Report on the experience of loading a single Json file with all the tables(FN)  
  1.4 [ ] Do an option/Json query file for transfering all the newly acquired  water readings from mutall c.o to d.o.(FN)  
    1.4.1[ ] Use dbeaver to formulate the query.(FN)  
    1.4.2[ ] Use the query in aJson file to load tabular data.(FN)  
    1.4.3 [ ]Add the data transfer option the rentize application.(FN)  
  
##### Accounting tables(9)

   1.[ ] Match our account tables to the chart of the account (Maggie/Camillas)**.  
  1.1 [ ] Maggie to seek further clarification.

#### Services

1. [ ] Convert all the services developed on mutall rental to work on rentize.  
2. [ ] Develop the invoicing service to work under rentize and outlook.