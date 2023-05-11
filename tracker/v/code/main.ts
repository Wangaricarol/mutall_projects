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
import { basic_value, Ifuel } from '../../../schema/v/code/library';
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
	//Get all databases saved in the system and use them to construct an Idatabase structure
	//that will then be used to visualize the database and its entities on the metavisuo page
	async extract_databases():Promise<void>{
		//
		//1. Get all the databases saved within the system
		const databases:lib.Ifuel= await this.get_databases();
		//
		//2. Populate the database selector
		this.populate_selector(databases);
		//
		//3. Add a listener to get each selected database from the databases selected from the
		//database section
		this.get_element("databases").onchange= async()=>{
			//
			//3.1. Get the selected database and draw its entities
			await this.visualize_diagram();

		}
		
	}
	//
	//Visualize the diagram from a database selected from the list of available databases
	async visualize_diagram():Promise<void>{
		//
		//3.1. Get the selected database
		const selected:string= this.get_selected_value("databases");
		//
		//4. Construct an Idatabase structure for each selected database and visualize its
		//entities as a metavisuo diagram
		await this.create_structure(selected);
	}
	//
	//Generate the structure from the selected database among the list of all available databases
	//and draw its visual structure
	async create_structure(selected:string):Promise<void>{
		//
		//1. Generate an Idatabase structure for the selected database
		const structure:schema.Idatabase= await server.exec("database",[selected],"export_structure",[]);
		//
		//2. Get the svg element
		const content=this.get_element('content');
		//
		//3. Clear the contents of the svg element
		content.innerHTML="";
		//
		//4. Use the generated schema.Idatabase to generate a databe structure
		const dbase= new schema.database(structure);
		//
		//5. Create the database structure to visualize
		const meta= new visuo.database(content, this, dbase);
		//
		//6. Draw the database
		await meta.draw();
		//
		//7.Get the save button for adding an event listener
		this.get_element('save').onclick = async ()=>await meta.save(); 
	}
	//
	//Populate the selector designated to hold all the different databases with the databases in
	//the system
	populate_selector(databases:lib.Ifuel):void{
		//
		//1. Get the selector element
		const selector= <HTMLSelectElement>this.get_element("databases");
		//
		//2. Iterate through each database creating a selector
		for(let dbase of databases){
			//
			//2.1. Construct an option for each database
			const option= this.create_element(selector,"option",{textContent:dbase.Database!.toString(),value:dbase.Database!.toString()});
			//
			//2.2 If the currrent application's databases is among the ones available, mark
			//the database as selected
			if(app.app.current.dbname=== dbase.Database!){
				//
				//Add the selected attribute to this element
				option.selected= true;
			}
		}
	}
	//
	//Fetch all databases saved within the MYSQL database structure
	async get_databases():Promise<lib.Ifuel>{
		//
		//1. Construct the query to extract all databases except mysql, performance_schema,phpmyadmin
		//sys, and information schema
		const sql:string="SHOW DATABASES " +
			"WHERE `Database` NOT IN "+
			"('mysql','performance_schema', 'sys','information_schema','phpmyadmin')";
		//
		//2. Construct and execute the query to list all databases
		const dbases:Array<{Database:string}>= await server.exec("database",["mutall_users"],"get_sql_data",[sql]);
		//
		//3. return the compiled list of databases
		return dbases;
	}
	// 
	// Override the show panels on the outlook library.
	// 
	public async show_panels(): Promise<void> {
		// 
		//Get the content element from the html file.
		const content=this.get_element('content');
		// //
		// //Create a new meta-visuo database
		// const dbase= new visuo.database(content, this, app.app.current.dbase!);
		// //
		// //Draw the new database
		// await dbase.draw();
		//
		//Get all databases in the system and for each database construct an Idatabase structure
		await this.extract_databases();
		//
		//Create a metavisuo diagram using the database selected as the default
		await this.visualize_diagram();
		//
		//Add a test key press event
		// onkeydown= (event=>{
		// 	const keycode:Array<Number>=[37,38,39,40];
		// 	//
		// 	//
		// 	keycode.forEach(keycode =>{
		// 		if(event.isComposing|| event.keyCode === keycode){
		// 			//
		// 			alert(`The key that was pressed is : ${event.code}`);
		// 		}
		// 	});
		// });
	}
	
}


