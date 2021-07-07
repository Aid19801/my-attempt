var height = 500;
var width = 600;
var padding = 50;

// pull in the data
d3.queue()
  .defer(d3.json, "http://localhost:3000/data")
  .defer(d3.json, "http://localhost:3001/data")
  .await((err, balances, accDetails) => {
    if (err) throw err;

    // 1. MANIPULATE / CLEAN THE DATA
    var updatedData = balances.map((balanceObject) => {
      balanceObject.accountName = accDetails.filter(
        (each) => each.accNumber === balanceObject.accNumber
      )[0].accName;
      return balanceObject;
    });
    console.log("Data: ", updatedData);

    // 2. CREATE SCALES AND AXIS
    var yScale = d3
      .scaleLinear()
      .domain(d3.extent(updatedData, (d) => d.balance)) // Y = balance
      .range([height - padding, 0]);
    // Vertical is their current account balance
    var yAxis = d3
      .axisLeft(yScale)
      .tickSize(-width + 2 * padding)
      .tickSizeOuter(0);

    var xScale = d3
      .scaleLinear()
      .domain(d3.extent(updatedData, (d) => d.age)) // X = age
      .range([padding, width - padding]);
    // Horizontal is their age
    var xAxis = d3.axisBottom(xScale).tickSize(-height + 2 * padding);

    var rScale = d3
      .scaleLinear()
      .domain(d3.extent(updatedData, (d) => d.savings)) // RADIUS = savings/$
      .range([5, 25]);

    var colorScale = d3
      .scaleLinear()
      .domain(d3.extent(updatedData, (d) => d.homeOwner)) // COLOR = homeowner?
      .range(["red", "green"]);

    d3.select("svg")
      .append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    d3.select("svg")
      .append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    // Y AXIS TITLE
    d3.select("svg")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 30)
      .attr("dy", "-1.1em")
      .style("text-anchor", "middle")
      .text("balance/$");

    // X AXIS TITLE
    d3.select("svg")
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - padding)
      .attr("dy", "1.5em")
      .style("text-anchor", "middle")
      .text("Age of Account Holder");

    d3.select("svg")
      .attr("height", height)
      .attr("width", width)
      .selectAll("circle")
      .data(updatedData)
      .enter()
      .append("circle")
      .transition()
      .delay(100)
      .attr("r", (d) => rScale(d.savings))
      .attr("fill", (d) => colorScale(d.homeOwner))
      .attr("cx", (d) => xScale(d.age))
      .attr("cy", (d) => yScale(d.balance))
      .attr("stroke", "#fff");
  });

// hook onto SVG

// draw elements

// update elements
