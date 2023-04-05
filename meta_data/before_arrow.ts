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
		//draw the circle at coordinates of 16,64
		const svg =this.get_element('canvas');
		//
		//Namespace needed to create svg elements
		const svgns = "http://www.w3.org/2000/svg";
		//
		//Set the cirle radius
		const radius:string="5";
		//
		function draw_circle(cx: string, cy:string, name:string):SVGCircleElement{
			//
			//the first circle
			const c=document.createElementNS(svgns,"circle");
			//
			//Append the circle to the svg 
			svg.appendChild(c);
			//
			//Set the cx value
			c.setAttribute("cx", cx);
			//
			//Set the cy value
			c.setAttribute("cy",cy);
			//
			//Set the radius
			c.setAttribute("r", radius);
			//
			//Adding the text in the circle
		
			// 
			// Create text
			const text:SVGTextElement = document.createElementNS(svgns, "text");
			//
			//Append the text to the svg element
			svg.appendChild(text);
			// 
			// Set the x, y and content
			text.setAttribute("x",cx);
			text.setAttribute("y",cy);
			text.textContent= name;
			//
			return c;
		}
		//
		let c1 = draw_circle("48", "32", "member");
		//
		//
		//the larger circle
		const c2=draw_circle("106", "32", "business");
		//
		//third circle
		const c3=draw_circle("48", "48", "message");
		//
		//The fourth circle
		const c4=draw_circle("90", "16", "user");
		
		//Draw the line between circle 1 and circle 2
		function draw_line(c1:SVGCircleElement, c2:SVGCircleElement):SVGLineElement{
			//
			//Create a line element
			const l:SVGLineElement = document.createElementNS(svgns,"line");
			//
			//Attaching the line to the svg element
			svg.appendChild(l);

			const x1 = c1.getAttribute('cx')!; 
			//
			//Set the start and end cordinates of the line.
			l.setAttribute("x1", x1 );
			l.setAttribute("y1",c1.getAttribute('cy')!);
			l.setAttribute("x2",c2.getAttribute('cx')!);
			l.setAttribute("y2",c2.getAttribute('cy')!);
			//
			//Return the created line
			return l;
		}
		//
		//Drawing different lines connecting the circles
		// draw_line(c1, c2);
		draw_line(c3,c4);
		//
	
		//
		// Draw a polyline between circle 1 and circle 2
		
	}
}
