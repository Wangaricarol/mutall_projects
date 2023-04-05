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
import { textarea, foreign } from '../../../outlook/v/code/io';
import { label } from '../../../schema/v/code/questionnaire';
import { content } from '../../../m_projects/diagrm/tree';
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

interface point {
	x:number;
	y:number;
}
// 
// Define the namespace needed to create svg elements
const svgns = "http://www.w3.org/2000/svg";

//Display the metavisuo chart
class meta_visuo extends outlook.terminal{
	//
	//Define the namespace  needed to create svg elements.
	public static svgns:string = "http://www.w3.org/2000/svg";
	//
	//This is the svg property.
	public  static svg:SVGElement;
	//
	//The entities of the current application database.
	public static entities:{[index:string]:entity}={};
	// 
	//Set the view box properties.
	//
	//Set the panning attributes of a view box.
	panx:number = 0; 
	pany:number=0;
	//
	//Set the scaling attributes of a view box.
	zoomx:number=128; 
	zoomy:number=64;
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
		//Create a new meta-visuo database
		const dbase= new meta_visuo.database(this, app.app.current.dbase!);
		//
		//Draw the new database
		dbase.draw();

		

		//DEFINE THE SVG
		// 
		//Get the content element from the html file.
		const content=this.get_element('content');
        // 
		//Create the svg element in our content element in the html file.
		meta_visuo.svg=<SVGElement>this.document.createElementNS(svgns,"svg");
		//
		//Attach the svg to the content.
		content.appendChild(meta_visuo.svg);
		// 
		//Add the view box attribute, based on the zoom and pan settings.
		meta_visuo.svg.setAttribute("viewBox",`${[this.panx, this.pany, this.zoomx, this.zoomy]}`);
		//
		//Add an event listener for moving the entity group to the double clicked position.
		meta_visuo.svg.ondblclick = (ev)=>this.entity_move(ev);
		//
		//Define the tick mark
		new tick();
		// 
		//Draw the arrow marker
		new arrow();
		//
		//Loop over all schema entities and convert them to metavisuo versions save them and 
		//draw them
		for(const ename in app.app.current.dbase?.entities){
			//
			//Create the meta-viso entity
			const ent = new entity(ename);

			//Save the newly created entity to the metavisuo entities.
			meta_visuo.entities[ename] = ent;
			//
			//Draw type metavisuo entity
			ent.draw();
		}
		//Loop over all metavisuo entities, extract the foreign keys, for each foreign key
		//find out the home and away entity, use them to create our relations, draw the relations
		this.draw_relations();
	}
	//
	//Loop over all metavisuo entities, extract the foreign keys, for each foireign key
	//find out the home and away entity, use them to create our relations, draw the relations.
	draw_relations():void{
		// 
		//For each metavisuo entity...
		for(const ename in app.app.current.dbase?.entities){
			//
			//a. Get the named entity
			const entity:schema.entity = app.app.current.dbase?.entities[ename];
			//
			//b. Extract the foreign keys of the named entity.
			//
			//b.1 Get the columns of the entity
			const columns:Array<schema.column> = Object.values(entity.columns);
			//
			//b.2 Extract the foreign key columns by filtering
			const foreign_keys:Array<schema.foreign> =<Array<schema.foreign>> 
			columns.filter(col=>col instanceof schema.foreign);
			// 
			//For each foreign key...
			for(const foreign_key of foreign_keys){
				//
				//Find out the home (src) and away entity(dest).
				//
				//Get the source (home) meta_visuo.entity
				const src:entity = meta_visuo.entities[ename];
				//
				//Get the dest (away) entity, if it belongs to the same database as the current 
				//application
				const dest:entity|false = this.get_away_entity(foreign_key);
				//
				//Skip the relation if it points to an entity outside of the current database
				if (dest !==false){
					//Use the home and away entity to create the relationship.
					const Relation:relation = new relation(src, dest);
					// 
					// Draw the relationship.
					Relation.draw();
				}	
			}
		}
	}
	//
	//Get the dest (away) entity, if it belongs to the same database as that of the current 
	//application.
	 get_away_entity(Foreign:schema.foreign):entity|false{
		//
		//Get the referenced database name
		const dbname:string = Foreign.ref.db_name;
		//
		//Continue only if the database name is the same as that of the application's database
		if (dbname !== app.app.current.dbname) return false;
		//
		//Get the referenced table name
		const ename:string = Foreign.ref.table_name;
		//
		//Get and return the referenced entity
		return meta_visuo.entities[ename];
	};
				
	// 
	//Move the selected entity to the double-clicked position
	entity_move(ev:MouseEvent):void{
		//
		//1. Get the selected entity
		//
		//Get the group that corresponds to the selected entity
		const group = <SVGGraphicsElement|null>meta_visuo.svg.querySelector('.selected');
		//
		//If there is no selection then discontinue the move
		if (group===null) return;
		//
		//
		//Get the name of the entity; it is the same as the id of the group
		const ename:string = group.id;
		//
		//Get the named entity
		const entity:entity = meta_visuo.entities[ename];
		//
		//Get the coordinates of the double-clicked position (in real units)
		const position:DOMPoint = this.entity_get_new_position(ev, group);
		//
		entity.move(position);
	}

	// 
	//Get the coordinates of the double-clicked position (in real units)
	//Get the coordinates of the double-clicked position, given the event generated by the
	//double clicking. This proceeds as follows:-
	entity_get_new_position(ev:MouseEvent, element:SVGGraphicsElement):DOMPoint{
		//
		//-Get the mouse coordinates (in pixels) where the clicking occured on the canvas. Use
		//client coordinates and then use the screen ctm for the transformation
		// We investigated and the combination worked why it worked????
		const x:number = ev.clientX;
		const y:number = ev.clientY;
		//
		//-Convert the mouse pixel coordinates to the real world coordinates, given our current
		// viewbox
		//
		//Use the x and y pixels to define an svg point
		const point_old:DOMPoint = new DOMPoint(x,y); 
		//
		//Get the CTM matrix which transforms a real world coordinate to pixels.
		const ctm:DOMMatrix|null = element.getScreenCTM();
		//
		//If the ctm is null, then something is unusual. CRUSH
		if (ctm===null) throw 'A null dom matrix was not expected';
		//
		//BUT we want pixels to real world, i.e., the inverse of the CTM
		const ctm_inverse:DOMMatrix = ctm.inverse();
		
		//
		//Use the inverse matrix of the CTM matrix to transform the old point to new one
		const point_new:DOMPoint = point_old.matrixTransform(ctm_inverse); 
		//
		return point_new;
	}
}
//
// This class is for managing all the code that is jointly shared for the markers
//   
abstract class marker{
	constructor(){
		//
		//DRAW THE LINE  MARKER
		// Create the marker element for the attributes.
		const marker:SVGMarkerElement =<SVGMarkerElement>document.createElementNS(svgns,"marker");
		// 
		//Attach the marker to the svg element
		meta_visuo.svg.appendChild(marker);
		// 
		// Supply the marker attributes
		//
		//Define the marker view box
		const panx:number = 0;
		const pany:number=0;
		// 
		//Set the width of the viewport into which the <marker> is to be fitted when it is 
		//rendered according to the viewBox
		const realx:number = 16;
		// 
		//Set the height of the viewport into which the <marker> is to be fitted when it is 
		//rendered according to the viewBox 
		const realy: number =16;
		//
		//Marker size (pixels)
		//Set the height of the marker
	    const tickheight:number=8;
		// 
		//Set the width of the marker
		const tickwidth: number=8;
		//
		//Set the marker view box
		marker.setAttribute("viewBox",`${[panx, pany, realx, realy]}`);
		//
		//Set the name of the marker
		marker.setAttribute("id", this.constructor.name);
		//
		//
		//Set the reference point for the marker to be the center of the viewbox
		//Define the x coordinate of the marker referencing point
		marker.setAttribute("refX",`${0.5*realx}`);
		// 
		//Define the y coordinate of the marker referencing point
		marker.setAttribute("refY",`${0.5*realy}`);
		marker.setAttribute("markerWidth",`${tickwidth}`);
		marker.setAttribute("markerHeight",`${tickheight}`);
		//
		marker.setAttribute("orient","auto");
		//
		//Trace the path that defines this marker
		const path:SVGElement = this.get_path();
		// 
		// Attach the line marker to the marker element
		marker.appendChild(path);
	}

	abstract get_path():SVGElement;
}
//The code that is specific to the arrow
class arrow extends marker{

	//Draw the arrow marker
	get_path():SVGPathElement{
		//
		//Draw the arrow path
		const path:SVGPathElement = <SVGPathElement>document.createElementNS(svgns,"path");
		//
		// Draw the arrow path
		path.setAttribute("d","M 8 8 L 0 0 L 0 16 z ");
		//
		return path;
	}
}
//The code that is specific to the line_tick_path
class tick extends marker{

	// 
	//Draw the tick mark 
	get_path():SVGLineElement{
		//
		// Creating the line marker.
		const path_tick:SVGLineElement = <SVGLineElement >document.createElementNS(svgns,"path");
		//
		//Draw the path that represent a line tick mark
		path_tick.setAttribute("d","M 8 8 L 8 8 8 16");
		// 
		//Return the svg element
		return path_tick;
	}
}
// 
//The entity in the meta-visuo namespace is an extension of the schema version
class entity extends schema.entity implements point {
	//
	//The radius of the circle that defines our entity
	radius:number=5;
	//
	//The angle of the attributes
	angle:number =0;
	//
	element?:SVGGraphicsElement;
	//
	attributes:Array<schema.attribute>;

	//
	constructor(
		public name:string,
		//
		//The center of the circle that represents this entity 
		public x:number=128*Math.random(), 
		public y:number=64*Math.random(), 
		
	){
		//The database in which the entity is located
		const dbase:schema.database = app.app.current.dbase!;
		//
		//The static version of the entity that we are trying to create
		const sentity:schema.Ientity = dbase.static_dbase.entities[name];
		//
		//Construct the schema entity 
		super(dbase, sentity);
		//
		//Get this entity's columns 
		const columns:Array<schema.column> = Object.values(this.columns);
		//
		//Keep only the attributes
		this.attributes = <Array<schema.attribute>>columns.filter(col=>col instanceof schema.attribute);
	}
	
	//Draw this  as a circle with attributes at some angle
	draw():entity{
		//
		//Draw the circle of the entity and return the circle element
		const circle:SVGCircleElement = this.draw_circle();
		// 
		//Draw the labels of the entity and return an element under which all the lebeling 
		//elements are grouped
		const attributes:SVGElement = this.draw_attributes();
		//
		//Draw the entity text and return the text element
		const text:SVGTextElement = this.draw_text(this.name,this.x,this.y);
		//
		//Group the elements that define an entity
		this.element = this.draw_group(circle, attributes, text); 
		//
		//Return this entity
		return this;
	}

	//Draw the circle that represents the entity 
	draw_circle():SVGCircleElement{
		//		
		//Create the circle element to represent an entity  
		const c:SVGCircleElement = document.createElementNS(svgns,"circle");
		// 
		//Attach the circle to the svg element
		meta_visuo.svg.appendChild(c);
		// 
		// Set the x coordinate of the centre of the circle
		c.setAttribute("cx",`${this.x}`);
		// 
		// Set the y coordinate of the centre of the circle
		c.setAttribute("cy",`${this.y}`);
		// 
		// Set the circle radius.
		c.setAttribute("r",`${this.radius}`);
		 //
		return c;
	}
	// 
	//Create a group that puts the entity circle,labels and text into a single group
	// 
	draw_group(circle:SVGCircleElement, labels:SVGElement, text:SVGTextElement):SVGGraphicsElement{
		// 
		// Create the entity group tag
		const group:SVGGraphicsElement = document.createElementNS(svgns,"g");
		//
		//Assign the group id, to match the entity being created
		group.id = this.name;
		// 
		//Attach the circle, labels and text elements to the entity group
		group.append(circle, labels, text); 
		//
		//Atach the entity group to the svg
		meta_visuo.svg.appendChild(group);
		//
		//Add an event listener such that when this entity is clicked on, the selection is  
		//removed from any other entity that is selected and this becomes selected 
		group.onclick=()=>this.select();
		// 
		//Return the entity group
		return group;
	}
	// 
	// Draw the name of the entity represented on the diagram
	draw_text(name:string,centerx:number,centery:number):SVGTextElement{
		// 
		// Create the text element to representan entity
		const text:SVGTextElement =document.createElementNS(svgns,"text");
		// 
		// Attach the text to the svg element
		meta_visuo.svg.appendChild(text);
		// 
		// Set the x and y coordinates of the text
		text.setAttribute("x",`${centerx}`);
		text.setAttribute("y",`${centery}`);
		text.setAttribute("id",'tag');
		// 
		// Set the text position of the entity
		text.setAttribute("text-anchor","middle");
		text.textContent= (`${name}`);
		//
		return text;
	}
	// 
	// Draw the attributes of this entity
	draw_attributes():SVGElement{

		//A. Create a tag for grouping all the attributes.This is the tag that we return eventually
		// 
		//Create a group tag for placing all our attributes.
		const gattr:SVGElement = document.createElementNS(svgns,"g");
		// 
		//Attach the group element to the svg tag.
		meta_visuo.svg.appendChild(gattr);
		// 
		// Rotate the g tag about the center according to the suggested angle. 
		gattr.setAttribute("transform",`rotate(${this.angle},${this.x}, ${this.y})`);
		// 
		//B. Create the polyline that is the backbone of the attributes
		//
		//Create the polyline element 
		const poly:SVGPolylineElement = document.createElementNS(svgns,"polyline");
		// 
		//Attach the polyline to the svg element
		gattr.appendChild(poly);
		//
		//Get the points that define the polyline segments, in the format of e.g., 
		// ["3,40" "5,36" "9,32"]
		const values:Array<string>=this.attributes.map((lables,i)=>{return `${this.x},
			${this.y-this.radius - 4*i}`});
		// 
		//Join the values with a space separator 
		const points:string= values.join(" ");
		// 
		//Define the polyline segments 
		poly.setAttribute('points', points);
		//
		//Attach the markers to the polyline segments, assuming that we have defined a marker
		//by that name
		poly.setAttribute("marker-mid","url(#tick)");
		poly.setAttribute("marker-end","url(#tick)");
		// 
		//C. Create a tag for grouping the text elements that represent the attribute names,
		//so that we can control trhoer positioning, especially the top and bortoom margins
		const gtext= document.createElementNS(svgns,"g");
		//
		//Attach the text group tag to the parent attribute group
		gattr.appendChild(gtext);
		// 
		//Defining the top and left margins of the text labels
		const left:number=2;
		const top:number=1;
		//
		// Provide top and and left margins for the text labels  
		gtext.setAttribute("transform",`translate(${left},${top})`);
		//
		//For each attribute name, draw its label
		this.attributes.forEach((attribute, i)=>this.attribute_draw(attribute.name, i, gtext));
		//
		//Return the attribute group
		return gattr;
	}
	// 
	//Draw the given label at the given index position
	attribute_draw(
		//
		//The lable that represents the properties in an entity 
		label:string,
		//
		// 
		index:number,
		//
		//The group that attach together the attributes and the line segments together 
		gtext:Element,
		
	):void{
		//
		//Create the label text Element
		const element:SVGTextElement = <SVGTextElement>document.createElementNS(svgns, "text");
		// 
		//Append the label text element to the gtext group element
		gtext.appendChild(element);

		//Set the x coordinate to the fixed value of x
		element.setAttribute("x",`${this.x}`);
		//
		//Set the y coordinate to the radius plus 1 units from the center minus index times 4
		element.setAttribute("y",`${this.y-this.radius -4*index}`);
		//
		//Set the name of the label
		element.textContent= label;
	}

	// 		
	//Mark this entity as selected
	select(){
		//
		//Get the entity that was previously selected
		const previous:HTMLElement|null = meta_visuo.svg.querySelector('.selected');
		//
		//If there is any, deselect it
		if (previous!==null) previous.classList.remove('selected');
		//
		//Mark this entity as selected
		this.element!.classList.add('selected');
	}
	// 
	
	//Move this entity to the given position
	move(position:DOMPoint):void{
		//
		//Update the cordinates of this entity with the new position
		this.x = position.x;
		this.y = position.y;
		//
		//Set the angle of the moved entity to 0
		this.angle=0;
		//
		//Remove from the svg, the element the cooreponsd to this entity
		meta_visuo.svg.removeChild(this.element!); 
		//
		//5. Re-draw the selected entity such that the center of the entity's circle
		//lies at the double clicked position
		this.draw();
	}
}
//
//The 3 points that define a relation
interface Irelation{
	mid:point;
	start:point;
	end:point;
}
//This class represents an is_a relation between two entities
class relation{
	//The entity from the the relation comes
	public src:entity;
	//
	//The entity to where the relation ends
	public dest:entity;
	// 
	// 
	constructor(src:entity, dest:entity){
		this.src=src;
		this.dest = dest;
	}

	//Draw the relation between the source and the destination entities
	draw():void{
		//
		//Get the 3 points that define the relation betweeen the source  and
		//the destination entities, e.g., {start:{x:4,y:50}, mid:{x:7, y:10}, end:{x:40, y:19}}
		const points:Irelation = this.get_relation_points(this.src, this.dest);
		//
		//Express the points in the form required for a polyline, e.g., 4,50 7,10 40,19 
		const p1 =`${points.start.x},${points.start.y}`;
		const p2=`${points.mid.x}, ${points.mid.y}`;
		const p3 =`${points.end.x},${points.end.y}`;

		// 			POLYLINE
		// Create the polyline element
		const polyline:SVGPolylineElement =<SVGPolylineElement> document.createElementNS(svgns,"polyline");
		// 
		//Attach the polyline to the svg element
		meta_visuo.svg.appendChild(polyline);
		// 
		//Set the polyline's points
		polyline.setAttribute('points', `${p1} ${p2} ${p3}`);

		//Attach the marker to the middle point of the polyline. Please ensure that
		//the marker named arrow is available. How? By exceuting the marker drawing code
		polyline.setAttribute("marker-mid","url(#arrow)");
	}
	// 
	//The second version of calculating the exact mid point
	//
    //There are 3 points of interest along the hypotenuse between source entity a and 
	// source entity b, viz.,start, mid and end.
    get_relation_points(a:entity, b:entity):Irelation{
		//
		//IN MOST CASES, when the x coordinate of circle 1 is equivalent to the x-coordinate
		// of circle 2, then we have a zero difference that will be carried forward to be
		// evaluated later on, will return values of infinity or zero later on.
		//
		//To prevent this from happening, if the difference,i.e., (b.y - a.y) or (b.x - a.x) is 
		//zero, set it to be greater than zero,i.e., 0.1 or greater.
		//
		//
		let opposite:number;
        //
        //The 'opposite' is the y distance between a and b
        //const opposite:number= b.y - a.y;
		if((b.y-a.y)!== 0){
			opposite= b.y - a.y;
		}
		else{
			opposite=0.1;
		}
		let adjacent:number;
        //
        //The 'adjacent' is the x distance between the source entity of a and destination entity b
        //const adjacent = b.x - a.x;
		if((b.x - a.x)!==0){
			adjacent=b.x - a.x;
		}
		else{
			adjacent=0.1;
		}
        //
        //The hypotenuse is the square root of the squares of the 'adjacent' and 
        //the 'opposite'
        const hypotenuse = Math.sqrt(adjacent*adjacent + opposite*opposite);
        //
        //The targent of thita is calculated by 'oppposite' divided by the 'adjacent'
        const tanthita = opposite/adjacent;
        //
        //Thita is the inverse of the 'tanthita'
        const thita:number = Math.atan(tanthita);
		//
		//The angle of interest is...
		const phi = (adjacent>0) ? thita: Math.PI + thita;
        //
        //Let 'start' be the point at  the intersection of the entity centered as the source 
        const start = this.get_point(a, phi,a.radius);
        //
        //Let 'mid' be the point mid way along entity source and destination hypotenuse
        const mid = this.get_point(a, phi, 0.5*hypotenuse);
        //
        //Let 'end' be the point at the intersection of hypotenuse and the entity referred as the  
        //destination
        const end = this.get_point(a, phi, hypotenuse-b.radius);
        //
        //Compile and return the desired final result
        return {start, mid, end};
    }

    //Returns the coordinates of the point which is 'hypo' units from 'a' along
    //the hypotenuse of a and b (which is inclined at angle thita) 
    get_point(a:entity, thita:number, hypo:number):point{
        //
        //The 'opp' is the 'hypo' times the sine of 'thita';
        const opp:number = hypo * Math.sin(thita);
        //
        //The 'adj' is the 'hypo' times the cosine of thita where thita is the
        //angle between 'adj' and 'hypo'
        const adj = hypo * Math.cos(thita);
        //
        //The x coordinate of the mid point is 'adj' units from the center of a
        const x:number = a.x + adj;
        //
        //The y coordinate of the mid point is the 'opp' units from the center of a
        const y:number = a.y + opp; 
        //
        //The desired point is at x and and y units from the origin
        return  {x, y};
    }
}
