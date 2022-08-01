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
import main from './main.js';
//
//Resolve the iquestionnaire
import * as quest from '../../../schema/v/code/questionnaire.js';
//
//import the modules as mod
import * as mod from '../../../outlook/v/code/module.js'
//
//Enter the water readings of mutall rentall.
export class water
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
        this.meter = this.get_selected_value("meter");
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
        //1. Show the current time
        const input = <HTMLInputElement>this.get_element('date');
        input.value = (new Date()).toDateString();
        //
        //2. Fill the selector with the water meters. ...this.fill_selector("wmeter","rentize", "meter_no");
        //
        //2.1 Get the meter select element.
        const met = this.get_element("meter_no");
        //
        if(!(met instanceof HTMLSelectElement)) throw new schema.mutall_error("Not a Select Element");
        //
        //2.2 Get the meters as a string of the meters.
        const meters = await Promise.resolve(this.fill_selectors());
        //
        //2.3 Attach a value to the meters.
        met.innerHTML =  meters;
        //3. Add an event listener to the selector so that the last readings can be shown
        //automatically on the form.
        //
        //3.1 Get the selector.
        //
        //4. Add a listener to the data entry button so that it can compare the last
        // and current readings turning the consuption to green or red.
        //
        //Get the value of the meter number selected above.
        const meter: string = this.get_selected_value("meter_no");
        //
        //Get the last reading input field.
        const last_reading: string = await Promise.resolve(this.get_last_reading(meter));
        //
        //Get the input field for the last reading and add the data.
        const input_val: HTMLInputElement | null = this.document.querySelector("last_reading");
        //
        //Add the value to the input field.
        input_val!.value = last_reading;
        console.log(input_val!);

    }
    //
    //Fill the selectors from the database.
    async fill_selectors(): Promise<string>{
        //
        //Create sql
        const sql = `
            select 
                name
            from
                wmeter
        `;
        //
        //Get the data from the database.
        const wmeter: Array<{name: string}> = await server.exec(
            "database",
            ["rentize"],
            "get_sql_data",
            [sql]
        );
        //
        //Create the options
        const options = wmeter.map(
            (wmeter) => `<option value='${wmeter.name}'>${wmeter.name}</option>`
        );
        //
        //convert the array of options to text.
        const option: string = options.join("\n");
        //
        //Return the meters.
        return option;
    }
    //
    //Get the last reading associated with the meter.
    async get_last_reading(meter: string): Promise<string>{
        //
        //Get the last reading from the database.
        const reading = await Promise.resolve(this.get_reading(meter));
        //
        //Get the element of the field to display the value.
        const element = this.get_element("last_reading");
        //
        if (!(element instanceof HTMLInputElement))
            throw new schema.mutall_error(`The element isentified by prev_message is not a textarea`);
        //
        //Add the value to the input field.
        return reading;
    }
    //
    //Get the current reading from the  
    async get_reading(meter:string): Promise<string>{
        //
        //Add the current reference date value.
        //
        //Add the meter id.
        //
        //Formulate the query to get the data.
        const sql = `
            select 
                value
            from
                wreading 
            where 
                 wmeter.name = ${meter}
        `
        //
        //Execute the sql using the questionnaire.
        const read = await server.exec(
            "database",
            ["rentize"],
            "get_sql_data",
            [sql]
        );
        //
        //Return the value.
        
    }
    // //calculate the difference between the current reading and last reading.
    // async calculate_diff(): ((this: GlobalEventHandlers, ev: Event) => any) | null {
    //     //
    //     //1. Get the current reading.
    //     const l1: string = this.get_input_value("current_reading");
    //     //
    //     //2. Get the last water reading.
    //     const l2: string = this.get_input_value("last_reading");
    //     //
    //     //3. Calculate the difference from the above readings.
    //     //
    //     //4. Set the atrributes to change the color:-
    //     // if the consumption is negative the color should be red.
    //     // if the consumption is pasitive, the color should be green
    //     //
    //     // 
    // }
}
