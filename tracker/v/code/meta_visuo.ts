
//Resolve references to the schema namespace
import * as schema from "./../../../schema/v/code/schema.js";
import * as outlook  from "./../../../outlook/v/code/outlook.js";

//THis library helps us to talk to the server in PHP
import * as server from "./../../../schema/v/code/server.js"

import * as quest from "../../../schema/v/code/questionnaire.js";
// 
// Define the namespace needed to create svg elements
const svgns = "http://www.w3.org/2000/svg";


//This is the class we are modelling visually
export class database extends schema.database{
    //
	//This is the svg property.
	public  svg:SVGElement;
	//
	//The entities of the current application database.
	public entities:{[index:string]:entity};
    //
    //Collection of (unindexed) raltons for thos entity
    public relations:Array<relation>;
	// 
	//Set the view box properties.
	//
	//Set the panning attributes of a view box.
	public panx:number = 0; 
	public pany:number=0;
	//
	//Set the scaling attributes of a view box.
	public zoomx:number=128; 
	public zoomy:number=64;
	// 
	//class constructor.
	constructor(
        //The HTL tag where to hook the svg element for this dataase
        public hook:HTMLElement,
        //
        //This is the view from we lauched this metaviso database
        public view:outlook.view,
        //
        //The schema database that is the extension of this meta-vusio version  
        public dbase:schema.database
    ){
        super(dbase.static_dbase);

		//Prepare to set the SVG element
		// 
		//Create the svg element in our content element in the html file.
		this.svg = this.view.document.createElementNS(svgns,"svg");
		//
		//Attach the svg to the hook.
		hook.appendChild(this.svg);
		//
		//Add an event listener for moving the entity group to the double clicked position.
		this.svg.ondblclick = (ev)=>this.entity_move(ev);
        // 
		//Add the view box attribute, based on the zoom and pan settings.
		this.svg.setAttribute("viewBox",`${[this.panx, this.pany, this.zoomx, this.zoomy]}`);
		//
        //Add the zooom out event listener to the zoom_out button
        this.view.get_element('zoom_out').onclick = ()=>this.zoom('out');
        this.view.get_element('zoom_in').onclick = ()=>this.zoom('in');
        // 
        //Add the pan_left,pan_right,pan_up and pan_down event listener button.
        this.view.get_element('pan_left').onclick = ()=>this.pan('left');
        this.view.get_element('pan_right').onclick = ()=>this.pan('right');
        this.view.get_element('pan_up').onclick = ()=>this.pan('up');
        this.view.get_element('pan_down').onclick = ()=>this.pan('down');
        //
        //Create the meta-visuon entities
        this.entities = this.create_entities(dbase);
        //
        //Create the meta_visuon rellations 
        this.relations = this.create_relations(dbase);
        
	}

    //Zoming out is about increasing the zoom x an y componnets of this database
    //by some fixed percentage, say 10%
    zoom(dir:'in'|'out'):void{
        //
        // 
        const sign = dir==='in' ? +1: -1;
        //
        //Change the databse zooms
        this.zoomx = this.zoomx + sign * this.zoomx * 10/100;
        this.zoomy = this.zoomy + sign * this.zoomy * 10/100;
        //
        this.svg.setAttribute("viewBox",`${[this.panx, this.pany, this.zoomx, this.zoomy]}`);
		
    }
    // 
    //
    pan(dir:'up'|'left'|'right'|'down'):void{
        //
        //Determin x, the amount by which to pan x, as 5% of 132
        const x = 5/100*132;
        //
        //Detemine y,the amount by which to pan y, as 5% of 64
        const y= 5/100*64;
        //
        //Determine the pan direction and and make the necessary pan
        //propertu changes
        switch (dir) {
            case 'up':
                //
                //Change the pany by some positive amount (y)
                this.pany  = this.pany + y; 
                break;
            case 'down':
                //    
               //Change pany y with some negative amount (y)
               this.pany= this.pany - y;
               break;
            case 'left':
                //
                //Change the pan x with some positive amount (x)
                this.panx = this.panx + x;
                break;
            case 'right':
                //Change panx with some negative amount (x)
                this.panx +=x;
                break    
        }
        //
        //Effect the changes
        this.svg.setAttribute("viewBox",`${[this.panx, this.pany, this.zoomx, this.zoomy]}`);
		
    }

    //Create theh metavisuo entiies
    create_entities(dbase:schema.database):{[index:string]:entity}{
        //
        //Start with an empty collection of entites
        const entities:{[index:string]:entity} = {};
        //
        //
		//Loop over all schema entities and convert them to metavisuo versions, saving and 
		//drawing them at the same time
		for(const ename in dbase.entities){
			//
			//Create the meta-viso entity (with default, i.e., random, xand y coordinates)
			const ent = new entity(this, ename);

			//Save the newly created entity to the metavisuo entities.
			entities[ename] = ent;
		}
        //
        //Rteurn the constructed entities
        return entities; 
    }

    //
    //Save the entity coordinates to the datanase
    async save():Promise<void>{
        //
        //Collect all thelabel for saving the x and y coordinates to a databse
        const layouts:Array<quest.layout> = [...this.collect_labels()];
        //
        //Execute the loading of layuots
        const result:'Ok'|string = await server.exec('questionnaire', [layouts], 'load_common',
             ['log.xml']);
        //
        //Report the result
        alert(result);
    }

    *collect_labels():Generator<quest.label>{
        //
        yield ['meta_visuo', 'dbase', [], 'name', this.dbase.name];
        //
        yield['meta_visuo', 'dbase', [], 'pan_x', this.panx];
        yield['meta_visuo', 'dbase', [], 'pan_y', this.pany];
        yield['meta_visuo', 'dbase', [], 'zoom_x', this.zoomx];
        yield['meta_visuo', 'dbase', [], 'zoom_y', this.zoomy];
        
        
        //
        for(const key in this.entities){
            //
            const entity:entity = this.entities[key];
            //
            yield ['meta_visuo', 'entity', [entity.name], 'name', entity.name]
            yield ['meta_visuo', 'entity', [entity.name], 'x', entity.x];
            yield ['meta_visuo', 'entity', [entity.name], 'y', entity.y];
        }
    }

	// 
    //Draw the datanase entities and relations
	async draw(): Promise<void>{
		//
		//Define the tick marker
		new marker.tick(this.svg);
		// 
		//Draw the arrow marker
		new marker.arrow(this.svg);
        //
        //Load the position data for the entities from the database
        await this.load_x_y_positions();
        //
        //Ovrride the default zoom and pan settings with those from the database
        //await this.load_viewbox();
        //
		//Loop over all schema entities and convert them to metavisuo versions, saving and 
		//drawing them at the same time
		for(const ename in this.entities){
			//
			//Draw type metavisuo entity
			this.entities[ename].draw();
		}
        // 
        // Draw the relationships.
        this.relations.forEach(Relation=>Relation.draw());
	}

    //Load the entities' x and y coordinates from the metavisuo database
    async load_x_y_positions():Promise<void>{
        //
        //Compile the sql
        const sql:string = 
        `select
            entity.name,
            entity.x,
            entity.y
         from
            entity
            inner join dbase on entity.dbase = dbase.dbase
         where
            dbase.name = '${this.dbase.name}'   

        `
        //
        // 
        const result:Array<{name:string, x:number, y:number}> = await server.exec('database', ['meta_visuo'], 'get_sql_data', [sql]);
        //
        //Loop through all the array elements and set the x and y values for named
        //entity
        // Load the array of x,y position to this database
        result.forEach(row=>{
            const entity = this.entities[row.name];
            entity.x=row.x; 
            entity.y=row.y
        })
    }
		

	//
	//Loop over all metavisuo entities, extract the foreign keys, for each foreign key
	//find out the home and away entity, use them to create our relations and save the relations.
	create_relations(dbase:schema.database):Array<relation>{
        //
        //Stary with an empty list or relations
        const relations:Array<relation> = [];
		// 
		//For each metavisuo entity...
		for(const ename in dbase.entities){
			//
			//a. Get the named entity
			const entity:schema.entity = dbase.entities[ename];
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
				const src:entity = this.entities[ename];
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
                    //Save the relation
                    relations.push(Relation);    
				}	
			}
        }
        return relations;    
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
		if (dbname !== this.dbase.name) return false;
		//
		//Get the referenced table name
		const ename:string = Foreign.ref.table_name;
		//
		//Get and return the referenced entity
		return this.entities[ename];
	};
				
	// 
	//Move the selected entity to the double-clicked position
	entity_move(ev:MouseEvent):void{
		//
		//1. Get the selected entity
		//
		//Get the group that corresponds to the selected entity
		const group = <SVGGraphicsElement|null>this.svg.querySelector('.selected');
		//
		//If there is no selection then discontinue the move
		if (group===null) return;
		//
		//
		//Get the name of the entity; it is the same as the id of the group
		const ename:string = group.id;
		//
		//Get the named entity
		const entity:entity = this.entities[ename];
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

namespace marker{
    //
    // This class is for managing all the code that is jointly shared for the markers
    //   
    abstract class root{
        //
        constructor(public svg:SVGElement){
            //
            //DRAW THE LINE  MARKER
            // Create the marker element for the attributes.
            const marker:SVGMarkerElement =<SVGMarkerElement>document.createElementNS(svgns,"marker");
            // 
            //Attach the marker to the svg element
            this.svg.appendChild(marker);
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
            const tickheight:number=16;
            // 
            //Set the width of the marker
            const tickwidth: number=16;
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
        // 
        abstract get_path():SVGElement;
    }

    //The code that is specific to the arrow
    export class arrow extends root{
        //
        constructor(svg:SVGElement){
            super(svg);
        }
        // 
        //Draw the arrow marker
        get_path():SVGPathElement{
            //
            //Draw the arrow path
            const path:SVGPathElement = <SVGPathElement>document.createElementNS(svgns,"path");
            //
            // Draw the arrow path
            path.setAttribute("d","M 8 8 L 0 4 L 0 12 z ");
            //The class necessarly for styling arrow marker
            path.setAttribute('class','arrow');
            //
            return path;
        }
    }
    //The code that is specific to the line_tick_path
    export class tick extends root{
        //
        constructor(svg:SVGElement){
            super(svg)
        }
        // 
        //Draw the tick mark 
        get_path():SVGLineElement{
            //
            // Creating the line marker.
            const path_tick:SVGLineElement = <SVGLineElement >document.createElementNS(svgns,"path");
            //
            //Draw the path that represent a line tick mark
            path_tick.setAttribute("d","M 8 8 l -0.5 16 h 1");
            path_tick.setAttribute('stroke','red');
            // 
            //Return the svg element
            return path_tick;
        }
    }
}    
    // 
    //The entity in the meta-visuo namespace is an extension of the schema version
    class entity extends schema.entity {
        public x:number; 
        public y:number;
        //
        //The radius of the circle that defines our entity
        radius:number=4;
        //
        //The angle of the attributes
        angle:number =0;
        //
        element?:SVGGraphicsElement;
        //
        attributes:Array<schema.attribute>;
        //
        //Redeclare the entity database to make consistent with metavisuon one
        declare dbase:database;
        //
        constructor(
            //
            //The metavisuo database
            dbase:database,
            //
            public name:string,
            //
            //The center of the circle that represents this entity 
            x?:number, 
            y?:number 
        ){
            //
            //The static version of the entity that we are trying to create
            const sentity:schema.Ientity = dbase.static_dbase.entities[name];
            //
            //Construct the schema entity 
            super(dbase, sentity);
            //
            //Set the x and y value to to either the given values or a random number
            this.x = x ===undefined ? dbase.zoomx * Math.random(): x;
            this.y = y===undefined ? dbase.zoomy * Math.random(): y;
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
            this.dbase.svg.appendChild(c);
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
            this.dbase.svg.appendChild(group);
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
            this.dbase.svg.appendChild(text);
            // 
            // Set the x and y coordinates of the text
            text.setAttribute("x",`${centerx}`);
            text.setAttribute("y",`${centery}`);
            text.setAttribute("class",'lables');
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
            this.dbase.svg.appendChild(gattr);
            // 
            // Rotate the g tag about the center according to the suggested angle. 
            gattr.setAttribute("transform",`rotate(${this.angle},${this.x}, ${this.y})`);
            // 
            //The id necessary for styling
            gattr.setAttribute('class','gattribute');
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
                ${this.y-this.radius - 2*i}`});
            // 
            //Join the values with a space separator 
            const points:string= values.join(" ");
            // 
            //Define the polyline segments 
            poly.setAttribute('points', points);
            // 
            //The class to be provided in order to style the attribute hosting the attributes
            poly.setAttribute('class','attrpoly');
            //
            //Attach the markers to the polyline segments, assuming that we have defined a marker
            //by that name
            poly.setAttribute("marker-mid","url(#tick)");
            poly.setAttribute("marker-end","url(#tick)");
            // 
            //C. Create a tag for grouping the text elements that represent the attribute names,
            //so that we can control the  positioning, especially the top and bottom margins
            const gtext= document.createElementNS(svgns,"g");
            //
            //Attach the text group tag to the parent attribute group
            gattr.appendChild(gtext);
            // 
            //Defining the top and left margins of the text labels
            const left:number=2;
            const top:number=0.5;
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
            element.setAttribute("y",`${this.y-this.radius -2*index}`);
            //
            //Set the name of the label
            element.textContent= label;
        }
        // 		
        //Mark this entity as selected
        select(){
            //
            //Get the entity that was previously selected
            const previous:HTMLElement|null = this.dbase.svg.querySelector('.selected');
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
            //Remove from the svg, the element that corresponds to this entity
            this.dbase.svg.removeChild(this.element!); 
            //
            //5. Re-draw the selected entity such that the center of the entity's circle
            //lies at the double clicked position
            this.draw();
            //
            //Clear all relations
            this.dbase.relations.forEach(Relation=>Relation.clear());
            //
            //Draw all relations
            this.dbase.relations.forEach(Relation=>Relation.draw());
            //
            //Mark the entity as selected
            this.element?.classList.add('selected');
        }
    }
    //
    //This class represents an is_a relation between two entities
    class relation{
        //The entity from the relation comes
        public src:entity;
        //
        //The entity to where the relation ends
        public dest:entity;
        // 
        //The polyline that represents this relationhip
        public polyline?:SVGElement;
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
            const {start, mid, end} = this.get_relation_points(this.src, this.dest);
            //
            //Express the points in the form required for a polyline, e.g., 4,50 7,10 40,19 
            const p1 =`${start.x},${start.y}`;
            const p2=`${mid.x}, ${mid.y}`;
            const p3 =`${end.x},${end.y}`;

            // 			POLYLINE
            // Create the polyline element
            const polyline:SVGPolylineElement =<SVGPolylineElement> document.createElementNS(svgns,"polyline");
            // 
            //Attach the polyline to the svg element
            this.src.dbase.svg.appendChild(polyline);
            // 
            //Set the polyline's points
            polyline.setAttribute('points', `${p1} ${p2} ${p3}`);
            // 
            //The class that will style the lines showing the relations.
            polyline.setAttribute('class','relations');
            //Attach the marker to the middle point of the polyline. Please ensure that
            //the marker named arrow is available. How? By exceuting the marker drawing code
            polyline.setAttribute("marker-mid","url(#arrow)");
            //
            //Save the polyline for future references
            this.polyline = polyline;
        }
        //
        //Clear a relation
        clear():void{
            //
            this.src.dbase.svg.removeChild(this.polyline!);
        }

        // 
        //The second version of calculating the exact mid point
        //
        //There are 3 points of interest along the hypotenuse between source entity a and 
        // source entity b, viz.,start, mid and end.
        get_relation_points(a:entity, b:entity):{start:DOMPoint, mid:DOMPoint, end:DOMPoint}{
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
        // 
        //Returns the coordinates of the point which is 'hypo' units from 'a' along
        //the hypotenuse of a and b (which is inclined at angle thita) 
        get_point(a:entity, thita:number, hypo:number):DOMPoint{
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
            return  new DOMPoint(x, y);
        }
    }   