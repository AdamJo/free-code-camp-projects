import { Component, ElementRef, Renderer, Inject } from 'angular2/core';
import { Http, Response, HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/add/operator/map' //add for http.get.map
declare var d3:any;
@Component({
    selector: 'my-app',
    template: `
    <div class="graph">
      <h1>Monthly Global Land-Surface Temperature</h1>
      <h3>D3 HeatMap</h3>
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
  ) {}
  ngOnInit() {
    this.http.get('http://www.freecodecamp.com/news/hot')
                    .map((res:Response) => res.json())
                    .subscribe((allData:any) => {
                      let margin = {top: 20, right: 45, bottom: 60, left: 60};
                      //let width = 1050 - margin.left - margin.right;
                      let width = 1120 - margin.left - margin.right;
                      let height = 680 - margin.top - margin.bottom;
                      let gridSize = Math.floor(width / 24);
                      let legendElementWidth = gridSize*2;
                      let colors:Array<string> = ["#333399","#000099","#0066ff","#66ccff","#ffffcc","#ffff99","#ffcc66","#ffcc00","#ff9900", "#cc6600", "#cc3300", "#800000"];
                      let buckets = colors.length;
                      
                      let months:Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                      let baseTemp:number = allData.baseTemperature;
                      let monthlyVariance:any = allData.monthlyVariance;

                      let svg = 
                        d3.select('.chart')
                          .attr("width", width + margin.left + margin.right + 80)
                          .attr("height", height + margin.top + margin.bottom)
                          .append("g")
                          .attr("transform", "translate(" + (margin.left + 40) + "," + margin.top + ")");
                                  
                      let maxYear = monthlyVariance.length - 1
                                  
                      let x = 
                        d3.time.scale()
                          .domain([new Date(monthlyVariance[0].year, 0), new Date(monthlyVariance[maxYear].year, 0)])
                          .range([0, width + 20]);
                                            
                      let xAxis = 
                        d3.svg.axis()
                          .scale(x)
                          .orient("bottom")
                          .ticks(d3.time.years, 10);
                        
                        svg.append("g")
                          .attr("class", "x axis year")
                          .attr("transform", "translate(0,510)")
                          .call(xAxis);
                        
                      let monthLabels = 
                        svg.selectAll(".monthLabels")
                          .data(months)
                          .enter().append("text")
                            .text(d => d )
                            .attr("x", 0)
                            .attr("y", function (d, i) { return i * gridSize; })
                            .style("text-anchor", "end")
                            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                            .attr("class", "monthLabels axis");
                      
                        svg.append('g')
                        	.attr('class', 'x axis')
                        .append('text')
                          .attr('class', 'monthLabel')
                          .attr('x', -260)
                          .attr('y', -80)
                          .style('font-size', '20px')
                          .attr('transform', 'rotate(-90)')
                          .text('Months');
                        
                        svg.append('g')
                        	.attr('class', 'y axis')
                        .append('text')
                          .attr('class', 'yearLabel')
                          .attr('x', 450)
                          .attr('y', 550)
                          .style('font-size', '20px')
                          .text('Years');
                          
                      let colorScale = 
                        d3.scale.quantile()
                        .domain([0, buckets - 1, d3.max(allData, d => d.variance )])
                        .range(colors);
                        
                      let tip = 
                        d3.tip()
                          .attr('class', 'd3-tip')
                          .offset([-5, 0])
                          .html(d => {
                            let toolTip = "<div><strong>Year:</strong> <span style='color:red'>" + d.year + "</span></div>"
                            toolTip += "<div><strong>Temp:</strong> <span style='color:red'>" + (d.variance + baseTemp).toFixed(2) + "<sup>c</sup></span></div>"
                            toolTip += "<div><strong>Variance:</strong> <span style='color:red'>" + d.variance + "<sup>c</sup></span></div>"
                            return toolTip
                          })
                        svg.call(tip)  
                      
                      let cards  = 
                        svg.selectAll(".years")
                          .data(monthlyVariance, d => (d.year + ':' + d.month));
                          
                        cards.enter()
                          .append("rect")
                          .attr("x", d => ((d.year - 1753) * 4))
                          .attr("y", d => ((d.month - 1) * gridSize))
                          .attr("rx", 0)
                          .attr("ry", 0)
                          .attr("width", 4)
                          .attr("height", 41)
                          .style("fill", colors[6])
                          .on('mouseover', tip.show)
                          .on('mouseout', tip.hide)

                        cards.transition()
                          .style("fill", d => colorScale(d.variance + baseTemp));

                        cards.exit().remove();
                         
                      let legend = svg.selectAll(".legend")
                        .data([0].concat(colorScale.quantiles()), d => d );

                        legend.enter().append("g")
                            .attr("class", "legend");
                            
                        legend.append("rect")
                          .attr("x", (d, i) => legendElementWidth * i )
                          .attr("y", height)
                          .attr("width", legendElementWidth)
                          .attr("height", gridSize / 2)
                          .style("fill", (d, i) => colors[i] );

                        legend.append("text")
                          .text(d => d.toFixed(2))
                          .attr("x", (d, i) => legendElementWidth * i )
                          .attr("y", height + gridSize);
                          
                        legend.exit().remove()

                  });
  } 
}
