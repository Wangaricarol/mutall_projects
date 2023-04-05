//
//Import app from the outlook library.
import * as outlook from "../../../outlook/v/code/outlook.js";

import * as app from "../../../outlook/v/code/app.js";
//
import { checkbox, io } from "../../../outlook/v/code/io.js";
//
//Import server
import * as server from "../../../schema/v/code/server.js";
//import { encryption } from "../../../outlook/v/node/test.js";
//
//Import schema.
import * as schema from "../../../schema/v/code/schema.js";
//
//Resolve the reference to the library
import * as lib from "../../../schema/v/code/library";
//
//Resolve the iquestionnaire
import * as quest from "../../../schema/v/code/questionnaire.js";
//
//Resolve the reference to the journal interface
import * as mod from "../../../outlook/v/code/module.js";
//
import * as visuo from "./meta_visuo.js";

//
//
import { basic_value } from "../../../schema/v/code/library";
import { textarea, foreign } from '../../../outlook/v/code/io';
import { label } from '../../../schema/v/code/questionnaire';
// import { content } from '../../../m_projects/diagrm/tree';
//
//System for tracking assignments for employees of an organization.
//
//A column on the application database that is linked to a corresponding one
//on the user database. Sometimes this link is broken and needs to be
//re-established.
type replica = { ename: string; cname: string };
//
//Intern information collected is used in two cases, when reporting and when
//editing
type usage =
	| {
			purpose: "report";
	  }
	| { purpose: "edit" };
//
//The type of intern data collected for reporting purposes.
type intern_data = {
	intern: {
		name: string;
		email: string;
		title: string;
		language: string;
		requirements: string;
	};
	kin: { name: string; email: string; phone: string };
	certification: Array<{
		certificate_name: string;
		institute: string;
		start_date: string;
		end_date: string;
	}>;
	attachment: Array<{
		company: string;
		designation: string;
		start_date: string;
		end_date: string;
	}>;
	sponsor: { name: string; email: string; phone: string };
	referee: { name: string; email: string; phone: string };
};
//
//Main application
export default class main extends app.app {
	//
	public writer: mod.writer;
	public messenger: mod.messenger;
	public accountant: mod.accountant;
	public scheduler: mod.scheduler;
	//
	//Initialize the main application.
	constructor(config: app.Iconfig) {
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
	get_products_specific(): Array<outlook.assets.uproduct> {
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
	async view_meta_data(){
		//
		// Getting the data migration file
		const Meta_visuo=new meta_visuo(this,"../../../tracker/v/templates/metavisuo.html");
		Meta_visuo.administer();
	}
	
	//
	//List all assignments that are due and have not been reported.
	//Ordered by Date.
	vue_due_assignments(): void {
		alert("This method is not implemented yet.");
		//const data = encryption("encryption");
		//alert(data);
	}
	//
	//View information about an intern
	async view_intern_information(): Promise<void> {
		//
		//1. Select the intern from the table
		await this.get_selected_intern();
		//
	}
	//
	//Get the selected intern
	async get_selected_intern(): Promise<void> {
		//
		//1. Get the selected intern
		const tr: HTMLTableRowElement = this.document.querySelector(
			"#content>table>tbody>.TR"
		)!;
		//
		//When the administrator tries to view information about an intern, prompt
		//him/her to select a message. And stop the execution of the program
		if (tr === null)
			throw new schema.mutall_error(
				"NO INTERN was selected to reply. SELECT an INTERN and try again"
			);
		//
		//2. Get the primary key of the selected message
		const pk: string = tr.getAttribute("pk")!;
		//
		//3. Save the primary key of the selected intern
		localStorage.setItem("intern", pk);
	}
}
//Display the metavisuo chart
class meta_visuo extends outlook.terminal{
	// 
	//class constructor.
	constructor(mother:main,file:string){
		super(mother,file);
	}
	// 
	// Override the show panels on the outlook library.
	// 
	public async show_panels(): Promise<void> {
		// 
		//Get the content element from the html file.
		const content=this.get_element('content');
		//
		//Create a new meta-visuo database
		const dbase= new visuo.database(content, this, app.app.current.dbase!);
		
		//Draw the new database
		await dbase.draw();
		//
		//Get the save button for adding an event listener
		this.get_element('save').onclick = async ()=>await dbase.save(); 
        
	}
	
}


