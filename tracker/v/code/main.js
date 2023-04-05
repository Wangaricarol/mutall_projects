//
//Import app from the outlook library.
import * as outlook from "../../../outlook/v/code/outlook.js";
import * as app from "../../../outlook/v/code/app.js";
//import { encryption } from "../../../outlook/v/node/test.js";
//
//Import schema.
import * as schema from "../../../schema/v/code/schema.js";
//
//Resolve the reference to the journal interface
import * as mod from "../../../outlook/v/code/module.js";
//
import * as visuo from "./meta_visuo.js";
//
//Main application
export default class main extends app.app {
    //
    writer;
    messenger;
    accountant;
    scheduler;
    //
    //Initialize the main application.
    constructor(config) {
        super(config);
        //
        this.writer = new mod.writer();
        this.messenger = new mod.messenger();
        this.accountant = new mod.accountant();
        this.scheduler = new mod.scheduler();
    }
    //
    //Returns all the inbuilt products that are specific to
    //this application
    get_products_specific() {
        return [
            {
                id: "actions",
                title: "Actions",
                solutions: [
                    {
                        title: "View due assignments",
                        id: "view_due_assignments",
                        listener: ["event", () => this.vue_due_assignments()]
                    }
                ]
            },
            {
                id: "metavisuo",
                title: "Metavisuo",
                solutions: [
                    {
                        title: "Metavisuo",
                        id: "meta_data",
                        listener: ["event", () => this.view_meta_data()]
                    }
                ]
            },
            {
                id: "lvl2_registration",
                title: "Registration",
                solutions: [
                    {
                        title: "View Intern Information",
                        id: "view_intern",
                        listener: ["event", () => this.view_intern_information()]
                    },
                ]
            }
        ];
    }
    //
    //Viewing the data migration diagram  
    async view_meta_data() {
        //
        // Getting the data migration file
        const Meta_visuo = new meta_visuo(this, "../../../tracker/v/templates/metavisuo.html");
        Meta_visuo.administer();
    }
    //
    //List all assignments that are due and have not been reported.
    //Ordered by Date.
    vue_due_assignments() {
        alert("This method is not implemented yet.");
        //const data = encryption("encryption");
        //alert(data);
    }
    //
    //View information about an intern
    async view_intern_information() {
        //
        //1. Select the intern from the table
        await this.get_selected_intern();
        //
    }
    //
    //Get the selected intern
    async get_selected_intern() {
        //
        //1. Get the selected intern
        const tr = this.document.querySelector("#content>table>tbody>.TR");
        //
        //When the administrator tries to view information about an intern, prompt
        //him/her to select a message. And stop the execution of the program
        if (tr === null)
            throw new schema.mutall_error("NO INTERN was selected to reply. SELECT an INTERN and try again");
        //
        //2. Get the primary key of the selected message
        const pk = tr.getAttribute("pk");
        //
        //3. Save the primary key of the selected intern
        localStorage.setItem("intern", pk);
    }
}
//Display the metavisuo chart
class meta_visuo extends outlook.terminal {
    // 
    //class constructor.
    constructor(mother, file) {
        super(mother, file);
    }
    // 
    // Override the show panels on the outlook library.
    // 
    async show_panels() {
        // 
        //Get the content element from the html file.
        const content = this.get_element('content');
        //
        //Create a new meta-visuo database
        const dbase = new visuo.database(content, this, app.app.current.dbase);
        //Draw the new database
        await dbase.draw();
        //
        //Get the save button for adding an event listener
        this.get_element('save').onclick = async () => await dbase.save();
    }
}
