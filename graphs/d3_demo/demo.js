const canvas = d3.select(".canva");
//add an svg element
const svg = canvas.append("svg")
            .attr("width","500")
            .attr("height","250");

svg.append("circle").attr("cx",100)
                    .attr("cy", 100)
                    .attr("r",50)
                    .attr("fill","blue");
                    
svg.append("rect") 
    .attr("width",100)
    .attr("height",100)                   
    .attr("x",160)
    .attr("y",40)
    .attr("fill","green")
    .attr("rx",15)
    .attr("ry",15);

svg.append("line")
    .attr("x1",200)
    .attr("x2",45)    
    .attr("y1",100)
    .attr("y2",100)
    .attr("stroke","red");

//adding text in d3
//
svg.append("text")
    .text("Hello")
    .attr("fill","grey")
    .attr("font-size",20)
    .attr("text-anchor","start")
    .attr("x",110)
    .attr("y",180);

    svg.append("text")
    .text("There")
    .attr("fill","grey")
    .attr("font-size",20)
    .attr("text-anchor","middle")
    .attr("x",110)
    .attr("y",200);

    svg.append("text")
    .text("carol")
    .attr("fill","grey")
    .attr("font-size",20)
    .attr("text-anchor","end")
    .attr("x",110)
    .attr("y",222);

