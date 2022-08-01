import * as outlook from '../../../outlook/v/code/outlook.js';
//
//Import server
import * as server from '../../../schema/v/code/server.js';
//
//Import schema.
import * as schema from '../../../schema/v/code/schema.js';
//
//Enter the water readings of mutall rentall.
export class water extends outlook.baby {
    //
    //For reporting error messages
    report_element;
    //
    //Provide as many properties as the number of data items to be collected.
    //Add definite assignment(!) assertion to the properties
    date;
    //
    meter;
    //
    current_reading;
    //
    //create a new water class instance
    constructor(mother) {
        //
        super(mother, 'water.html');
    }
    //
    //
    get_layouts() {
        //
        //The database name.
        const dbname = "rentize";
        //
        //Start with an empty array
        const w = [];
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
    async check() {
        //
        //1. Collect and check the data that the user has entered.
        //
        //1.1 Collect and check the date.
        this.date = this.get_input_value("date");
        //
        if (this.date === "")
            this.report_element.textContent = "Please select a date";
        //
        //1.2 Collect and check the meter.
        this.meter = this.get_selected_value("meter");
        //
        if (this.meter === "")
            this.report_element.textContent = "Select a meter";
        //
        //1.3 Collect and check the current reading value.
        this.current_reading = this.get_input_value("current_reading");
        //
        if (this.current_reading === "")
            this.report_element.textContent = "Enter a value";
        //
        //2. Save the data to the database.
        const save = await this.mother.writer.save(this);
        //
        return save;
    }
    //
    async get_result() {
        //
        return true;
    }
    //
    async show_panels() {
        //
        //1. Show the current time
        const input = this.get_element('date');
        input.value = (new Date()).toDateString();
        //
        //2. Fill the selector with the water meters. ...this.fill_selector("wmeter","rentize", "meter_no");
        //
        //2.1 Get the meter select element.
        const met = this.get_element("meter_no");
        //
        if (!(met instanceof HTMLSelectElement))
            throw new schema.mutall_error("Not a Select Element");
        //
        //2.2 Get the meters as a string of the meters.
        const meters = await Promise.resolve(this.fill_selectors());
        //
        //2.3 Attach a value to the meters.
        met.innerHTML = meters;
        //3. Add an event listener to the selector so that the last readings can be shown
        //automatically on the form.
        //
        //3.1 Get the selector.
        //
        //4. Add a listener to the data entry button so that it can compare the last
        // and current readings turning the consuption to green or red.
        //
        //Get the value of the meter number selected above.
        const meter = this.get_selected_value("meter_no");
        //
        //Get the last reading input field.
        const last_reading = await Promise.resolve(this.get_last_reading(meter));
        //
        //Get the input field for the last reading and add the data.
        const input_val = this.document.querySelector("last_reading");
        //
        //Add the value to the input field.
        input_val.value = last_reading;
        console.log(input_val);
    }
    //
    //Fill the selectors from the database.
    async fill_selectors() {
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
        const wmeter = await server.exec("database", ["rentize"], "get_sql_data", [sql]);
        //
        //Create the options
        const options = wmeter.map((wmeter) => `<option value='${wmeter.name}'>${wmeter.name}</option>`);
        //
        //convert the array of options to text.
        const option = options.join("\n");
        //
        //Return the meters.
        return option;
    }
    //
    //Get the last reading associated with the meter.
    async get_last_reading(meter) {
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
    async get_reading(meter) {
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
        `;
        //
        //Execute the sql using the questionnaire.
        const read = await server.exec("database", ["rentize"], "get_sql_data", [sql]);
        //
        //Return the value.
    }
}
