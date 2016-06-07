import {Component, Inject} from 'angular2/core';
import { Http, Response, HTTP_PROVIDERS } from 'angular2/http';
import 'rxjs/add/operator/map' //add for http.get.map
declare var d3:any;
//import { WORLD } from './world-50m'

@Component({
    selector: 'my-app',
    template: '<svg class="chart"></svg>',
    providers: [HTTP_PROVIDERS],
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
  constructor(
    @Inject(Http) private http:Http
  ) {}
  ngOnInit() {
    this.http.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json')
            .map((res:Response) => res.json())
            .subscribe((data:any) => {
                //console.log(data);
                var width = 960,
                    height = 960;
                    
                var projection = d3.geo.mercator()
                    .scale((width + 1) / 2 / Math.PI)
                    .translate([width / 2, height / 2])
                    .precision(.1);

                var path = d3.geo.path()
                    .projection(projection);

                var svg = d3.select(".chart")
                    .attr("width", width)
                    .attr("height", height);
                d3.json('https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json', function(world) {
                  svg.insert("path")
                      .datum(topojson.feature(world, world.objects.land))
                      .attr("class", "land")
                      .attr("d", path);
                      
                  svg.insert("path")
                      .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b ))
                      .attr("class", "boundary")
                      .attr("d", path);

                let dataArray = data.features.filter(d => (d.geometry !== null && d.properties.mass !== null) )
                console.log(dataArray)
                
                let tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(d => {
                    return "<div>"
                    + "<div><span>Mass: </span><span>" + d.properties.mass + "</span></div>"
                    + "<div><span>Name: </span><span>" + d.properties.name + "</span></div>"
                    + "<div><span>Type: </span><span>" + d.properties.nametype + "</span></div>"
                    + "<div><span>Recclass: </span><span>" + d.properties.recclass + "</span></div>"
                    + "</div>";
                  })
                svg.call(tip)
                
                svg.selectAll("circle")
                  .data(dataArray).enter()
                  .append("circle")
                  .attr("cx", d => projection(d.geometry.coordinates)[0] )
                  .attr("cy", d=> projection(d.geometry.coordinates)[1] )
                  .attr("r", d => {
                    let mass = Math.round(d.properties.mass)
                    if (mass < 100000) 
                      return '1px'
                    else if (mass > 10000000)
                      return '30px'
                    else
                      return (Math.floor(.01 * Math.sqrt(d.properties.mass))) + 'px'
                    }) //add weight for radius
                  .style("fill-opacity", d => {
                    if (Math.round(d.properties.mass) < 100000) 
                      return 1
                    else if (Math.round(d.properties.mass) > 10000000)
                      return .3
                    else
                      return .6
                  })
                  .attr("fill", "red")
                  .attr('stroke-width', .3)
                  .attr('stroke', 'yellow')    
                  .on("mouseover", tip.show)
                  .on("mouseoff", tip.hide) 
                d3.select(self.frameElement).style("height", height + "px");
                })
                })
                
   }
 }
