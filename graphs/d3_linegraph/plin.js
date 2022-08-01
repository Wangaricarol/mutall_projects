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
        //
        .attr("height",height +margin.top+margin.bottom)
        //
        //Append the g element to the svg element 
        .append("g")
        //
        //Add the transform attribute to the g element
        .attr("transform","translate("+margin.left+","+margin.top+")");
    //
//     //create the x axis
    var x = d3.scaleTime()
    //The d3.extent()returns the min and max value in an array from the given array using natural order
    //The d3.domain()
        .domain(d3.extent(data,(d)=>{return d.siku;}))
    //
        .range([0, width-50]);

        svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));//getting the siku data and displaying on the x-axis  
//     //
//     //create the y axis
//     var y = d3.scaleLinear()
//         .domain([0,d3.max(rate)])
//         .range([height, 0]) 
//         svg.append("g")
//      .call(d3.axisLeft(y));

//     // 
//     // Title
//     svg.append('text')
//     .attr('x', 500)
//     .attr('y', 0)
//     .attr('text-anchor', 'middle')
//     .style('font-size', 20)
//     .text(' Error rate line Chart');
    
//     // X label
//     svg.append('text')
//     .attr('x', width/2 + 50)
//     .attr('y', height + 40)
//     .attr('text-anchor', 'middle')
//     .text("Date");
    
//     // Y label
//     svg.append('text')
//         .attr('text-anchor', 'end')
//         .attr('transform', 'rotate(-90)')
//         .attr('x', -margin.left + 10)
//         .attr('y',-margin.top)
//         .text("Rate (%)");
//     //
//     // Draw the line connector
//     svg.append("path")
//     .datum(data)  
//     .style("fill", "none")
//     .style("stroke", "steelblue")
//     .style("stroke-width", "2")
//     .attr("d", d3.line()
//         .x((d)=>{return x(d.siku)})
//         .y((d)=>{return y(d.rate)}));
//     //
//     //Insert the data points to the line graph
//     svg.append('g')
//     //
//     //Define the circle shape
//     .selectAll("dot")
//     //
//     //The values to the data points
//     .data(data)
//     //
//     //Prepare each value of the data above in order to create the circle
//     .enter()
//     //
//     //Create the circle for each value
//     .append("circle")
//     //
//     //Provide the x coordinate of the data point
//     .attr("cx",(d)=>{return x(+d.siku)} )
//     //
//     //Provide the y coordinate for the data point
//     .attr("cy",(d)=>{return y(+d.rate)})
//     //
//     //Give the radii and the color
//     .attr("r", 3)
//     .style("fill", "black");                              
});