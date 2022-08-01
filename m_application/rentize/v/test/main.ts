//
//Import app from the outlook library.
import {assets, popup} from '../../../outlook/v/code/outlook.js';
import * as outlook from '../../../outlook/v/code/outlook.js';

import * as app from "../../../outlook/v/code/app.js";
//
import {io} from '../../../outlook/v/code/io.js';
//
//Import server
import * as server from '../../../schema/v/code/server.js';
//
//Import schema.
import * as schema from '../../../schema/v/code/schema.js';
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js';
//
//import the modules as mod
import * as mod from '../../../outlook/v/code/module.js'
//
//System for tracking assignments for employees of an organization.
//
//A column on the application database that is linked to a corresponding one
//on the user database. Sometimes this link is broken and needs to be
//re-established.

//
export default class main extends app.app {
    public writer: mod.writer;
    public messenger: mod.messenger;
    public accountant: mod.accountant;
    public scheduler: mod.scheduler;
    //
    //Initialize the main application.
    constructor(config: app.Iconfig) {
        super(config);
        //
        //initialize the above
        this.writer = new mod.writer();
        this.messenger = new mod.messenger();
        this.accountant = new mod.accountant();
        this.scheduler = new mod.scheduler();
    }
    //
    //
    //Retuns all the inbuilt products that are specific to
    //thus application
    get_products_specific(): Array<outlook.assets.uproduct> {
        return [

            {
                title: "Manage Rental Account",
                id: 'rental',
                solutions: [
                    //
                    //Edit any table in this application
                    {
                        title: "Super User Table Editor",
                        id: "edit_table",
                        listener: ["event", () => this.edit_table()]
                    }
                ]
            },
            {
                title: "Payment and Water",
                id: "water_payment",
                solutions: [
                    {
                        title: "Water reading",
                        id: "water",
                        listener: ["event", () => this.water()]
                    },
                    {
                        title: "Enter Payments",
                        id: "payment",
                        listener: ["event", () => this.payment()]
                    }
                ]
            },
            {
                title: "Debt Analysis",
                id: "age",
                solutions:[
                    {
                        title: "View Analysis",
                        id: "analysis",
                        listener:["event", () => this.display_age()]
                    }
                ]
            }
        ]
    }
    //
    async payment(): Promise<void> {
        //
        //create a new instance.
        const Payment = new payment(this);
        //
        const result = await Payment.administer();
        //collect all the data
        if (result === undefined) return;

    }
    //
    async water(): Promise<void> {
        //
        const Water = new water(this);
        //
        const result = await Water.administer();
        //collect all the data
        if (result === undefined) return;
    }
    //
    //Replace the details in the content panel with the translation page.
    display_age(): void {
         //
        //The content to replace the content panel with.
        const details = `
            <button id="age_data">View Debt Analysis</button>
            <button id="cancel">Cancel </button>
            <table>
                <thead></thead>
                <tbody id="result"></tbody>
            </table>
        `;
        //
        //Get the content panel.
        const content = this.get_element('content');
        //
        //Replace content panel's innerHTML.
        content.innerHTML = details;
        //
        //Create a button and add the view event.
        //
        //Get the view button
        const age_data = this.get_element("age_data");
        //
        //Add a view event listener to the age_data element.
        age_data.onclick = async () => this.view_age_analysis();
    }
    //
    //Run the debt age analysis query and display the data.
    async view_age_analysis(): Promise<void> {
        //
        const db = "mutallco_rental";
        //
        //Get the button element.
        const button = this.get_element("age_data");
        //
        //Formulate the sql.
        const query = `
            with
                aclient as (
                    select distinct
                    client.client,
                        client.name
                    from 
                        client
                        inner join agreement on agreement.client=client.client
                    where
                        agreement.terminated is NULL and agreement.valid
                ),
                bal as(
                    select 
                        invoice.client,
                        period.month as mon,
                        period.year as yr,
                        closing_balance.amount
                    from 
                        closing_balance 
                        inner join invoice on closing_balance.invoice= invoice.invoice
                        inner join period on invoice.period= period.period
                ),
                current_bal as(
                    select bal.*
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 1 MONTH))and 
                            yr =YEAR((DATE_SUB(CURDATE(),INTERVAL 1 MONTH)))  
                ),
                bal_3 as(
                    select bal.*
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 3 MONTH))and
                            yr=YEAR(DATE_SUB(CURDATE(),INTERVAL 3 MONTH))
                ),
                bal_6 as(
                    select *
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 6 MONTH))and
                        yr=YEAR(DATE_SUB(CURDATE(), INTERVAL 6 MONTH))
                ),
                bal_12 as(
                    select *
                    from bal
                    where mon= MONTH(DATE_SUB(CURDATE(),INTERVAL 1 YEAR))and
                        yr=YEAR(DATE_SUB(CURDATE(),INTERVAL 1 YEAR))
                ),
                D1 as(
                    select
                        bal_12.client,
                        (bal_6.amount-bal_12.amount) as amount
                    from bal_12
                        inner join bal_6 on bal_6.client= bal_12.client
                ),
                D2 as(
                    select
                        bal_6.client,
                        (bal_3.amount-bal_6.amount) as amount
                    from bal_6
                        inner join bal_3 on bal_3.client=bal_6.client
                ),
                D3 as(
                    select 
                        bal_3.client,
                        (current_bal.amount- bal_3.amount) as amount
                    from bal_3
                        inner join current_bal on current_bal.client=bal_3.client
                )
            
                select
                aclient.client,
                aclient.name,
                bal_12.amount as debt_older_than_1yr,
                D1.amount as 12_months6_months,
                D2.amount as 6_months3_months,
                D3.amount as 3_monthsnow,
                current_bal.amount as current_balance
            from aclient
                join bal_12 on bal_12.client=aclient.client
                join D1 on D1.client=aclient.client
                join D2 on D2.client=aclient.client
                join D3 on D3.client=aclient.client
                join current_bal on current_bal.client=aclient.client
            order by client ASC;
        `;
        //
        //Execute the query to get the table.
        const Ifuel = await server.exec(
            "database",
            [db],
            "get_sql_data",
            [query]
        );
        //
        //Display the data in a table.
        //
        //Get the result element.
        const tbody = this.get_element("result");
        //
        //Attach content to the thead.
        const thead: HTMLTableSectionElement |null = document.querySelector("thead");
        thead!.innerHTML = `
            <thead>
                <th> Client</th>
                <th> Name </th>
                <th> Debt older than 1 yr </th>
                <th> 12 to 6 months </th>
                <th> 6 to 3 months </th>
                <th> 3 months to now </th>
                <th> Current balance </th>
            </thead>
        `;
        //
        //Clear the table body.
        tbody.innerHTML = "";
        //
        //Loop through all the rows of the ifuel
        for (let cnames of Ifuel) {
            //
            //create a table row and add it to the tbody.
            const tr = this.create_element(tbody, "tr", {});
            //
            //Loop through all the columns of a row,
            //attaching them to the tr as td's.
            for (let cname in cnames) {
                //
                //create a td and add it to the table row.
                const td = this.create_element(tr, "td", {});
                //
                //set the text value.
                td.textContent = String(cnames[cname]);
            }
        }
    }
} 
//
//Display the debt analysis data on the rentize application.
//
//Record the payments made by the clients to the database.
//updating the book of accounts by crediting and debiting respectively.
class payment
    extends outlook.baby<true>
    implements mod.journal {
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
//
//Enter the water readings of mutall rentall.
class water
    extends outlook.baby<true>
    implements mod.questionnaire {
    //
    declare public mother: main;
    //
    //For reporting error messages
    public report_element?: HTMLElement;
    //
    //Provide as many properties as the number of data items to be collected.
    //Add definite assignment(!) assertion to the properties
    public date!: string;
    //
    public meter!: string;
    //
    public current_reading!: string;
    //
    //create a new water class instance
    constructor(mother: main) {
        //
        super(mother, 'water.html')
    }
    //
    //
    get_layouts(): Array<quest.layout> {
        //
        //The database name.
        const dbname = "rentize";
        //
        //Start with an empty array
        const w: Array<quest.label> = [];
        //
        //1.Get the date.
        w.push([dbname, "wreading", [], "date", this.date]);
        //
        //2. Get the water meter.
        w.push([dbname, "wreading", [], "meter", this.meter]);
        //
        //3. Get the current reading.
        w.push([dbname, "wreading", [], "value", this.current_reading]);
        //
        return w;
    }
    //
    //In future, check if a file json containing iquestionare is selected
    //
    async check(): Promise<boolean> {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect and check the date.
        this.date = this.get_input_value("date");
        //
        if (this.date === "") this.report_element!.textContent = "Please select a date";
        //
        //1.2 Collect and check the meter.
        this.meter = this.get_input_value("meter");
        //
        if (this.meter === "") this.report_element!.textContent = "Select a meter";
        //
        //1.3 Collect and check the current reading value.
        this.current_reading = this.get_input_value("current_reading");
        //
        if (this.current_reading === "") this.report_element!.textContent = "Enter a value";
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        return save;
    }
    //
    async get_result(): Promise<true> {
        //
        return true;
    }
    //
    async show_panels(): Promise<void> {
        //
        //1. Set the date to current.
        const dateTime = new Date;
        //
        //Get the value of the provided identifier
        const inputValue = <HTMLInputElement> document.getElementById('date');
        //
        //Set the inputfield value to the current date.
        inputValue.valueAsDate = dateTime;
        //
        //2. Fill the selector with the water meters.

        //
        //3. Add an event listener to the selector so that the last readings can be shown
        //automatically on the form.

        //
        //4. Add a listener to the data entry button so that it can compare the last
        // and current readings turning the consuption to green or red.
    }
}

