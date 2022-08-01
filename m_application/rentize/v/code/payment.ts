//
//Import app from the outlook library.
import * as outlook from '../../../outlook/v/code/outlook.js';
//
//Import schema.
import * as schema from '../../../schema/v/code/schema.js';
//
import main from './main.js';
//
//import the modules as mod
import * as mod from '../../../outlook/v/code/module.js'
//
//
//Record the payments made by the clients to the database.
//updating the book of accounts by crediting and debiting respectively.
export class payment
    extends outlook.baby<true>
    implements mod.journal 
{
//
declare public mother: main;
//
//The database to post the accounting data.
public dbname ="mutall_users";
//
//Add a definite assignment assertion to all the properties.
public amount!: string;
//
public client!: string;
//
public date!: string;
//
public mode!: string;
//
//create a new payment class instance
constructor(mother: main) {
    super(mother, "payments.html")
}
get_business_id(): string {
    throw new schema.mutall_error('Method not implemented.');
}
get_je(): {ref_num: string; purpose: string; date: string; amount: number;} {
    //
    //1.Collect all the field provided.
    const j = [];
    //
    //1.1 Get the reference number.
    j.push([""])
    //
    //1.2 Get the purpose of the transaction.
    //
    //1.3 Get the date.
    //
    //1.4 Get the amount payed.
    //
    //2.
    //
    //. Return the values.
    // return ;

    throw new schema.mutall_error('Method not implemented.');
}
get_debit(): string {
    throw new schema.mutall_error('Method not implemented.');
}
get_credit(): string {
    throw new schema.mutall_error('Method not implemented.');
}
//
//In future, check if a file json containing iquestionare is selected
async check(): Promise<boolean> {
    //
    //1. Collect and check the data that the user has entered.
    //
    //1.1 Collect and check the Amount.
    this.amount = this.get_input_value("amount");
    //
    //1.2 Collect and check the client.
    this.client = this.get_input_value("client");
    //
    //1.3 Collect and check the date.
    this.date = this.get_input_value("date");
    //
    //1.4 Collect and check the mode.(in line 96 in view)
    this.mode = this.get_checked_value("mode");
    //
    //2. Post the data to the database.
    const post = await this.mother.accountant.post(this);
    //
    return post;
}
//
//Collect the checked values in a form for saving to the database.
get_checked_value(name: string): string {
    //
    //Get the value from the provided identifier.
    const radio = document.querySelector(`input[name='${name}']:checked`);
    //
    //Alert the user if no  radio button is checked.
    if (radio === null) alert("check one value");
    //
    // Ensure the value is of type HTMLInputElement.
    if(!(radio instanceof HTMLInputElement)) 
    throw new schema.mutall_error("The above is not a htmlinput element");
    //
    //Get the checked value.
    const value = (radio).value;
    //
    //Rturn the above value.
    return value;
}
//
//
async get_result(): Promise<true> {
    //
    return true;
}
//
async show_panels(): Promise<void> {
    //
    //1. Fill the selector with clients from the database.
    //

}
}