
let myData
let names = []
let statDict = {}
let levels = new Array(19).keys()
let lastSelectChamp1 = "Garen"
let lastSelectChamp2 = "Ahri"
let domains = {"Attack Damage": 150, "Armor": 120, "Magic Resist": 60, "Health": 2200, "Mana": 1200, "HP Regen": 24, "MP Regen": 60}
let statName = Object.keys(domains)
let yAxis
let circle
let dot
let selectedValue
let sizeX
let sizeY
let marginLeft
let marginRight
let namePosH
let namePosW
let chartSvg
let chartX
let chartY

// set different sizes and position depending on screen size (computer or mobile)
if (window.screen.width > 768) {
    sizeY = window.screen.height/2;
    sizeX = window.screen.width/2;
    marginLeft = 60
    namePosH = 0
    namePosW = 20
    marginRight = 77

} else {
    sizeY = window.screen.height/2
    sizeX = window.screen.width
    marginLeft = 35
    namePosH = 60
    namePosW = 70
    marginRight = 50
}

// set the dimensions and margins of the graph
var margin = {top:20, right:marginRight, bottom:30, left:marginLeft},
    width = sizeX - margin.left - margin.right, height = sizeY - margin.top - margin.bottom;

function createBarChart() {
    var margin = {top:30, right:10, bottom:10, left:marginLeft + 30},
    width = sizeX - 25 - margin.left - margin.right, height = sizeY - margin.top - margin.bottom;
    // append the svg object to the body of the page
    chartSvg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    chartSvg.append("g")

    const subgroups = ["champ1", "champ2"]
// List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = statName
console.log(groups)

    // Add X axis
    chartX = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
    chartSvg.append("g")
    .call(d3.axisTop(chartX));

    // Add Y axis
    chartY = d3.scaleBand()
    .domain(groups)
    .range([0, height])
    .padding([0.2])
    leftAxis = chartSvg.append("g")
    .call(d3.axisLeft(chartY))

    if (window.screen.width < 768) {
        leftAxis.selectAll("text").attr("transform", "rotate(45)");
    }
    

    // add the X gridlines
    chartSvg.append("g")
    .attr("class", "grid")
    .call(d3.axisTop(chartX).ticks(10)
        .tickSize(-height)
        .tickFormat("")
    )

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['var(--bs-cyan)','var(--bs-orange)'])
    
    // Normalize the data -> sum of each group must be 100!
    getChampionStats(lastSelectChamp1)
    getChampionStats(lastSelectChamp2)
    // Normalize the data -> sum of each group must be 100!
    let champ1 = statDict[lastSelectChamp1]

    //console.log("champ1 ", champ1)
    let champ2 = statDict[lastSelectChamp2]
    let barData = []

    for (var i=0; i < 6; i++) {
        let barDataDict = {}
        let tot = parseInt(champ1[0][statName[i]]) + parseInt(champ2[0][statName[i]])
        console.log("tot", tot)
        let champ1perc = parseInt(champ1[0][statName[i]])/parseInt(tot) * 100
        let champ2perc = parseInt(champ2[0][statName[i]])/parseInt(tot) * 100
        barDataDict["group"] = statName[i]
        barDataDict["champ1"] = champ1perc
        barDataDict["champ2"] = champ2perc
        barData.push(barDataDict)

    }
    //console.log(barData)
    
    
    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
    .keys(subgroups)
    (barData)

    createBars()
    
}

checkRadioValue()

// set the ranges
let x = d3.scaleLinear().range([0,width - 30]);
let y = d3.scaleLinear().range([height,0]);

 // Set the domain of the data
 x.domain([0, 18]);
 // adapts the domain to the selected stat
 y.domain([0, domains[selectedValue]]);

// define the line
var valueline = d3
    .line()
    .x(function(d) {return x(d.level); })
    .y(function(d) {return y(d[selectedValue]); });

var valueline2 = d3
    .line()
    .x(function(d) {return x(d.level); })
    .y(function(d) {return y(d[selectedValue]); });

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
let svg = d3
    .select("body")
    .append("div").attr("class", "column").attr("id", "graph")
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
        
    });
    console.log(statDict)

    // creates a list of the champion names
    names = data.map(function(d) {return d.name; })

    // Add the X Axis
let xAxis = svg.append("g")
.attr("transform","translate(0,"+ height +")")
.call(d3.axisBottom(x).ticks(18));

// Add the Y Axis
yAxis = svg.append("g").call(d3.axisLeft(y));

svg.append("g")
.attr("class", "grid")
.call(d3.axisLeft(y).ticks(12)
  .tickSize(-width)
  .tickFormat("")
)

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
        .attr("cy", function(d) { return y(d[selectedValue]) })
        .attr("id", "circles")
        .on("mouseover", function(event,d) {
            div.transition()
            .duration(200)
            .style("opacity", .9);
            div.html("Garen <br/>" + "Level : " + d.level + "<br/>" + d[selectedValue])
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
        .attr("cy", function(d) { return y(d[selectedValue]) })
        .attr("id", "dots")
        .on("mouseover", function(event,d) {
            div.transition()
            .duration(200)
            .style("opacity", .9);
            div.html("Ahri <br/>" + "Level : " + d.level + "<br/>" + d[selectedValue])
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
            .duration(500)
            .style("opacity", 0);
        });
        



//calculate name label's Y position
let calcPosY = y(statDict["Ahri"][17][selectedValue])+ namePosH

svg.append("text")
		.attr("transform", "translate(" + (width-namePosW) + "," + calcPosY + ")")
		.attr("dy", ".35em")
        .attr("id", "name1")
		.attr("text-anchor", "start")
		.style("fill", "var(--bs-orange)")
		.text("Ahri");

let calcPosY2 = y(statDict["Garen"][17][selectedValue]) + namePosH

svg.append("text")
    .attr("transform", "translate(" + (width-namePosW) + "," + calcPosY2 + ")")
    .attr("dy", ".35em")
    .attr("id", "name2")
    .attr("text-anchor", "start")
    .style("fill", "var(--bs-cyan)")
    .text("Garen");

// Add texts only on computer
if (window.screen.width > 768) {
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");
}

svg.append("text")             
    .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Level");


autocomplete(document.getElementById("myInput"), names);
autocomplete(document.getElementById("myInput2"), names);
createBarChart()
});

// Create a new line with the selected champion 1
function showChampionStats(){
    let champName
    if (document.getElementById("myInput").value) {
        if (names.includes(document.getElementById("myInput").value)) {
            champName = document.getElementById("myInput").value
        } else {
            alert("This champion does not exist.")
            champName = lastSelectChamp1
        
        }

        
    } else {
        champName = lastSelectChamp1
    }
    
    lastSelectChamp1 = champName

    let selectedChamp = getChampionStats(champName)

    // change img and text
    document.getElementById("ChampionSelected1").src = "../ChampionIcons/" + selectedChamp.name + ".png"
    document.getElementById("champName1").innerHTML = selectedChamp.name

    checkRadioValue()

    removeDots()

    // Change y domain
    y.domain([0, domains[selectedValue]]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y))

    
    // change the lines
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

    // calculate name label's Y position
    let calcPosY = y(statDict[lastSelectChamp2][17][selectedValue]) + namePosH
    let calcPosY2 = y(statDict[champName][17][selectedValue]) + namePosH

    if (window.screen.width < 768 && calcPosY < calcPosY2) {
        calcPosY -= 70
    } 
    else if (window.screen.width < 768 && calcPosY > calcPosY2) {
        calcPosY2 -= 70
    }

    svg.select("text#name1")
		.attr("transform", "translate(" + (width-namePosW) + "," + calcPosY + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "var(--bs-orange)")
		.text(lastSelectChamp2);


	svg.select("text#name2")
		.attr("transform", "translate(" + (width-namePosW) + "," + calcPosY2 + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "var(--bs-cyan)")
		.text(champName);

    createNewDots(lastSelectChamp1, lastSelectChamp2)
    createBars()
}

function showChampionStats2(){
    let champName
    if (document.getElementById("myInput2").value) {
        if (names.includes(document.getElementById("myInput2").value)) {
            champName = document.getElementById("myInput2").value
        } else {
            alert("This champion does not exist.")
            champName = lastSelectChamp2
        }
   
    } else {
        champName = lastSelectChamp2
    }

    lastSelectChamp2 = champName

    let selectedChamp = getChampionStats(champName)

    document.getElementById("ChampionSelected2").src = "../ChampionIcons/" + selectedChamp.name + ".png"
    document.getElementById("champName2").innerHTML = selectedChamp.name

    checkRadioValue()

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

    let calcPosY = y(statDict[champName][17][selectedValue]) + namePosH
    let calcPosY2 = y(statDict[lastSelectChamp1][17][selectedValue]) + namePosH

    if (window.screen.width < 768 && calcPosY < calcPosY2) {
        calcPosY -= 70
    } else if (calcPosY > calcPosY2 && window.screen.width < 768) {
        calcPosY2 -= 70
    }

    svg.select("text#name1")
		.attr("transform", "translate(" + (width-namePosW) + "," + calcPosY + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "var(--bs-orange)")
		.text(champName);

        

	svg.select("text#name2")
		.attr("transform", "translate(" + (width-namePosW) + "," + calcPosY2 + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "start")
		.style("fill", "var(--bs-cyan)")
		.text(lastSelectChamp1);
    
    createNewDots(lastSelectChamp1, lastSelectChamp2)
    createBars()
}


function removeDots(){
    svg.selectAll("circle")
            .remove()
}

function createNewDots(name, name2){

        checkRadioValue()

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


function createBars() {
    //TODO
    //getLevel()
    getChampionStats(lastSelectChamp1)
    getChampionStats(lastSelectChamp2)
    // Normalize the data -> sum of each group must be 100!
    let champ1 = statDict[lastSelectChamp1]

    console.log("champ1 ", champ1)
    let champ2 = statDict[lastSelectChamp2]
    let barData = []

    for (var i=0; i < statName.length; i++) {
        let barDataDict = {}
        let tot = parseInt(champ1[0][statName[i]]) + parseInt(champ2[0][statName[i]])
        console.log("tot", tot)
        let champ1perc = parseInt(champ1[0][statName[i]])/parseInt(tot) * 100
        let champ2perc = parseInt(champ2[0][statName[i]])/parseInt(tot) * 100
        barDataDict["group"] = statName[i]
        barDataDict["champ1"] = champ1perc
        barDataDict["champ2"] = champ2perc
        barData.push(barDataDict)

    }

// Adapted code from https://www.d3-graph-gallery.com/graph/barplot_stacked_percent.html
// List of subgroups = header of the csv files = soil condition here
const subgroups = ["champ1", "champ2"]
// List of groups = species here = value of the first column called group -> I show them on the X axis
const groups = statName
console.log(groups)

// Normalize the data -> sum of each group must be 100!
console.log(barData)
const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['var(--bs-cyan)','var(--bs-orange)'])

//stack the data? --> stack per subgroup
const stackedData = d3.stack()
.keys(subgroups)
(barData)
//console.log("stacked data",stackedData)

// Show the bars
chartSvg.select("g")
.selectAll("g")
// Enter in the stack data = loop key per key = group per group
.data(stackedData)
.join("g")
  .attr("fill", d => color(d.key))
  .selectAll("rect")
  // enter a second time = loop subgroup per subgroup to add all rectangles
  .data(d => d)
  .join("rect")
  .transition().duration(1000)
  .attr("class", "bar")
    .attr("y", d => chartY(d.data.group))
    .attr("x", d => chartX(d[0]))
    .attr("width", d => chartX(d[1]) - chartX(d[0]))
    .attr("height",chartY.bandwidth())
}



function radioAction(){
    removeDots()
    showChampionStats()
    showChampionStats2()
}

function checkRadioValue(){
    const rbs = document.querySelectorAll('input[name="inlineRadioOptions"]');
        for (const rb of rbs) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }
}

function getChampionStats(champion) {
    for (var i=0; i < myData.length; i++) {
        if (myData[i].name === champion) {
            entry = myData[i]
            return entry;
        }
    }
}

// calculate stats per level
function statPerLevel(data, myStat, statPerLevel, dict) {
    let statPerLevelValue = 0
    let statList = []

        for (var i=0; i < 18; i++) {
            let stat = new Object()
            statPerLevelValue = +data[myStat] + (i * +data[statPerLevel])
            armorPerLevel = +data["stats.armor"] + (i * +data["stats.armorperlevel"])
            healthPerLevel = +data["stats.hp"] + (i * +data["stats.hpperlevel"])
            manaPerLevel = +data["stats.mp"] + (i * +data["stats.mpperlevel"])
            magicResistPerLevel = +data["stats.spellblock"] + (i * +data["stats.spellblockperlevel"])
            hpRegenPerLevel = +data["stats.hpregen"] + (i * +data["stats.hpregenperlevel"])
            mpRegenPerLevel = +data["stats.mpregen"] + (i * +data["stats.mpregenperlevel"])
            critPerLevel = +data["stats.crit"] + (i * +data["stats.critperlevel"])
            attackSpeedPerLevel = +data["stats.attackspeed"] + (i * +data["stats.attackspeedperlevel"])
            stat["Attack Damage"] = statPerLevelValue.toFixed(2)
            stat["Health"] = healthPerLevel.toFixed(2)
            stat["Mana"] = manaPerLevel.toFixed(2)
            stat["Armor"] = armorPerLevel.toFixed(2)
            stat["Magic Resist"] = magicResistPerLevel.toFixed(2)
            stat["HP Regen"] = hpRegenPerLevel.toFixed(2)
            stat["MP Regen"] = mpRegenPerLevel.toFixed(2)
            // TODO % per level
            //stat["Attack Speed"] = attackSpeedPerLevel.toFixed(2)
            stat["level"] = i + 1

            statList.push(stat)
            
        }
        dict[data.name] = statList 

  }
  
// Search champion per name
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
                document.getElementById("searchButton2").click();
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
