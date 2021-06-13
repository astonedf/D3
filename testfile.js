let mp = []

var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("riot_champion.csv",function(d){
    // fonction de conversion
    // second paramètre
    return {
      // 2,3,4 ne conserver que trois données
      // doubler la valeur de terrain au passage
      name : d.name,
      key : +d.key, 
      
    }
  }).then(data => {
    // affichage des données
    console.log("Data",data);

  // X axis: scale and draw:
  var x = d3.scaleBand()
      .domain([data, d => d.name])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.bin()
      .value(d => d.key)   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  console.log(bins)

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, d => d.length)]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")

});


function statPerLevel(data, stat, statPerLevel) {
  let statPerLevelValue = 0
  let statArray = []

  for (var i=0; i < 18; i++) {
      statPerLevelValue = stat + (i * statPerLevel)
      statArray.push(statPerLevelValue)
          
      }
      statDict[data.name] = statArray
      console.log(statDict) 
      return statDict 
}