import { Component, ElementRef, Renderer, Inject } from 'angular2/core';
import { Http, Response, HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/add/operator/map' //add for http.get.map
declare var d3:any;
@Component({
    selector: 'my-app',
    template: `
    <div class="graph">
      <h1>Gross Domestic Product</h1>
      <svg class="chart"></svg>
    </div>
    `,
    styleUrls: ['app/app.component.css'],
    providers: [
      HTTP_PROVIDERS,
    ]
})

export class AppComponent {
    constructor(
      @Inject(Http) private http:Http
      //@Inject(Renderer) public renderer : Renderer,
      //@Inject(ElementRef) public el : ElementRef
    ) { }

    ngOnInit() {
      this.http.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
                      .map(res => res.json())
                      .subscribe(allData => {
                        let name = allData.name;
                        let data = allData.data;
                        console.log(1);
                        let margin = {top: 20, right: 20, bottom: 30, left: 80};
                        let width = 960 - margin.left - margin.right;
                        let height = 500 - margin.top - margin.bottom;

                        let x = d3.time.scale()
                          .range([0, width]);

                        let y = d3.scale.linear()
                          .range([height, 0])

                        let xAxis = d3.svg.axis()
                          .scale(x)
                          .orient("bottom")
                          .ticks(d3.time.years, 10);

                        let yAxis = d3.svg.axis()
                          .scale(y)
                          .orient("left")
                          .ticks(10, "$");

                        let svg = d3.select(".chart")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                          .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                        x.domain([new Date(data[0][0]), new Date(data[274][0])]);
                        y.domain([0, d3.max(data, (d : Object) => d[1]) ]);

                        svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0," + height + ")")
                          .call(xAxis);

                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                          .attr("transform", "rotate(-90)")
                          .attr("y", 6)
                          .attr("dy", ".71em")
                          .style("text-anchor", "end")
                          .text(name);

                        let currency = d3.format(",.2f")
                        let tip = d3.tip()
                                    .attr('class', 'toolTip')
                                    .html((d:Object) =>
                                      "<div class='toolTip'>$" + currency(d[1]) + " Billion</div><div class='toolTip'>" + d[0] + "</div>"
                                     );
                        svg.call(tip)

                        svg.selectAll(".bar")
                          .data(data)
                          .enter().append("rect")
                          .attr("class", "bar")
                          .attr("x", (d : Object) => x(new Date(d[0])))
                          //.attr("width", x.rangeBand())
                          .attr("y", (d : Object) => y(d[1]))
                          .attr("height", (d : Object) => height - y(d[1]))
                          .attr("width", 4)
                          .on('mouseover', tip.show)
                          .on('mouseout', tip.hide)
                      })

    }
}
