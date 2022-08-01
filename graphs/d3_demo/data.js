const canvas = d3.select(".canva");

var dataArray = [4,15,34,123,127];

// // add svg element
// const svg = canvas.append("svg")
//                    .attr("width",600)
//                    .attr("height",600);


const svg = canvas.select("svg");
// const rect = svg.append("rect");
const rect = svg.selectAll("rect")

rect.data(dataArray)
    .enter().append("rect")
    .attr("width",24)
    .attr("fill","orange")
    .attr("height", function(d){
        return d*2;
    })
    .attr("x",function(d,i){
        return i*25; //@ time we add a number it will multiply by 25 to give a diff of 1px
    })
    attr("y",function(d,i){
        return 100 - (d*2);//inverting the graph
    })
