var data = [4, 8, 15, 16, 2, 23, 42];

var div = document.createElement("div");
div.className="chart"
document.body.appendChild(div);

var div2 = document.createElement("div");
div2.className="chart"
document.body.appendChild(div2);

//d3.select(".chart")
//  .selectAll("div")
//    .data(data)
// .enter().append("div")
//    .style("width", function(d) { return d * 10 + "px"; })
//    .text(function(d) { return d; });
var chart = d3.select(".chart");
var bar = chart.selectAll("div");
var barUpdate = bar.data(data);
var barEnter = barUpdate.enter().append("div");
barEnter.style("width", function(d) { return d * 10 + "px"; });
barEnter.text(function(d) { return d; });