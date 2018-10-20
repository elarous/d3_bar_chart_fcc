document.addEventListener("DOMContentLoaded",() => {
  let req = new XMLHttpRequest();
  req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",true);
  req.setRequestHeader("Content-Type","text/plain");
  req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status == 200){
      const json = JSON.parse(req.responseText);
      makeChart(json.data);
    }
  };
  req.send();
});


function makeChart(dataset){
  const h = 400;
  const w = 800;
  const padding = 50;
  const barWidth = w/dataset.length;

  const xScale = d3.scaleLinear()
                   .domain([d3.min(dataset, (d) => new Date(d[0]).getTime()),
                            d3.max(dataset, (d) => new Date(d[0]).getTime())])
                   .range([padding,w - padding]);

  const yScale = d3.scaleLinear()
                   .domain([0,
                            d3.max(dataset, (d) => d[1])])
                   .range([0,h - padding]);

  const xAxisScale = d3.scaleTime()
                       .domain([d3.min(dataset, (d) => new Date(d[0]).getTime()),
                                d3.max(dataset, (d) => new Date(d[0]).getTime())])
                       .range([padding, w - padding]);

  const yAxisScale = d3.scaleLinear()
                      .domain([0,
                               d3.max(dataset, (d) => d[1])])
                      .range([h - padding, 0]);
  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  let svg = d3.select("#container")
              .append("svg")
              .attr("height",h)
              .attr("width",w);

  let tooltip = d3.select("#container")
                  .append("div")
                  .attr("id","tooltip");


  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("class","bar")
     .attr("data-date",(d) => d[0])
     .attr("data-gdp",(d) => d[1])
     .attr("height",(d) => yScale(d[1]))
     .attr("width", barWidth)
     .attr("x", (d,i) => xScale(new Date(d[0]).getTime()))
     .attr("y",(d) => h - padding - yScale(d[1]))
     .on("mouseover",(d) => {
       tooltip.transition()
              .duration(200)
              .style("opacity","1")
              .style("left", xScale(new Date(d[0]).getTime()) + 20 +"px")
              .style("top", h / 2  + "px");
       tooltip.attr("data-date",d[0]);
     })
     .on("mouseout",(d) => {
       tooltip.transition()
              .duration(200)
              .style("opacity","0");
       tooltip.html('<div class="year">'+new Date(d[0]).getFullYear()+'</div>'+
                    '<div class="gdp">$'+d[1].toFixed(2)+' Billion</div>');
     });

  svg.append("g")
     .attr("id","x-axis")
     .attr("transform","translate(0," + (h - padding)+ ")")
     .call(xAxis);

  svg.append("g")
     .attr("id","y-axis")
     .attr("transform","translate("+padding+",0)")
     .call(yAxis);

  svg.append("text")
     .attr("id","y-axis-lbl")
     .attr("x", -250)
     .attr("y",70)
     .attr("transform","rotate(-90)")
     .text("Gross Domestic Product");
}
