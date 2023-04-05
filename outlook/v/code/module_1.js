//
//Resolve reference to the server
import * as server from "../../../schema/v/code/server.js";
//
//Resolve references to the schema
import * as schema from "../../../schema/v/code/schema.js";
//
//Resolve references to the appplication
import * as app from "../../../outlook/v/code/app.js";
//
//Resolve the references to the outlook class
import * as outlook from "../../../outlook/v/code/outlook.js";
//
//The module class for all our developed modules
class component {
    //
    //The class constructor
    constructor() { }
    //
    //Report errors this should be a popup to display the errors obtained.
    report_errors(errors) { }
}
//
//The aim of this class is to support scheduling of tasks similar to how "LINUX'S
//CRONTAB" command schedules tasks to occur at some specified frequency.
//(The scheduler executes a crontab)
export class scheduler extends component {
    constructor() {
        //
        //
        super();
    }
    //
    //Report errors encountered in the the scheduling of jobs to the database
    report_errors(errors) { }
    //
    //Executing a crontab takes the value of "yes" to allow the user to refresh 
    //the crontab and getting at jobs
    execute(i) {
        //
        //Get the user input of the crontab to update the cronjobs
        const cron_input = i.refresh_crontab();
        //
        //Create the at start_date and end_date arrays
        const at = i.get_at_commands();
    }
}
//
//This class supports the registrar module developed for supporting recording of
// data to the database for all our template forms.(the writer saves the 
// questionnaire)
export class writer extends component {
    //
    //The constructor to the class
    constructor() {
        //
        super();
    }
    //
    //Reporting errors encountered while saving the data
    report_errors(errors) { }
    //
    //Allows data in the form of layouts ??
    async save(i) {
        //
        //1.Get the layouts from the input questionnaire
        const layouts = i.get_layouts();
        //
        //2. Use the layout and the questionniare class to load the data to a 
        //database returning the HTML error report or Ok.
        const result = await server.exec(
        //
        //Use the questionnaire class to load the data
        "questionnaire", 
        //
        //the only parameter required by the questionnaire is the array of
        //layouts
        [layouts], 
        //
        //Use the more general version of load common that returns a html 
        //output or Ok.
        "load_common", 
        //
        //Calling the load common method with no input parameters
        []);
        //
        //3. Check the results on whether they were successful.If not successful,
        //report an error and return false to this method. If successful, return true 
        if (typeof result === 'string') {
            return true;
        }
        else {
            throw new schema.mutall_error(`Invalid datataype loaded on ${result}`);
        }
        //
    }
}
//
//The accounting class that captures transaction data in a double entry format
//which then proceeds to split into the refined data as per the DEALER model. Once
//done the transaction it is labelled as a debit or credit within an application.
//(the accounting class posts a journal)  
export class accountant extends component {
    //
    //The 
    //The constructor to the accounting class that will implement properties from
    //other classes.
    constructor() {
        //
        //
        super();
    }
    //
    //Errors encountered when posting journal entries to the database
    report_errors(errors) { }
    //
    //A generator that obtains all layouts and labels associated with a business
    //to ready that business's id so that when we post a transaction, the credit,
    //debit,and the journal entry is part of the post.
    *collect_j_layout(j) {
        //
        //Collect the business_id required for developing a journal
        yield ["mutall_users", "business", [], "id", [j.get_business_id()]];
        //
        //Collect the journal entry needed for posting the transaction to the
        //database
        yield* this.collect_je_layout(j.get_je().ref_num, j.get_je().date, j.get_je().purpose, j.get_je().amount);
        //
        //Collect the account in order to debit them
        yield* this.collect_debit_layout(j.get_debit());
        //
        //Collect the account that needs to be credited
        yield* this.collect_credit_layout(j.get_credit());
    }
    //
    //Collect journal entries needed to construct a journal layout in the
    //questionnaire
    *collect_je_layout(ref_num, date, purpose, amount) {
        //
        //Get the reference number of a journal entry
        yield ["mutall_users", "je", [], "ref_num", [ref_num]];
        //
        //Get the date associated with a particular journal entry
        yield ["mutall_users", "je", [], "date", [date]];
        //
        //Get the purpose for a defined journal entry
        yield ["mutall_users", "je", [], "purpose", [purpose]];
        //
        //Get the amount associated with a particular journal entry
        yield ["mutall_users", "je", [], "amount", [String(amount)]];
    }
    //
    //Collect the account needed to be debited
    *collect_debit_layout(account) {
        //
        //The amount to be debited to a particular account
        yield ["mutall_users", "debit", ["debit"], "amount", [account]];
    }
    //
    //Compound the accounts that need to be credited
    *collect_credit_layout(account) {
        //
        //The amount to be credited in a particular account
        yield ["mutall_users", "credit", ["credit"], "amount", [String(account)]];
    }
    //
    //Post the given account to the general ledger and return the value of true
    //if the record is saved successfully.
    async post(j) {
        //
        //Collect all the details needed for posting as layouts
        const layouts = Array.from(this.collect_j_layout(j));
        //
        //Load the layouts using the required format
        const save = await server.exec("questionnaire", [layouts], "load_common", []);
        //
        //Check whether the data was loaded or not
        const result = save ? true : false;
        //
        return result;
    }
    //
    //Get the business unique identifier
    get_business_id() {
        //
        //Get the id of the business from the application
        return "";
    }
    //
    //Obtain the amount to be debited to an account
    get_debit() {
        return "";
    }
    //
    //Obtain the amount to be credited to an account
    get_credit() {
        return "";
    }
}
//
//The messenger class supports sending of emails and sms's to the members belonging
//to a specific business. A message is defined by the business and the body of 
//of the message.
export class messenger extends component {
    //
    constructor() {
        super();
    }
    //
    //The mechanism for reporting errors when sending messages
    report_errors(errors) {
        //
        //Get the report page which is a new 
        const page = new outlook.report(this, app.app.current.config.general);
        //
        //Get the section that will hold the errors
        const section = document.getElementById("report");
        //
        //Loop through the array of errors creating a unique error
        errors.forEach(error => {
            //
            //Add the error obtained to the section panel of the page
            section.textContent = error;
        });
    }
    //
    //This allows the user to send emails and sms's to all users that belong to
    //a current business
    async send(i) {
        //
        //Get the recipients
        //
        //1.Get the business primary key of the currently logged in user
        const business = +i.get_business();
        //
        //2. Get the optional array of recievers
        //        const recivers?: Array<string>
        //
        //3. Get the body of the message
        const body = i.get_body();
        //
        //4.Send the message and return the errors if any
        const errors = await server.exec("messenger", [], "send", [
            business,
            body.subject,
            body.text
        ]);
        //
        //5.Report the errors
        if (errors.length !== 0)
            this.report_errors(errors);
        //
        //6.return true if there are no error
        return errors.length === 0;
    }
}
//
//
//The Cashier class that implements that is supporting the different modes of payment
//such as M_PESA, Paypal,Cash,Cheque,and Equity.
export class cashier extends component {
    //
    //Constructor
    constructor() {
        //
        super();
    }
    //
    //Make the payment using the phone number and the message
    pay(i) {
    }
}
////
////The Whatsapp class that supports sending messages to WhatsAp group members
//class whatsapp extends messenger implements message {
//    //
//    //
//    constructor() {
//        super();
//    }
//    //
//    //Get the body of a message
//    //
//    //Send the message to the whatsapp groups. In this case, should the
//    async send(media: message): Promise<boolean> {
//        //
//        return true;
//    }
//
//}
