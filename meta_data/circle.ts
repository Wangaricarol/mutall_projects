//
//displaying the metavisuo chart
class meta_visuo extends outlook.terminal{
	//
	//class constructor
	constructor(mother:main,file:string){
		super(mother,file)
	}
	//show panels
	public async show_panels(): Promise<void> {
        // 
        Attribute("cy","32");
        // 
        // Set the circle radius.
        c1.setAttribute("r","5");
		
        //		//Attaching the file to the svg element 
        const svg =this.get_element('canvas');
        // 
        //Namespace needed to create svg elemments.
        const svgns = "http://www.w3.org/2000/svg";
		// 
		//
		//		C1
        //Create the first circle
		// providing a namespace element to create circle 1.  
        const c1:SVGCircleElement = document.createElementNS(svgns,"circle");
		// 
		//Append the circle to the svg 
        svg.appendChild(c1);
		// 
        // Draw the first circle
        // set the x coordinate
        c1.setAttribute("cx","32");
        // 
        // Set the y coordinate
        c1.setC2
		// Create the second circle.
		//Namespace to provide the svg circle element
        const c2:SVGCircleElement = document.createElementNS(svgns,"circle");
        //
        //Append the circle to the svg 
        svg.appendChild(c2);
		// 
		// Draw the second circle
        // set the x coordinate
        c2.setAttribute("cx","112");
        // 
        // Set the y coordinate
        c2.setAttribute("cy","32");
        // 
        // Set the circle radius.
        c2.setAttribute("r","5");

		// 			TEXT in C1
		// Create text namespace
		const text:SVGTextElement = document.createElementNS(svgns, "text");
		//
		//Append the text to the svg element
		svg.appendChild(text);
		// 
		// Set the x, y and content
		text.setAttribute("x","30");
		text.setAttribute("y","32");
		text.textContent= ("event");

		// 			TEXT in C2
		// Create text namespace
		const name:SVGTextElement = document.createElementNS(svgns, "text");
		// 
		//Append the text to the svg element
		svg.appendChild(name);
		// 
		// Set the x, y and content
		name.setAttribute("x","107");
		name.setAttribute("y","32");
		name.textContent= ("activity");
		
		// 			POLYLINE
		// Create a polyline
		const p:SVGPolylineElement = document.createElementNS(svgns,"polyline");
		// 
		//Attaching the line to the svg element
		svg.appendChild(p);
		// 
		// Set the polyline attribute
		p.setAttribute('points', "32,32 72,32 112,32");

		// Attach the marker to the polyline
		p.setAttribute("marker-mid","url(#arrow)");

		// 		THE ARROW MARKER
		// Provide the marker namespace
		const m:SVGMarkerElement = document.createElementNS(svgns,"marker");
		// 
		//Attaching the marker to the svg element
		svg.appendChild(m);
		// 
		// Supply the arrow marker attributes
		m.setAttribute("viewBox","0 0 16 16");
		m.setAttribute("id","arrow");
		m.setAttribute("refX","4");
		m.setAttribute("refY","4");
		m.setAttribute("markerWidth","8");
		m.setAttribute("markerHeight","8");
		m.setAttribute("orient","auto-start");

		// 		THE ARROW PATH
		// The namespace drawing the arrow marker path.
		const pm:SVGPathElement = document.createElementNS(svgns,"path");
		// Draw the arrow path
		pm.setAttribute("d","M 0 0 L 8 4 L 0 8 z");
		// 
		// Append the marker path to the arrow marker.
		m.appendChild(pm);
	}
	
}
