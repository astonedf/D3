// set the dimensions and margins of the graph
var margin = {top:20, right:20, bottom:30, left:50},
    width = 4960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;


// set the ranges
var x = d3.scaleBand().range([0,width]);
var y = d3.scaleLinear().range([height,0]);

// define the line
var valueline = d3
    .line()
    .x(function(d) {return x(d.name); })
    .y(function(d) {return y(d.att); });

var valueline2 = d3
    .line()
    .x(function(d) {return x(d.name); })
    .y(function(d) {return y(d.def); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'// moves the 'group' element to the top left margin
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

// Get the data
d3.csv("riot_champion.csv").then(function(data) {
    // format the data
    data.forEach(function(d) {
        d.name = d.name
        d.att = +d["stats.attackdamage"]
        d.def = +d["stats.armor"]
    });

    // Scale the range of the data
    x.domain(data.map(function(d) {return d.name; }));
    y.domain([0, d3.max(data,function(d) {return d.att; })]);

    // Add the valueline 
    svg.append("path")
        .data([data])
        .attr("class","line")
        .attr("d", valueline);
    
    svg.append("path")
        .data([data])
        .attr("class","line")
        .style("stroke","red")
        .attr("d", valueline2);

// Add the X Axis
    svg.append("g")
        .attr("transform","translate(0,"+ height +")")
        .call(d3.axisBottom(x));
        
// Add the Y Axis
    svg.append("g").call(d3.axisLeft(y));
});


/*
let mp = []



lol_data = d3.csv("riot_champion.csv", function(data){
    return {
        name : data.name,
        tags : data.tags,
        key : +data.key
    }
}).then(data => {
    for (var i = 1; i < data.length; i++) {
        value = data[i]['stats.mp']
        //console.log(data[i]['name'])
        mp.push(parseInt(value))
    
    }
    console.log("data", data)
})

console.log("promise",lol_data)

let corps = d3.select('body');

let canvas = corps.append('svg')
    .attr("width", 600)
    .attr("height", 600)




  

async function create_circles(){
    setTimeout(()=>{
        d3.select(".chart")
            .selectAll("div")
            .data(lol_data)
                .enter()
                .append("div")
                .style("width", function(d) { return d.keys + "px"; })
                .text(function(d) { return d.name; });
        console.log("inside timeout"); 
    },5000);

}

create_circles(); */