//Get data from performance_data (as an array of objects)
d3.csv("perfomance_data.csv",(data)=>{
    //
    //Pick the rate column and convert them to numbers
        const rate= data.map((d)=>{return +d.rate});
    //
    //Pick the siku colmn from data and convert it to real numbers
        const siku= data.map((d)=>{return (d.siku)});
    //
    //define the format of the new siku column
        const parseTime = d3.timeParse("%Y-%m-%d");
    //
    //convert the siku's to actual dates and the rates to numerical values
        data.forEach((d) => {
            d.rate=+d.rate;
            d.siku=parseTime(d.siku);
        });
    //
    //Define the graph size and position 
        var height=500;
        var width =700;
        var margin={top:30,left:100,right:50,bottom:50};
    //
    //Set up the main svg element
        var svg = d3

    //Get the svg element from the html file; it is classified as linechat
        .select(".line_chart")
    //
    //Add the width attribute to the svg
        .attr("width",+width +margin.left+margin.right)
    //
    //Add the height attribute to the svg
        .attr("height",height +margin.top+margin.bottom)
    //
    //Append the g element to the svg element 
        .append("g")
    //
    //Add the transform attribute to the g element
        .attr("transform","translate("+margin.left+","+margin.top+")");
    
    //create the x axis
    //
        var x = d3.scaleTime()
    //The d3.extent()gets the min and max value of the siku data in order

    //The d3.domain()an array of integers that is defining the extent of siku values and displaying it.
        .domain(d3.extent(data,(d)=>{return d.siku;}))
   
    //the available horizontal space encloses all values in the data domain’s extent (minimum and maximum).
       .range([0, width-50]);
       svg.append("g")

    //Add the transform attribute to the g element of the y axis at the bottom
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));//getting the siku data and displaying on the x-axis  

    //create the y axis
    //d3.scaleLinear creating a scale with a linear relationship between input and output.
        var y = d3.scaleLinear()
    //
    //
        .domain([0,d3.max(rate)])
    //The available vertical space encloses all values in the data domain’s extent (minimum and maximum).
        .range([height, 0]) 
        svg.append("g")
    //Adding the values and the line of the y axis on the graph
        .call(d3.axisLeft(y));

    // Title
    // Displaying and styling the title of the graph
        svg.append('text')
        .attr('x', 500)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-size', 20)
        .text(' Error rate line Chart');
    
    // X label(data)
        svg.append('text')
        .attr('x', width/2 + 50)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .text("Date");
    
    // Y label(Rate (%))
    //Insert the data to the line graph
        svg.append('text')
    //positioning the rate % label on the x axis.
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('x', -margin.left + 10)
        .attr('y',-margin.top)
        .text("Rate (%)");
    //
    // Draw the line connector
        svg.append("path")
        .datum(data)  //Injecting and joining data for visualization in the graph  
    //styling 
        .style("fill", "none") 
        .style("stroke", "steelblue")
        .style("stroke-width", "2")
        .attr("d", d3.line()
    //Joining the data points using a line x axis
        .x((d)=>{return x(d.siku)})
    //Joining the data points using a line y axis
        .y((d)=>{return y(d.rate)}));
    //
    //Insert the data points to the line graph
        svg.append('g')
    //
    //Define the circle shape
        .selectAll("dot")
    //
    //The values to the data points
        .data(data)
    //
    //Prepare each value of the data above in order to create the circle
         .enter()
    //
    //Create the circle for each value
        .append("circle")
    //
    //Provide the x coordinate of the data point
        .attr("cx",(d)=>{return x(+d.siku)} )
    //
    //Provide the y coordinate for the data point
        .attr("cy",(d)=>{return y(+d.rate)})
    //
    //Give the radii and the color
        .attr("r", 3)
        .style("fill", "black");                              
});