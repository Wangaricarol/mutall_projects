import * as app from "../../../outlook/v/code/app.js";
//
//Import server
import * as server from '../../../schema/v/code/server.js';
//
//import the modules as mod
import * as mod from '../../../outlook/v/code/module.js';
//
//Resolve payment.
import * as payment from '../code/payment.js';
//
//Resolve water
import * as water from '../code/water.js';
//
//System for tracking assignments for employees of an organization.
//
//A column on the application database that is linked to a corresponding one
//on the user database. Sometimes this link is broken and needs to be
//re-established.
//
export default class main extends app.app {
    writer;
    messenger;
    accountant;
    scheduler;
    //
    //Initialize the main application.
    constructor(config) {
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
    get_products_specific() {
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
                solutions: [
                    {
                        title: "View Analysis",
                        id: "analysis",
                        listener: ["event", () => this.display_age()]
                    }
                ]
            }
        ];
    }
    //
    async payment() {
        //
        //create a new instance.
        const Payment = new payment.payment(this);
        //
        const result = await Payment.administer();
        //collect all the data
        if (result === undefined)
            return;
    }
    //
    async water() {
        //
        const Water = new water.water(this);
        //
        const result = await Water.administer();
        //collect all the data
        if (result === undefined)
            return;
    }
    //
    //Replace the details in the content panel with the translation page.
    async display_age() {
        //
        //The content to replace the content panel with.
        const debt = new display_age(this);
        //
        const result = await debt.administer();
        //
        if (result === undefined)
            return;
    }
}
//
//Display the debt analysis data on the rentize application.
class display_age extends mod.terminal {
    //
    constructor(mother) {
        super(mother, "debt.html");
    }
    //
    //check the entered data and if correct return true else return false.
    //And prevents one from leaving the page.
    async check() {
        return true;
    }
    //
    //Implement abstract method
    async get_result() {
        //
        return true;
    }
    async show_panels() {
        //  
        //The database name to fech data from
        const db = "mutallco_rental";
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
        const Ifuel = await server.exec("database", [db], "get_sql_data", [query]);
        //
        //Display the data in a table.
        //
        //Get the result element.
        const tbody = this.get_element("result");
        //
        //Attach content to the thead.
        const thead = document.querySelector("thead");
        thead.innerHTML = `
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
