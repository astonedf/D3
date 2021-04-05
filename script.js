let mp = []

FileAttachment("riot_champion.csv")

lol_data = d3.csv("riot_champion.csv", function(data){
    return {
        name : data.name,
        tags : data.tags,
        key : +data.key
    }
});


d3.csv("riot_champion.csv").then(function appendData(data){
    for (var i = 1; i < data.length; i++) {
        value = data[i]['stats.mp']
        //console.log(data[i]['name'])
        mp.push(parseInt(value))
        
    }
})

console.log(lol_data)

let corps = d3.select('body');

let canvas = corps.append('svg')
    .attr("width", 600)
    .attr("height", 600)




  

async function create_circles(){
    setTimeout(()=>{
        d3.select(".chart")
            .selectAll("div")
            .data(mp)
                .enter()
                .append("div")
                .style("width", function(d) { return d + "px"; })
                .text(function(d) { return d; });
        console.log("inside timeout");
        /* canvas.selectAll('circle')
        .data(mp)
        .enter()
        .append('circle')
            .attr('cx',d => d)
            .attr('cy',300)
            .attr('r',30)
            .style('opacity',0.5); */
    },5000);

}

create_circles();