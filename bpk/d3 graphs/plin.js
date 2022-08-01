//get data from performance_data
d3.csv("performance_data.csv",(data)=>{
    //
    //Convert the rate from a string percentage to digit percentage
    const rate= data.map((d)=>{return +(parseFloat(d.rate))});
    //
    //Convert the dates into the digit format
    const siku= data.map((d)=>{return (parseFloat(d.siku))});
    //
    //Set the variables 
    var height=500;
    var width =700;
    var margin={top:30,left:100,right:50,bottom:50};
    //
    //Create the svg section
    var svg = d3.select(".line_chart")
        .attr("width",+width +margin.left+margin.right)
        .attr("height",height +margin.top+margin.bottom)
        .append("g")
        .attr("transform","translate("+margin.left+","+margin.top+")");
    //
    //create the x axis
    var x = d3.scaleLinear()
        .domain([0,d3.max(siku)])
        .range([0, width-50]);
        svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    //
    //create the y axis
    var y = d3.scaleLinear()
        .domain([0,d3.max(rate)])
        .range([height, 0])
        svg.append("g")
     .call(d3.axisLeft(y));

    // 
    // Title
    svg.append('text')
    .attr('x', 500)
    .attr('y', 0)
    .attr('text-anchor', 'middle')
    .style('font-size', 20)
    .text('Line Chart');
    
    // X label
    svg.append('text')
    .attr('x', width/2 + 50)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .text("Date");
    // Y label
    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('x', -margin.left + 10)
        .attr('y',-margin.top)
        .text("Rate (%)");
    //
    //Draw the line connector
    svg.append("path")
    .datum(data)  
    .style("fill", "none")
    .style("stroke", "steelblue")
    .style("stroke-width", "2")
    .attr("d", d3.line()
        .x((d)=>{return x(d.siku)})
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
    .attr("cx",(d)=>{return x(d.siku)} )
    //
    //Provide the y coordinate for the data point
    .attr("cy",(d)=>{return y(d.rate)})
    //
    //Give the radii and the color
    .attr("r", 3)
    .style("fill", "black");                              
});
    