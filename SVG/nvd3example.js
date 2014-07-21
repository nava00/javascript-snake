svg=d3.select('#my-svg')


function generateData ( ) {
  var numberOfPoints = 20,
      graphData = [],
      series,
      i, j;

  for (i = 0; i < 3; i++) {
    series = [];
    for (j = 0; j < numberOfPoints; j++) {
      series.push({x: j, y: ((i+1) * j)});
    }
    graphData.push({ values: series})
  }

  return graphData;
}

function setupSVG(){
var svgAttributes = {
  width: 500,
  height: 300,
  padding: 25,
  margin : {
    top: 5,
    right: 10,
    bottom: 5,
    left: 10
  }
};

svg.style({
  'width': svgAttributes.width + svgAttributes.margin.left + svgAttributes.margin.right,
  'height': svgAttributes.height + svgAttributes.margin.top + svgAttributes.margin.bottom,
  'padding': svgAttributes.padding,
  'margin': '0 auto'
});

svg.datum(generateData());
svg.transition().duration(500);

chart=nv.models.lineChart();

chart.options({
  x:getX,
  y:getY,
  noData:"Not enough data to graph, stupid!",
  transitionDuration: 500,
  showLegend:true,
  showXAxis:true,
  showYAxis:true,
  rightAlighnYAxis:false
});

chart.xAxis
  .tickFormat(xAxisFormatter)
  .axisLabel("Days since it happened");
chart.yAxis
  .tickFormat(yAxisFormatter)
  .axisLabel("Calls per day");

xAxisFormatter: function (xValue) {
  return d3.format(',d')(xValue)
},

yAxisFormatter: function (yValue) {
  return yValue.toString()
}
}