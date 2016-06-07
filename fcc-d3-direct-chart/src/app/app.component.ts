import { Component, ElementRef, Renderer, Inject } from 'angular2/core';
import { Http, Response, HTTP_PROVIDERS } from 'angular2/http';
import { miserables } from './miserables'
import 'rxjs/add/operator/map' //add for http.get.map
declare var d3:any;
@Component({
    selector: 'my-app',
    template: `
    <div class="graph">
      <h1>Force Layout</h1>
      <h3></h3>
      <svg class="chart"></svg>
    </div>
    `,
    styleUrls: ['app/app.component.css'],
    providers: [
      HTTP_PROVIDERS
    ]
})
export class AppComponent {
  constructor(
    @Inject(Http) private http:Http
  ) {

    
  }
  ngOnInit() {
    function getHostName(url) {
      var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
      if (match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
      } else {
        return null;
      }
    }
    this.http.get('https://www.freecodecamp.com/news/hot')
                    .map((res:Response) => res.json())
                    .subscribe((allData:any) => {
                      let links = allData.map(d => {
                        return {
                          source: d.author.username,
                          target: getHostName(d.link),
                          image: d.author.picture,
                          rank: d.rank
                        }
                      })
                      let nodes={}
                        // Compute the distinct nodes from the links.
                      links.forEach(function(link) {
                        link.source = nodes[link.source] || (nodes[link.source] = {
                          name: link.source,
                          image: link.image
                        });
                        link.target = nodes[link.target] || (nodes[link.target] = {
                          name: link.target,
                          rank: []
                        });
                      });

                      links.forEach(function(link, i) {
                        nodes[link.target.name].rank.push(link.rank);
                      });
                      console.log(nodes)
                      console.log(links)
                      var canvasColor = '#457E86';
                      // colour of the graph background
                      var canvasColor = '#457E86';
                      var linkColor = '#A3C4C9';

                                        // canvas dimensions
                      var width = 850,
                        height = 850;


                      //Set up the colour scale
                      var color = d3.scale.quantize()
                        .domain([1, 50])
                        .range(["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"]);


                      var force = d3.layout.force()
                        .nodes(d3.values(nodes))
                        .links(links)
                        .size([width, height])
                        .gravity(0.1)
                        .linkDistance(62)
                        .charge(function(d) {
                          return -((d.weight * 3) + 150);
                        })
                        .on("tick", tick)
                        .start();


                      var svg = d3.select(".chart")
                        .attr("width", width)
                        .attr("height", height)
                        .style("background-color", canvasColor);

                      var link = svg.selectAll(".link")
                        .data(force.links())
                        .enter().append("line")
                        .attr("class", "link")
                        .style("stroke-width", 1)
                        .style("stroke", linkColor);

                      let tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.name; });
                      
                      var node = svg.selectAll(".node")
                        .data(force.nodes())
                        .enter().append("g")
                        .attr("class", "node")
                        .call(force.drag)
                        .call(tip)
                        .on("mouseover", tip.show)
                        .on("mouseout", tip.hide);

                      node.append("circle")
                        .attr("r", function(d) {
                          return ((d.weight * 1.6) + 5);
                        })
                        .style("fill", function(d) {
                          if (d.rank !== undefined) {
                            return color(d3.max(d.rank));  // upvotes; sum = aggregate, mean = mean, min = min, max = max, median = median
                          } else {
                            return d3.rgb("#104B53");
                          }
                        });

                      node.append("image")
                        .attr("xlink:href", function(d) {
                          return d.image;
                        })
                        .attr("x", -16)
                        .attr("y", -16)
                        .attr("width", 32)
                        .attr("height", 32);
                        
                      function tick() {
                        link
                          .attr("x1", function(d) {
                            return d.source.x;
                          })
                          .attr("y1", function(d) {
                            return d.source.y;
                          })
                          .attr("x2", function(d) {
                            return d.target.x;
                          })
                          .attr("y2", function(d) {
                            return d.target.y;
                          });

                        node
                          .attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                          });
                                        });
  }
}
