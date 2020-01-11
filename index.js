var graph = {
  "nodes": [],
  "links": []
}
var nodeId = 1;
var svg = d3.select("svg"),
  width = +(document.getElementById('network').getBoundingClientRect().right - document.getElementById
    ('network').getBoundingClientRect().left),
  height = +(document.getElementById('network').getBoundingClientRect().bottom - document.getElementById
    ('network').getBoundingClientRect().top)

//Changes the force location when the window is resized.
window.addEventListener('resize', function () {
  width = +(document.getElementById('network').getBoundingClientRect().right - document.getElementById
    ('network').getBoundingClientRect().left)
  height = +(document.getElementById('network').getBoundingClientRect().bottom - document.getElementById
    ('network').getBoundingClientRect().top)
  simulation.force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1));
  simulation.alpha(0.3).restart();
})

//add click event listener
document.addEventListener('click', function () {
  var X = event.clientX,
    Y = event.clientY,
    leftNetwork = document.getElementById('network').getBoundingClientRect().left,
    rightNetwork = document.getElementById('network').getBoundingClientRect().right,
    topNetwork = document.getElementById('network').getBoundingClientRect().top,
    bottomNetwork = document.getElementById('network').getBoundingClientRect().bottom,
    mode = document.getElementById('mode').innerHTML;
  if (X > leftNetwork && X < rightNetwork && Y > topNetwork && Y < bottomNetwork && mode == "Add Nodes") {
    addNode();
  }


})
var color = d3.scaleOrdinal(d3.schemeCategory20);
var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function (d) { return d.id; }))
  .force("charge", d3.forceManyBody().strength(-60))
  .force('x', d3.forceX(width / 2).strength(0.1))
  .force('y', d3.forceY(height / 2).strength(0.1));
var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line")
  .attr("stroke-width", 3);
var node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(graph.nodes)
  .enter().append("circle")
  .attr("r", 8)
  .attr("fill", function (d) { return color(d.group); })
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));
node.append("title")
  .text(function (d) { return d.id; });
simulation
  .nodes(graph.nodes)
  .on("tick", ticked);
simulation.force("link")
  .links(graph.links);
updateData();

function ticked() {
  link
    .attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });
  node
    .attr("cx", function (d) {
      if (d.x < 8) {
        return 8;
      } else if (d.x > width - 8) {
        return width - 8;
      }
      return d.x;
    })
    .attr("cy", function (d) {
      if (d.y < 8) {
        return 8;
      } else if (d.y > height - 8) {
        return height - 8;
      }
      return d.y;

    });
}

function dragstarted(d) {
  if (document.getElementById('mode').innerHTML != "Add Links") {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  } else {
    graph.links.push({ source: d.id, target: graph.nodes[0].id });
    link = link.data(graph.links);
    link.exit().remove();
    link = link
      .enter().append("line")
      .attr("stroke-width", 3)
      .merge(link);
    simulation.force("link")
      .links(graph.links);
    simulation.alpha(1).restart();
  }
}
function dragged(d) {
  if (document.getElementById('mode').innerHTML != "Add Links") {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  } else {

  }
}
function dragended(d) {
  if (document.getElementById('mode').innerHTML != "Add Links") {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  } else {

  }
}

function addNode() {
  graph.nodes.push({ 'id': nodeId, 'group': nodeId });
  nodeId++;
  node = node.data(graph.nodes);
  node.exit().remove();
  node = node
    .enter().append("circle")
    .attr("r", 8)
    .attr("fill", function (d) { return color(d.group); })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
    .merge(node)
  node.append('title')
    .text(function (d) { return d.id; });
  simulation
    .nodes(graph.nodes)
  simulation.force("link")
    .links(graph.links);
  simulation.alpha(1).restart();
  updateData();
}

function changeMode(clicked) {
  document.getElementById('mode').innerHTML = clicked.innerHTML;
  if (clicked.innerHTML == "Add Links") {
    simulation.stop();
  } else {
    simulation.alpha(1).restart();
  }
}

function changeAlgorithm(clicked) {
  document.getElementById('algorithm').innerHTML = clicked.innerHTML;
}

function changeSpeed(clicked) {
  document.getElementById('speed').innerHTML = clicked.innerHTML;
}

function updateData() {
  document.getElementById('num-nodes').innerHTML = "Number of Nodes: " + graph.nodes.length;
  var links = []
  for (a = 0; a < graph.links.length; a++) {
    var link = [];
    link.push(graph.links[a].source.id);
    link.push(graph.links[a].target.id);
    links.push(link);
  }
  document.getElementById('link-list').innerHTML = JSON.stringify(links);
}

function clearData() {
  graph.nodes = [];
  node = node.data(graph.nodes);
  node.exit().remove();
  graph.links = [];
  link = link.data(graph.links);
  link.exit().remove();
  updateData();
}