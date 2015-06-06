// Create the Google Map…
var map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 14,
  center: new google.maps.LatLng(53.3198638, -6.2578955),
  mapTypeId: google.maps.MapTypeId.TERRAIN
});

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return  "<div><strong>Address: </strong> " + d.value.address + "</div> " + 
    "<div><strong>Price: </strong> " + d.value.current_price + "</div> " + 
     "<div><strong>Beds: </strong> " +d.value.bedrooms + "</div> " +
     "<div><strong>Baths: </strong> " +d.value.bathrooms + "</div> "
  })
  var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

d3.json('properties', function(data) {
  var overlay = new google.maps.OverlayView();

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function() {
    var layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
      .attr("class", "gaffs");

    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function() {
      var projection = this.getProjection(),
        padding = 10;

      var marker = layer.selectAll("svg")
        .data(d3.entries(data))
        .each(transform) // update existing markers
        .enter().append("svg:svg")
        .each(transform)
        .attr("class", "marker");

      marker.call(tip);
      // marker.call(tip);
      // Add a circle.
      marker.append("svg:circle")
        .attr("r", function(d){ console.log(d); return d.key;})
        .attr("cx", padding)
        .attr("cy", padding)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


      // Add a label.
      marker.append("svg:text")
        .attr("x", padding + 7)
        .attr("y", padding)
        .attr("dy", ".31em")
        .text(function(d) {
          return d.value.current_price;
        })



      function transform(d) {
        d = d.value;
        d = new google.maps.LatLng(d.lat, d.long);
        d = projection.fromLatLngToDivPixel(d);
        return d3.select(this)
          .style("left", (d.x - padding) + "px")
          .style("top", (d.y - padding) + "px");
      }
    };
  };

  overlay.setMap(map);
});