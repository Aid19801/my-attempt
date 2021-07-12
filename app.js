var height = 500;
var width = 600;
var padding = 30;

function createXScale(myData, value, dims) {
  const { width, padding } = dims;
  const min = d3.min(myData, (d) => d[value]) * 0.6;
  const max = d3.max(myData, (d) => d[value]) * 1.1;

  let xScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([padding, width - padding]);
  return xScale;
}
function createYScale(myData, value, dims) {
  const { height, padding } = dims;
  const min = d3.min(myData, (d) => d[value]) * 0.8;
  const max = d3.max(myData, (d) => d[value]) * 1.1;
  console.log("THE MAX IS ", max);
  let yScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([height - padding, padding]);
  return yScale;
}
function createRadiusScale(myData, value, dims) {
  let min = d3.min(myData, (d) => d[value]);
  let max = d3.max(myData, (d) => d[value]);
  let rScale = d3.scaleLinear().domain([min, max]).range([0, 20]);
  return rScale;
}
function createColorScale(myData, value) {
  let cScale = d3
    .scaleLinear()
    .domain(d3.extent(myData, (d) => d[value]))
    .range(["red", "green"]);
  return cScale;
}
function createXAxis(myData, value, dims) {
  const { height, padding } = dims;
  let xScale = createXScale(myData, value, dims);
  var xAxis = d3.axisBottom(xScale);

  d3.select("svg")
    .append("g")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);
}
function createYAxis(myData, value, dims) {
  const { padding } = dims;
  var yScale = createYScale(myData, value, dims);

  var yAxis = d3.axisLeft(yScale);

  d3.select("svg")
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);
}
function generateTitle() {
  d3.select("svg").append("text").attr("x");
}

d3.queue()
  .defer(d3.json, "http://localhost:3000/data")
  .defer(d3.json, "http://localhost:3001/data")
  .await((err, res1, res2) => {
    if (err) return console.log("err", err);

    // combine/clean datasets
    var updatedData = res1.map((each) => {
      each.fullName = res2.filter(
        (accDetail) => accDetail.accNumber === each.accNumber
      )[0].accName;
      return each;
    });

    // draw axes
    createXAxis(updatedData, "savings", { height, width, padding });
    let xScale = createXScale(updatedData, "savings", {
      height,
      width,
      padding,
    });

    createYAxis(updatedData, "age", { height, width, padding });
    let yScale = createYScale(updatedData, "age", {
      height,
      width,
      padding,
    });

    let radiusScale = createRadiusScale(updatedData, "balance", {
      height,
      width,
      padding,
    });

    let colorScale = createColorScale(updatedData, "homeOwner");
    // draw main canvas
    d3.select("svg").attr("height", height).attr("width", width);

    // plot the circles
    d3.select("svg")
      .selectAll("circle")
      .data(updatedData)
      .enter()
      .append("circle")
      .attr("cy", (d) => height - padding)
      .attr("cx", (d) => width / 2)
      .transition("ease")
      .duration(500)
      .delay((d, i) => i * 20)
      .attr("cx", (d) => xScale(d.savings))
      .attr("cy", (d) => yScale(d.age))
      .attr("r", (d) => radiusScale(d.balance))
      .attr("stroke", "#fff")
      .attr("fill", (d) => colorScale(d.homeOwner));
  });
