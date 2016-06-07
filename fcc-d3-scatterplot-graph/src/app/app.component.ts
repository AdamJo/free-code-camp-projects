import { Component, ElementRef, Renderer, Inject } from 'angular2/core';
import { Http, Response, HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/add/operator/map' //add for http.get.map
declare var d3:any;
@Component({
    selector: 'my-app',
    template: `
    <div class="graph">
      <h1>Doping in Professional Bicycle Racing</h1>
      <h3>D3 Scatterplot Visualization1</h3>
      <div class="toolTip">
        <div>{{name}}</div>
        <div>{{year}}</div>
        <div>{{doping}}</div>
        <div>{{time}}</div>
      </div>
      <svg class="chart"></svg>
    </div>
    `,
    styleUrls: ['app/app.component.css'],
    providers: [
      HTTP_PROVIDERS
    ]
})
export class AppComponent {
    public name:string;
    public year:string;
    public nationality:string;
    public doping:string;
    public time:string;

    constructor(
      @Inject(Http) private http:Http
      //@Inject(Renderer) public renderer : Renderer,
      //@Inject(ElementRef) public el : ElementRef
    ) {
    }

    ngOnInit() {
      this.http.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
                      .map((res:Response) => res.json())
                      .subscribe((allData:Object) => {
                        let margin = {top: 20, right: 15, bottom: 60, left: 60};
                        let width = 960 - margin.left - margin.right;
                        let height = 500 - margin.top - margin.bottom;
                        let timeDifference = allData[34].Seconds - allData[0].Seconds
                        let x = d3.scale.linear()
                          .domain([0, timeDifference])
                          .range([ 0, width ]);

                        let y = d3.scale.linear()
                  	      .domain([0, d3.max(allData, d => d.Place )])
                  	      .range([ height, 0 ]);

                        let chart = d3.select('.chart')
                        	.attr('width', width + margin.right + margin.left + 150)
                        	.attr('height', height + margin.top + margin.bottom)
                        	.attr('class', 'chart')

                        let main = chart.append('g')
                        	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                        	.attr('width', width)
                        	.attr('height', height)
                        	.attr('class', 'main')

                        let xAxis = d3.svg.axis()
                        	.scale(x)
                        	.orient('bottom');

                        main.append('g')
                        	.attr('transform', 'translate(0,' + height + ')')
                        	.attr('class', 'main axis date')
                        	.call(xAxis)
                        .append('text')
                          .attr('x', 450)
                          .attr('y', 40)
                          .style('font-size', '20px')
                          .text('Seconds');

                        let yAxis = d3.svg.axis()
                        	.scale(y)
                        	.orient('left');

                        main.append('g')
                        	.attr('class', 'axis')
                        	.call(yAxis)
                        .append('text')
                          .attr('x', -230)
                          .attr('y', -40)
                          .style('font-size', '20px')
                          .attr('transform', 'rotate(-90)')
                          .text('Place');


                        let ordinal = d3.scale.ordinal()
                          .domain(["Doping", "Non-doping"])
                          .range([ "red", "steelblue"]);

                        let legend = d3.select("svg");

                        legend.append("g")
                          .attr("class", "legendOrdinal")
                          .attr("transform", "translate(90, 40)");

                        let legendOrdinal = d3.legend.color()
                          .shape("path", d3.svg.symbol().type("circle").size(150)())
                          .shapePadding(10)
                          .scale(ordinal);

                        legend.select(".legendOrdinal")
                          .call(legendOrdinal);

                        let tip = d3.tip()
                                    .html(d => {
                                      this.name = d.Name
                                      this.year = d.Year
                                      this.doping = d.Doping
                                      this.time = d.Time
                                    });

                        chart.call(tip)

                        let g = main.append("svg:g");

                        g.selectAll("scatter-dots")
                          .data(allData)
                          .enter().append("svg:circle")
                              .attr("cx", d => x(d.Seconds - allData[0].Seconds) )
                              .attr("cy", d => y(d.Place))
                              .attr("r", 6)
                              .attr('fill', d => {
                                if (d.Doping === "") {
                                  return "steelblue"
                                } else {
                                  return "red"
                                }
                              })
                              .on('mouseover', tip.show)
                              .on('mouseout', tip.hide)

                        g.selectAll("text")
                          .data(allData)
                          .enter()
                          .append("text")
                          .text(d => d.Name)
                          .attr("x", d => x(d.Seconds - allData[0].Seconds))
                          .attr("y", d => y(d.Place))
                          .attr("transform", "translate(10,+4)");
                      })

    }
}
