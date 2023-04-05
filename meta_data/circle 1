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
//
import { basic_value } from "../../../schema/v/code/library";
import { textarea } from '../../../outlook/v/code/io';
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
				id: "simulating_data",
				title: "Simulating data graph",
				solutions: [
					{
						title: "Simulating data",
						id: "simulating_data",
						listener: ["event", () => this.view_simulating_data()]
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
	//Viewing the data migration diagram  
	async view_simulating_data(){
		//
		// Getting the data migration file
		const migrate=new svg_migration_data(this,"../../../m_projects/svg_2/dat.html");
		migrate.administer();
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
//
//displaying the metavisuo chart
class meta_visuo extends outlook.terminal{
	//
	//class constructor
	constructor(mother:main,file:string){
		super(mother,file)
	}
	//
	//show panels
	public async show_panels(): Promise<void> {
		//
		// Get the svg element from the current html document 
		const svg =this.get_element('canvas');
		//
		//Define the namespace  needed to create svg elements
		const svgns = "http://www.w3.org/2000/svg";
		//
		//		DRAW THE CIRCLE ENTITY 
		//		
        //Create the circle that represent an entity  
        const c:SVGCircleElement = document.createElementNS(svgns,"circle");
		// 
		//Append the circle to the svg element
        svg.appendChild(c);
		// 
        // Set the x coordinate of the centre of the circle
        c.setAttribute("cx","32");
        // 
        // Set the y coordinate of the centre of the circle
        c.setAttribute("cy","32");
        // 
        // Set the circle radius.
        c.setAttribute("r","4");
		// 
		// 		  DRAW THE LINE  MARKER
		//
		// Creating the marker element
		const indicator:SVGMarkerElement = <SVGMarkerElement>document.createElementNS(svgns,"marker");
		// 
		//Attaching the marker to the svg element
		svg.appendChild(indicator);
		// 
		// Supply the marker attributes
		indicator.setAttribute("viewBox","0 0 16 16");
		indicator.setAttribute("id","mline");
		indicator.setAttribute("refX","8");
		indicator.setAttribute("refY","8");
		indicator.setAttribute("markerWidth","8");
		indicator.setAttribute("markerHeight","8");
		// 
		// Creating the line marker.
		const mark:SVGLineElement = <SVGLineElement>document.createElementNS(svgns,"line");
		// 
		// Set the line marker element attributes
		mark.setAttribute("x1","8");
		mark.setAttribute("y1","8");
		mark.setAttribute("x2","16");
		mark.setAttribute("y2","8");
		// 
		// Append the marker
		indicator.appendChild(mark);
		// 
		// 					GROUPING THE ELEMENTS
		//Create a group tag
		const g = document.createElementNS(svgns,"g");
		// 
		// Attach the group element to the svg tag
		svg.appendChild(g);
		// 
		// Rotate the g tag by 30 about the center 
		g.setAttribute("transform","rotate(30,32,32)");
		// 
		// 					THE POLYLINE
		// Create the polyline element 
		const poly:SVGPolylineElement = document.createElementNS(svgns,"polyline");
		// 
		//Attach the polyline to the svg element
		g.appendChild(poly);
		// 
		// Define the polyline segments 
		poly.setAttribute('points', "32,28 32,24 32,20 32,16 32,12 32,8 32,4");

		// Attach the markers to the polyline segments
		poly.setAttribute("marker-mid","url(#mline)");
		// 
		// 					GROUPING THE TEXT ELEMENTS
		// Create a group tag element 
		// (gtext) to differentiate from the main group 
		const gtext= document.createElementNS(svgns,"g");
		// Attach the gtext group to the group tag above
		g.appendChild(gtext);
		//
		// Translate the gtext tag by x co-ordinates 2,y coordinates 1 
		gtext.setAttribute("transform","translate(2,1)");
		// 
		// 			THE TEXTS ELEMENTS	
		// Create the id text element
		const id:SVGTextElement = document.createElementNS(svgns, "text");
		// 
		//Attach the lable element  to the gtext group tag 
		gtext.appendChild(id);
		// 
		// Set the x, y coordinate and  the name id
		id.setAttribute("x","32");
		id.setAttribute("y","28");
		id.textContent= ("id");
		//
		// Create the start text element 
		const start:SVGTextElement = document.createElementNS(svgns, "text");
		// 
		// Attach the start element to the gtext group tag element
		// 
		gtext.appendChild(start);
		// set the x, y coordinate and the text start_date
		start.setAttribute("x","32");
		start.setAttribute("y","24");
		start.textContent= ("start_date");
		// 
		// Create the endt text element 
		const end_date:SVGTextElement = document.createElementNS(svgns, "text");
		// 
		//Attach the  end_date text element to the gtext group tag element
		// 
		gtext.appendChild(end_date);
		// 
		// set the x, y coordinate and the text content of the end_date element
		end_date.setAttribute("x","32");
		end_date.setAttribute("y","20");
		end_date.textContent= ("end_date");
		//
		//Create the emal text Element
		const emal:SVGTextElement = document.createElementNS(svgns, "text");
		// 
		//Attach the emal text element  to the gtext group element
		gtext.appendChild(emal); 
		//set the x, y coordinate and the text email
		emal.setAttribute("x","32");
		emal.setAttribute("y","16");
		emal.textContent= ("email");
		// 
		//Create the usr text Element
		const usr:SVGTextElement = document.createElementNS(svgns, "text");
		// 
		//Append the usr text element to the gtext group element
		gtext.appendChild(usr);
		// 
		//set the x, y coordinate and the text user 
		usr.setAttribute("x","32");
		usr.setAttribute("y","12");
		usr.textContent= ("user");
		
		//Create the freq text Element
		const freq:SVGTextElement = document.createElementNS(svgns, "text");
		// 
		//Append the freq text element to the gtext group element
		gtext.appendChild(freq);
		//set the x, y coordinate and the name frequency
		freq.setAttribute("x","32");
		freq.setAttribute("y","8");
		freq.textContent= ("frequency");
	
	}
}



		// 
		// Add an event lister such that when this entity is selected, the selection is removedfrom
		//any other entity that is selected and this becpmes select
	    // c.onclick= ()=>this.entity_select(c);