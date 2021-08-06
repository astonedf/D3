// set the dimensions and margins of the graph
var margin = {top:20, right:20, bottom:30, left:70},
    width = 600 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;

let myData
let names = []
let statDict = {}
let tempDict = {}
let levels = new Array(19).keys()
let lastSelectChamp1 = "Garen"
let lastSelectChamp2 = "Ahri"
let domains = {"stats.attackdamage": 150, "armor": 120, "health": 2100 }
let yAxis
let circle
let dot

// set the ranges
let x = d3.scaleBand().range([0,width]);
let y = d3.scaleLinear().range([height,0]);

// define the line
var valueline = d3
    .line()
    .x(function(d) {return x(d.level); })
    .y(function(d) {return y(d["stats.attackdamage"]); });

var valueline2 = d3
    .line()
    .x(function(d) {return x(d.level); })
    .y(function(d) {return y(d["stats.attackdamage"]); });

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'// moves the 'group' element to the top left margin
let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 20)
    .append("g").attr("transform","translate("+ margin.left +","+ margin.top +")");

// Get the data and draws the first example (Garen vs. Ahri)
d3.csv("riot_champion.csv").then(function(data) {

   
    

    myData = data
    // format the data
    myData.forEach(function(d) {
        d.name = d.name
        d.att = +d["stats.attackdamage"]
        d.attPerLevel = +d["stats.attackdamageperlevel"]

        statPerLevel(d, "stats.attackdamage", "stats.attackdamageperlevel", statDict)
        //statPerLevel(d, "stats.armor", "stats.armorperlevel", tempDict)

        //let statPerLevel = 0
        //let statList = []

        //for (var i=0; i < 18; i++) {
          //  let att = new Object()
            //statPerLevel = +d["stats.attackdamage"] + (i * +d["stats.attackdamageperlevel"])
            //att["ad"] = statPerLevel
            //att["level"] = i + 1
            //console.log(att)
            //statList.push(att)
            
        //}
        //statList.push(att)
        //statDict[d.name] = statList 
        //console.log(statDict)
        
    });
    console.log(statDict)
    console.log(statDict["Ahri"][0])

    // Scale the range of the data
    names = data.map(function(d) {return d.name; })
    x.domain(levels);
    //[d3.min(data,function(d) {return d.att; })
    domainY = y.domain([0, 150]);

    

    // Add the valueline 
    svg.append("path")
        .attr("id", "line1")
        .data([statDict["Garen"]])
        .attr("class","line")
        .attr("d", valueline);
    
    svg.append("path")
        .attr("id", "line2")
        .data([statDict["Ahri"]])
        .attr("class","line")
        .style("stroke","var(--bs-orange)")
        .attr("d", valueline2);

          // add the dots with tooltips
    circle = svg.selectAll("circle")
  .data(statDict["Garen"])
    .enter().append("circle")
  .attr("r", 5)
  .attr("cx", function(d) { return x(d.level) })
  .attr("cy", function(d) { return y(d["stats.attackdamage"]) })
  .attr("id", "circles")
  .on("mouseover", function(event,d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("Garen <br/>" + "Level : " + d.level + "<br/>" + d["stats.attackdamage"])
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px");
    })
  .on("mouseout", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
    });


    dot = svg.selectAll("dot")
  .data(statDict["Ahri"])
    .enter().append("circle")
  .attr("r", 5)
  .attr("cx", function(d) { return x(d.level) })
  .attr("cy", function(d) { return y(d["stats.attackdamage"]) })
  .attr("id", "dots")
  .on("mouseover", function(event,d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("Ahri <br/>" + "Level : " + d.level + "<br/>" + d["stats.attackdamage"])
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px");
    })
  .on("mouseout", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
    });
        

// Add the X Axis
let xAxis = svg.append("g")
        .attr("transform","translate(0,"+ height +")")
        .call(d3.axisBottom(x));
        
// Add the Y Axis
yAxis = svg.append("g").call(d3.axisLeft(y));


  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Value");

  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Level");

      /* svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(statDict["Garen"][statDict["Garen"].length-1]) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .style("fill", "red")
      .text("Open");

  svg.append("text")
      .attr("transform", "translate(" + (width+3) + "," + y(statDict["Ahri"][statDict["Ahri"].length-1]) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .style("fill", "steelblue")
      .text("Close"); */

    autocomplete(document.getElementById("myInput"), names);
    autocomplete(document.getElementById("myInput2"), names);
});


function showChampionStats(){
    let champName
    if (document.getElementById("myInput").value) {
        champName = document.getElementById("myInput").value
    } else {
        champName = lastSelectChamp1
    }
    
// if a non-empty string has been submitted

    lastSelectChamp1 = champName
    var existingResult = true

    let selectedChamp = getChampionStats(champName)
    console.log(selectedChamp.name)

    document.getElementById("ChampionSelected1").src = "ChampionIcons/" + selectedChamp.name + ".png"
    document.getElementById("champName1").innerHTML = selectedChamp.name

    const rbs = document.querySelectorAll('input[name="inlineRadioOptions"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }

    removeDots()

    y.domain([0, domains[selectedValue]]);

    yAxis.transition().duration(1000).call(d3.axisLeft(y))

    

    var valueline3 = d3
    .line()
    .x(function(d) {return x(d.level); })
    .y(function(d) {return y(d[selectedValue]); });

    svg.select("path#line1")
    .data([statDict[lastSelectChamp1]])
    .transition()
    .duration(1000)
    .attr("class","line")
    .attr("d", valueline3);

    svg.select("path#line2")
    .data([statDict[lastSelectChamp2]])
    .transition()
    .duration(1000)
    .attr("class","line")
    .attr("d", valueline3);

    createNewDots(lastSelectChamp1, lastSelectChamp2)
    // make the DIV where the search result appears visible
    //var x = document.getElementById("searchResult")
    //if (x.style.display === 'none') {
    //    x.style.display = 'block'
    //    existingResult = false
    //}
 

    
}

function removeDots(){
    svg.selectAll("circle")
            .remove()
}

function createNewDots(name, name2){

        const rbs = document.querySelectorAll('input[name="inlineRadioOptions"]');
        let selectedValue;
        for (const rb of rbs) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }

    
        
    circle = svg.selectAll("circle")
            .data(statDict[name])
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.level) })
            .attr("cy", function(d) { return y(d[selectedValue]) })
            .attr("id", "circles")
            .on("mouseover", function(event,d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(name + "<br/>" + "Level : " + d.level + "<br/>" + d[selectedValue])
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        circle.transition().duration(1000)

    dot = svg.selectAll("dot")
            .data(statDict[name2])
              .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x(d.level) })
            .attr("cy", function(d) { return y(d[selectedValue]) })
            .attr("id", "dots")
            .on("mouseover", function(event,d) {
              div.transition()
                .duration(200)
                .style("opacity", .9);
              div.html(name2 + "<br/>" + "Level : " + d.level + "<br/>" + d[selectedValue])
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
              })
            .on("mouseout", function(d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
              });

              dot.transition().duration(1000)
}

function radioAction(){
    removeDots()
    showChampionStats()
    showChampionStats2()
}

function showChampionStats2(){
    let champName
    if (document.getElementById("myInput2").value) {
        champName = document.getElementById("myInput2").value
    } else {
        champName = lastSelectChamp2
    }
    
    
    // if a non-empty string has been submitted

    lastSelectChamp2 = champName
    var existingResult = true

    let selectedChamp = getChampionStats(champName)
    console.log(selectedChamp.name)

    document.getElementById("ChampionSelected2").src = "ChampionIcons/" + selectedChamp.name + ".png"
    document.getElementById("champName2").innerHTML = selectedChamp.name

    const rbs = document.querySelectorAll('input[name="inlineRadioOptions"]');
    let selectedValue;
    for (const rb of rbs) {
        if (rb.checked) {
            selectedValue = rb.value;
            break;
        }
    }

    removeDots()

    var valueline3 = d3
    .line()
    .x(function(d) {return x(d.level); })
    .y(function(d) {return y(d[selectedValue]); });

    svg.select("path#line1")
    .data([statDict[lastSelectChamp1]])
    .transition()
    .duration(1000)
    .attr("class","line")
    .attr("d", valueline3);

    svg.select("path#line2")
    .data([statDict[lastSelectChamp2]])
    .transition()
    .duration(1000)
    .attr("class","line")
    .attr("d", valueline3);
    
    createNewDots(lastSelectChamp1, lastSelectChamp2)

    // make the DIV where the search result appears visible
    //var x = document.getElementById("searchResult")
    //if (x.style.display === 'none') {
    //    x.style.display = 'block'
    //    existingResult = false
    //}

    
}

function getChampionStats(champion) {
    for (var i=0; i < myData.length; i++) {
        if (myData[i].name === champion) {
            entry = myData[i]
            return entry;
        }
    }
}

function statPerLevel(data, myStat, statPerLevel, dict) {
    let statPerLevelValue = 0
    let statList = []

        for (var i=0; i < 18; i++) {
            let stat = new Object()
            statPerLevelValue = +data[myStat] + (i * +data[statPerLevel])
            armorPerLevelValue = +data["stats.armor"] + (i * +data["stats.armorperlevel"])
            healthPerLevelValue = +data["stats.hp"] + (i * +data["stats.hpperlevel"])
            stat[myStat] = statPerLevelValue.toFixed(2)
            stat["armor"] = armorPerLevelValue.toFixed(2)
            stat["health"] = healthPerLevelValue.toFixed(2)
            stat["level"] = i + 1
            //console.log(att)
            statList.push(stat)
            
        }
        //statList.push(att)
        dict[data.name] = statList 

  }







  

function autocomplete(input, array) {
    // Code taken from https://www.w3schools.com/howto/howto_js_autocomplete.asp

    /*the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    input.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "-autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < array.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (array[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + array[i].substr(0, val.length) + "</strong>";
                b.innerHTML += array[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + array[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    input.value = this.getElementsByTagName("input")[0].value;
                    /* simulate a click on the search button */
                    document.getElementById("searchButton").click();
                    /*close the list of autocompleted values, (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    input.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "-autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed, decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /* if active item in list of suggestions, simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            } else {
                // simulate a click on the search button
                document.getElementById("searchButton").click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
        /*scroll the list of suggestions into view */
        var elmnt = document.getElementsByClassName("autocomplete-active")[0]
        elmnt.scrollIntoView(false)
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document, except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}



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