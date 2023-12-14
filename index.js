const dataURL =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Fetch data and render heatmap
d3.json(dataURL).then((data) => {
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = 1350 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;
    const inner = height - 200
    const svg = d3
        .select("#heatmap")
        .attr("width", width + 300)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .on("mousemove", function (event) { return tooltip.style("top", (event.pageY) + "px").style("left", (event.pageX) + "px"); })


    svg.append("text")
        .attr("id", "title")
        .text("Global Temperature Heatmap")
        .attr("x", width / 3)
        .attr('y', -20)
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .style("font-family", "Jura");
    svg.append("text")
        .attr("id", "description")
        .text("Global Temperature Heatmap from 1753 to 2015")
        .attr("x", width / 2.7)
        .attr('y', 15)
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .style("font-family", "Jura");
    // Data preprocessing
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    data.monthlyVariance.forEach((d) => {
        d.month -= 1; // Adjusting month index to start from 0
    });

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data.monthlyVariance, (d) => d.year))
        .range([0, width]);

    const yScale = d3.scaleBand().domain(months).range([20, inner]);

    const colorScale = d3
        .scaleSequential(d3.interpolateRdYlBu)
        .domain(d3.extent(data.monthlyVariance, (d) => d.variance));

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg
        .append("g")
        .attr('id', "x-axis")
        .attr("transform", `translate(0,${inner})`)
        .call(xAxis);

    const tooltip = d3.select('.tool')
        .append('div')
        .style("opacity", 0)
        .attr('id', "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style('position', 'absolute')

    const mouseover = function (d) {
        tooltip.style("opacity", 1)
        rect.classed("bordered", true)
    }
    const mousemove = function (d) {
        tooltip
            .attr('data-month', (d3.select(this).attr('data-month')))
            .attr('data-year', (d3.select(this).attr('data-year')))
            .attr('data-temp', (d3.select(this).attr('data-temp')))
            .data(data.monthlyVariance)
            .text(`Month:${(d3.select(this).attr('data-month'))}
            Year:${(d3.select(this).attr('data-year'))}
            Temp:${(d3.select(this).attr('data-temp'))}
           
        `)
    }
    var mouseleave = function (d) {
        tooltip.style("opacity", 0)

    }
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr('id', 'y-axis')
        .call(yAxis);



    const rect = svg
        .selectAll("rect")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr('data-month', (d) => d.month)
        .attr('data-year', (d) => d.year)
        .attr('data-temp', (d) => d.month + data.baseTemperature)
        .classed('cell', true)
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(months[d.month]))
        .attr(
            "width",
            width /
            (d3.max(data.monthlyVariance, (d) => d.year) -
                d3.min(data.monthlyVariance, (d) => d.year))
        )
        .attr("height", yScale.bandwidth())
        .style("fill", (d) => colorScale(d.variance))
        .on('mouseover', mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // Define an array of colors
    const colors = ['#2c7bb6', '#00ccbc', '#f29e2e', '#d7191c'];


    // Create a legend group
    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate(20, 420)'); // Adjust the position as needed

    // Create rectangles with different fill colors in the legend
    const rectSize = 18; // Size of each rectangle
    const rectSpacing = 5; // Spacing between rectangles

    legend.selectAll('rect')
        .data(colors)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i * (rectSize + rectSpacing))
        .attr('width', rectSize)
        .attr('height', rectSize)
        .attr('fill', d => d);


    var coloursRainbow = ["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"];
    var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
    colourRangeRainbow.push(1);

    //Create color gradient
    var colorScaleRainbow = d3.scaleLinear()
        .domain(colourRangeRainbow)
        .range(coloursRainbow)
        .interpolate(d3.interpolateHcl);

    //Needed to map the values of the dataset to the color scale
    var colorInterpolateRainbow = d3.scaleLinear()
        .domain(d3.extent(data.monthlyVariance))
        .range([0, 20]);

    var defs = svg.append("defs");
    defs.append("linearGradient")
        .attr("id", "gradient-rainbow-colors")
        .attr("x1", "50%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .attr('x3', '150%').attr('y3', '0%')
        .selectAll("stop")
        .data(coloursRainbow)
        .enter().append("stop")
        .attr("offset", function (d, i) { return i / (coloursRainbow.length - 1); })
        .attr("stop-color", function (d) { return d; });

    var legendWidth = width * 1,
        legendHeight = 20;


    var legendsvg = svg.append("svg")
        .attr("id", "legend")
        .attr("transform", "translate(" + (width / 2 - 10) + "," + (height + 50) + ")");
    legendsvg.append("rect")
        .attr("class", "legendRect")
        .attr("x", -legendWidth / 2)
        .attr("y", height)
        .attr("rx", legendHeight / 2)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", 'red');


    legendsvg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 200)
        .attr("y", height - 10)
        .text("Temperature Variance");

    //Set scale for x-axis
    var xScaleLeg = d3.scaleLinear()
        .range([0, legendWidth])
        .domain([-1.0, 1.0]);
    //Define x-axis
    const xAxisLeg = d3.axisBottom(xScaleLeg)
        .ticks(10) // Set rough # of ticks

    legendsvg.append("g")
        .attr("class", "axis")  //Assign "axis" class
        .attr("transform", "translate(" + (-legendWidth / 2) + "," + (height + legendHeight) + ")")
        .call(xAxisLeg);


    function updateYGB() {
        //Fill the legend rectangle
        svg.select(".legendRect")
            .style("fill", "url(#gradient-ygb-colors)");
        //Transition the hexagon colors
        svg.selectAll(".hexagon")
            .transition().duration(1000)
            .style("fill", function (d, i) { return colorScaleYGB(colorInterpolateYGB(somData[i])); });
    }//updateYGB

    function updateRainbow() {
        //Fill the legend rectangle
        svg.select(".legendRect")
            .style("fill", "url(#gradient-rainbow-colors)");
        //Transition the hexagon colors
        svg.selectAll(".hexagon")
            .transition().duration(1000)
            .style("fill", function (d, i) { return colorScaleRainbow(colorInterpolateRainbow(somData[i])); })
    }//updateRainbow

    updateRainbow()

});