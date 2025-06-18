
/* To apply this animation to your website, paste the following into your HTML code:
<iframe src="https://codepen.io/tommyho/full/PoxdWJY" width=500 height=500></iframe>

/*
  Sources:
  https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/6-physics-libraries/1-matterjs-introduction
  Revised by: tommyho510@gmail.com   
*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', async function() { 

  /* --- System Parameters (Recommended)--- */
  let pBounce = 0.75;  // Define Bounciness (0.8)
  let pFriction = 0.01; // Define air friction (0.01)
  // mouse click in mid-air to create more particles

  /* --- Main Program: DO NOT EDIT BELOW --- */
  let w = window.innerWidth;
  let h = window.innerHeight;

  chart = Highcharts.mapChart('map_highcharts', {

      title: {
        text: undefined
      },

      chart: {
          // map: 'msc_new',
          backgroundColor: null,
      },

      exporting: {
        enabled: false,
      },
      // mapNavigation: {
      //     enabled: true,
      // },
      // mapView: {
      //   fitToGeometry: {
      //     type: 'Polygon',
      //     coordinates: [
      //       [4144000, 7461000 + 500000],
      //       [4144000 + 90000, 7461000 + 500000],
      //       [4144000 + 90000, 7461000],
      //       [4144000, 7461000],
      //       [4144000, 7461000 + 500000]
      //     ]
      //   }
      // },

      plotOptions: {
        series: {
            states: {
              // hover: {
              //   enabled: false,
              // },
              inactive: {
                enabled: false,
              },
              select: {
                enabled: false,
              },
            },
            tooltip: {
              pointFormat:  "{point.name}"
            }
        }
      },

      series: [
          {
              // allAreas: true,
              type: 'map',
              data: Highcharts.geojson(districts),
              name: 'Районы',
              color: "#f5f5f5",
              opacity: 0.9,
              borderWidth: 0.25,
              tooltip: {
                  pointFormat:  "{point.properties.okrug}"
                }
          },
          {
              type: 'map',
              data: park_data,
              mapData: Highcharts.geojson(parks_geojson),
              name: 'Парки',
              borderWidth: 0,
              states: {
                hover: {
                    // color: '#a4edba',
                    color: '#FF0000',
                    borderColor: 'gray'
                },
              },

              point: {
                events: {
                  mouseOver: function() {
                    park = engine.world.bodies.find((b) => b.label == this["hc-key"])
                    if (park !== undefined) {
                      // engine.world.bodies.find((b) => b.label == this["hc-key"]).render.fillStyle  = "#a4edba"
                      engine.world.bodies.find((b) => b.label == this["hc-key"]).render.fillStyle  = "#FF0000"
                    }
                  },
                  mouseOut: function() {
                    park = engine.world.bodies.find((b) => b.label == this["hc-key"])

                    console.log(this["hc-key"])
                    
                    console.log(park_data.find((p) => p["hc-key"] == this["hc-key"]).color)

                    console.log(park)
                    if (park !== undefined) {
                      park.render.fillStyle = park_data.find((p) => p["hc-key"] == this["hc-key"]).color
                      }
                  }
                }
              },
              // colorKey: 'color',
              // color: Highcharts.getOptions().colors[0],
              // color: Highcharts.maps["msc_new"].filter(x => x.name == "parks")[0].color,
              // opacity: 0.7,
          },
          {
              type: 'mappoint',
              data: parks_centroids,
              // mapData: Highcharts.geojson(parks_centroids),
              name: 'parks_centroid',
              visible: false,
              // color: "#FF0000",
              // lineWidth: 0.75,
              // opacity: 0.7,
          },
          // {
          //   type: 'mapline',
          //   data: Highcharts.geojson(Highcharts.maps["msc_new"].filter(x => x.name == "rivers")[0], 'mapline'),
          //   name: 'river',
          //   color: Highcharts.maps["msc_new"].filter(x => x.name == "rivers")[0].color
          // },
          // {
          //     type: 'mapline',
          //     data: Highcharts.geojson(Highcharts.maps["msc_new"].filter(x => x.name == "roads")[0], 'mapline'),
          //     name: 'roads',
          //     color: Highcharts.maps["msc_new"].filter(x => x.name == "roads")[0].color,
          //     lineWidth: 1,
          // },
      ],

      // xAxis: {
      //   min: 4144000,
      //   max: 4144000 + 90000,
      //           startOnTick: false,
      //   endOnTick: false
      // },


      // yAxis: {
      //   min: 7461000,
      //   max: 7461000 + 90000
      // },


  });

   
  console.log(chart)
  centroids_position = []
  chart.series[2].points.forEach((p) => {
    centroids_position.push({x: p.plotX, })
  })

  let clickCounter = 0


  const { Engine, Render, Body, Bodies, World, Composite, MouseConstraint, Composites, Query } = Matter;

  // const { CircleType } = circletype;

  const sectionTag = document.getElementById("matter_area");
  const engine = Engine.create();
  const renderer = Render.create({
    canvas: sectionTag,
    engine: engine,
    options: {
      width: w,
      height: h,
      background:'transparent',
      wireframes: false,
      pixelRatio: window.devicePixelRatio 
    },
  });



  
  const box = {
    w: 100,
    h: 100,
    body: Bodies.circle(100, 100, 50, {label: "box"}),
    elem: document.querySelector("#box"),
    render() {
      const {x, y} = this.body.position;
      this.elem.style.top = `${y - this.h / 2}px`;
      this.elem.style.left = `${x - this.w / 2}px`;
      // this.elem.style.transform = `rotate(${this.body.angle}rad)`;
    },
  };



  // Create a bubble
  const createShape = function(x, y, radius) {
    return Bodies.circle(x, y, radius, {
      frictionAir: pFriction,
      restitution: pBounce,
      render: {
        sprite: {
          yScale: 0.5,
          xScale: 0.5, 
        },
        fillStyle: 'blue',
        strokeStyle: 'blue',
      }
    })
  };

  // Create a static body to bounce off
  // const iceCream = Bodies.polygon(w / 2, h / 2, 3, Math.min(w / 6, h / 6), {
  //   isStatic: true,
  //   label: 'Rectangle Body',
  //   render: {
  //     lineWidth: 5,
  //     strokeStyle: 'yellow',
  //     fillStyle: "#448",
  //     visible: true
  //   }
  // });




      let div = document.createElement('div');
      // div.innerHTML = '<h1 class="tooltiptext">' + data[i].name + "</h1>";
      // div.innerHTML = '<h1 class="tooltiptext">' + i + "</h1>" + '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 800 800"><path class="spiral" d="" fill="none" stroke="#fdeecd" stroke-width="15"/><path class="spiral2" d="" fill="none" stroke="#888b90" stroke-width="15"/></svg>';
      div.setAttribute('class', 'iceCream'); // and make sure myclass has some styles in css
      div.setAttribute('id', "iceCream"); // and make sure myclass has some styles in css
      div.setAttribute('style', "top: 0px; left:0 px; z-index: 4")
      
      document.body.appendChild(div);

      console.log(w, h)

      const iceCreammtjs = Matter.Bodies.fromVertices(
        w / 2,
        h ,
        vertexSets = [[
          { x: 0, y: 0 },
          { x: 20, y: 35 },
          { x: 480, y: 35 },
          { x: 500, y: 0 },
          { x: 250, y: 500 },
          // { x: w / 2 - 260, y: 1000},
          // { x: w / 2 + 260, y: 1000},
          // { x: w / 2, y: 1500}
        ]],
          {
          frictionAir: pFriction,
          restitution: -0.5,
          friction: 0.1,
          frictionStatic: 0.1,
          slop: 0,
          isStatic: true,
          label: 'iceCream',
          render: {
            // sprite: {
            //   texture: './waffel.jpg',
            //   yScale: 0.5,
            //   xScale: 0.5, 
            // },
            // fillStyle: park_data[i].color,
            // strokeStyle: "#FF0000",
            // lineWidth: 5,
        }
      })
      iceCreammtjs.label = 'iceCream'


      let iceCream = {
        body: iceCreammtjs,
        elem: document.getElementById("iceCream"),
        render() {
          const {x, y} = this.body.position;
          this.elem.style.top = `${y-175}px`;
          this.elem.style.left = `${x-250}px`;
          // this.elem.style.width = `${this.body.circleRadius * 2}px`;
          // this.elem.style.height = `${this.body.circleRadius * 2}px`;
          // this.elem.style.backgroundColor = this.body.render.fillStyle;
          // this.elem.style.borderRadius = "50%"
          // this.elem.style.borderStyle = "solid"
          // this.elem.style.borderWidth = "3px"
          // this.elem.style.borderColor = "#FF0000"
          // this.elem.style.transform = `rotate(${this.body.angle}rad)`;
        },
      };

      // console.log(circle_mtjs)

      // Composite.add(engine.world, iceCreammtjs);


  // document.querySelectorAll(".park").forEach((e) => {

  //   eId = e.getAttribute('id')

  //   console.log(eId)
  //   e.addEventListener('mouseenter', () => {
  //     e.style.backgroundColor = "#FFA500"
  //     chart.series[2].data[eId].setState('hover')
  //     chart.tooltip.refresh(chart.series[2].data[eId])
  //   })
  //   eleem.addEventListener('mouseleave', () => {
  //     e.style.backgroundColor = ''
  //     chart.series[2].data[eId].setState(undefined)
  //     chart.tooltip.hide(chart.series[2].data[eId])
  //   })
  // })


  // Create a wall for the shapes to bounce off
  const wallOptions = {
    isStatic: true,
    render: {
      visible: true
    }
  };

  const ground = Bodies.rectangle(w / 2, h + 50, w + 100, 100, wallOptions);
  const ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions);
  const leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions);
  const rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions);

  const mouseControl = MouseConstraint.create(engine, {
    element: sectionTag,
    constraint: {
      render: {
        visible: false
      }
    }
  });

  // // Create a stack of 15 x 5 bubbles
  // const intialShapes = Composites.stack(50, 50, 15, 1, 0, 0, function(x, y, radius){
  //   return createShape(x, y, radius)
  // });

  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

  map_highcharts_position = getOffset(document.getElementById("map_highcharts"))

  console.log(map_highcharts_position)

  coords = {left: 500, top: 0}

  // const circle1 = Bodies.circle(coords.left + 500, 200, 37.5, {
  //     frictionAir: pFriction,
  //     restitution: pBounce,
  //     isStatic: true,
  //     render: {
  //       sprite: {
  //         yScale: 0.5,
  //         xScale: 0.5, 
  //       },
  //       fillStyle: 'blue',
  //       strokeStyle: 'blue',
  //     }
  //   })

  // Start world engine
  Composite.add(engine.world, [
    // staticObj, 
    ground,
    ceiling,
    leftWall,
    rightWall,
    mouseControl,
    iceCreammtjs,
    // box.body,

    // intialShapes,
    // circle1
  ]);


  (function rerender() {
    iceCream.render();
    // Engine.update(engine);
    requestAnimationFrame(rerender);
  })()

  // (function rerender() {
  //   box.render();
  //   Engine.update(engine);
  //   requestAnimationFrame(rerender);
  // })()
  



  
  // Add resize listener
  /* 
  window.addEventListener("resize", function() {
    w = window.innerWidth;
    h = window.innerHeight;
    renderer = Render.run({
      options: {
        width: w,
        height: h,
      }
    })
  });
  */



  // ########### Old function to create parks: 
  // var i = 0;
  // parks = []
  // console.log(data)
  // function myLoop(x, y, radius) {
  //   setTimeout(function() {
  //     const circle = Bodies.circle(x, y, radius, {
  //       frictionAir: pFriction,
  //       restitution: pBounce,
  //       friction: 1,
  //       frictionStatic: 1,
  //       slop: 0,
  //       isStatic: true,
  //       label: data[i].name,
  //       render: {
  //         sprite: {
  //           yScale: 0.5,
  //           xScale: 0.5, 
  //         },
  //         fillStyle: data[i].color,
  //         strokeStyle: "#FF0000",
  //         lineWidth: 5,
  //       }
  //     })

  //     Composite.add(engine.world, circle);

  //     parks 
  //     i++;
  //     if (i < 117) {
  //       myLoop(coords.left + data[i].offset_x / 100, 900 - data[i].offset_y / 100, data[i].radius / 80);
  //     }
  //   }, 10)
  // }

  // myLoop(coords.left + data[i].offset_x / 100, 900 - data[i].offset_y / 100, data[i].radius / 80);  


  // console.log(slides[0])



  document.getElementById("slide").innerHTML = slides[0]




  document.querySelector(".title").onclick = async function(e) {


    // if (clickCounter == 0 & engine.world.bodies.length == 121) {
    if (clickCounter == 0) {
    // var i = 1
    // map = document.getElementById("map_highcharts")
    // function remove_map() { 
    //   setTimeout(function() { 
    //     // map.style.top =  - (i * 20) + "px";
    //     map.style.left =  + (i * 20) + "px";
    //     i++;  
    //     if (i < 10) { 
    //       remove_map()
    //     } 
    //   }, 0.01)

    // }

    // remove_map();


      // document.getElementById("slide").innerHTML = slides[0]
      

      // ########### New function to create parks: 

      // const path = getPath({x:400,y:400}, 0, 50, 0, 5*360, 30);
      // const path2 = getPath({x:400,y:400}, 0, 60, 0, 3*270, 30);

      m_pix = (
        chart.series[2].points[1].y
        - chart.series[2].points[0].y
      ) / (
        chart.series[2].points[0].plotY
        - chart.series[2].points[1].plotY
      ) / 2

      var i = 0;

      function myLoop(x, y, radius) {
        setTimeout(function() {

          // console.log(park_data[i]["hc-key"])

          let div = document.createElement('div');
          // div.innerHTML = '<h1 class="tooltiptext">' + data[i].name + "</h1>";
          div.innerHTML = '<h1 class="tooltiptext">' + park_data[i]["name"] + "</h1>" + '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 800 800"><path class="spiral" d="" fill="none" stroke="#fdeecd" stroke-width="15"/><path class="spiral2" d="" fill="none" stroke="#888b90" stroke-width="15"/></svg>';
          div.setAttribute('class', 'park'); // and make sure myclass has some styles in css
          div.setAttribute('id', park_data[i]["hc-key"]); // and make sure myclass has some styles in css
          div.setAttribute('style', "top: 0px; left:0 px; z-index: 2")
          
          document.body.appendChild(div);

          const circle_mtjs = Bodies.circle(x, y, radius, {
            frictionAir: pFriction,
            restitution: pBounce,
            friction: 0.7,
            frictionStatic:  0.7,
            slop: 0,
            isStatic: true,
            label: park_data[i]["hc-key"],
            render: {
              // sprite: {
              //   yScale: 0.5,
              //   xScale: 0.5, 
              // },
              fillStyle: park_data[i].color,
              strokeStyle: "#FF0000",
              lineWidth: 5,
            }
          })


          let circle = {
            body: circle_mtjs,
            elem: document.getElementById(park_data[i]["hc-key"]),
            render() {
              const {x, y} = this.body.position;
              this.elem.style.top = `${y - this.body.circleRadius}px`;
              this.elem.style.left = `${x - this.body.circleRadius}px`;
              this.elem.style.width = `${this.body.circleRadius * 2}px`;
              this.elem.style.height = `${this.body.circleRadius * 2}px`;
              this.elem.style.backgroundColor = this.body.render.fillStyle;
              // this.elem.style.borderRadius = "50%"
              // this.elem.style.borderStyle = "solid"
              // this.elem.style.borderWidth = this.body.render.lineWidth;
              // this.elem.style.borderColor = this.body.render.strokeStyle;
              // this.elem.style.transform = `rotate(${this.body.angle}rad)`;
            },
          };

          // console.log(circle_mtjs)

          Composite.add(engine.world, circle_mtjs);

          (function rerender() {
            circle.render();
            // Engine.update(engine);
            requestAnimationFrame(rerender);
          })()

          // chart.series[1].data[i].update({
          //     opacity: 0.2
          // })

          i++;
          if (i < 117) {
            myLoop(
              chart.series[2].points[i].plotX + map_highcharts_position.left + 10,
              chart.series[2].points[i].plotY + map_highcharts_position.top + 10,
              park_data[i].radius / m_pix
            );
          }
        }, 1)
      }

      myLoop(
        chart.series[2].points[i].plotX + map_highcharts_position.left + 10,
        chart.series[2].points[i].plotY + map_highcharts_position.top + 10,
        park_data[i].radius / m_pix
      );

  // console.log(engine.world)


    await sleep(2000);


    function animateLeft(obj, from, to){
      if(from >= to){         
          // obj.style.visibility = 'hidden';
          return;  
      }
      else {
          var box = obj;
          box.style.marginLeft = from + "px";
          setTimeout(function(){
              animateLeft(obj, from + 20, to);
          }, 0.1) 
      }
    }

    animateLeft(
      document.getElementById('map_highcharts'),
      0,
      map_highcharts_position.left
    );
    
  


    // function animateTop(obj, from, to){
    //   if(from < to){         
    //       // obj.style.visibility = 'hidden';
    //       return;  
    //   }
    //   else {
    //       var box = obj;
    //       box.style.marginTop = from + "px";

    //       console.log(box.style.marginTop)
    //       setTimeout(function(){
    //           animateTop(obj, from - 20, to);
    //       }, 0.1) 
    //   }
    // }

    // console.log(iceCreammtjs.position)

    // animateTop(
    //   document.getElementById('iceCream'),
    //   500,
    //   0
    // );

    

    // function animateByMargin(obj, direction, from, to, step){
    //   if((from - step) == to){         
    //       return;  
    //   }
    //   else {

    //     var box = obj;

    //     if (direction == "verically") {
    //        box.style.marginTop = from + "px";
    //     } else {
    //        box.style.marginLeft = from + "px";
    //     }
      
    //     setTimeout(function(){
    //         animateByMargin(obj, direction, from + step, to, step);
    //     }, 0.1) 

    //   }
    // }

    animateByMargin(
      document.getElementById('iceCream'),
      "verically",
      500,
      0,
      -20
    );


    document.getElementById("slide_next").innerHTML = slides[1]

    animateByMargin(
      document.getElementById('slide'),
      "verically",
      0,
      1000,
      20
    );

    animateByMargin(
      document.getElementById('slide_next'),
      "verically",
      0,
      800,
      20
    );


    engine.world.bodies.forEach((b) => {
        if ((b.label != 'Rectangle Body') & (b.label != 'iceCream')) {
          Body.setMass(b, 0.01 * (b.area))
          Body.setStatic(b, false)
        }
    });

    document.getElementById('map_highcharts').style.zIndex = "4";

    clickCounter++;

    } else if (clickCounter == 1) {

      for (i = 0; i < engine.world.bodies.length; i++) {
          
        b = engine.world.bodies[i]
        if (data[i].area < 250 & b.label != 'Rectangle Body') {
          Composite.remove(engine.world, b)
          document.getElementById(b.label).remove();
          i = i - 1
        }
      }

      animateByMargin(
        document.getElementById('iceCream'),
        "verically",
        0,
        500,
        20
      );

      console.log(engine.world.bodies.find((b) => b.label == "iceCream"))

      Composite.remove(engine.world, engine.world.bodies.find((b) => b.label == "iceCream"))

      document.getElementById('slide_next').setAttribute("id", "slide_")
      document.getElementById('slide').setAttribute("id", "slide_next")
      document.getElementById('slide_').setAttribute("id", "slide")

      document.getElementById("slide_next").innerHTML = slides[2]

      animateByMargin(
        document.getElementById('slide'),
        "verically",
        0,
        1000,
        20
      );

      animateByMargin(
        document.getElementById('slide_next'),
        "verically",
        0,
        800,
        20
      );


    //   clickCounter++;

    // } else if (clickCounter == 2) {

      await sleep(500);

      function scaleParks() {
        i = 0
        function scale_parks() { 
          setTimeout(function() { 
            engine.world.bodies.forEach((b) => {

                if (b.label != 'Rectangle Body') {
                  Body.scale(b, 1.1, 1.1)
                }
            });
            i++;  
            if (i < 15) { 
              scale_parks()
            } 
          }, 0.1)

        }
        scale_parks();
      }

      scaleParks()
    //   clickCounter++;
  
    // } else if (clickCounter == 3) {

      await sleep(500);

      function drawSpirals () {

        const path = getPath({x:400,y:400}, 0, 50, 0, 5*360, 30);
        const path2 = getPath({x:400,y:400}, 0, 60, 0, 3*270, 30);

        document.querySelectorAll(".spiral").forEach((s) => {
            s.style.zIndex = "1";
            s.setAttribute("d", path);
        });
        document.querySelectorAll(".spiral2").forEach((s) => {
            s.style.zIndex = "2";
            s.setAttribute("d", path2);
        });
      }

      drawSpirals()
      clickCounter++;
  

    } else if (clickCounter == 2) {


      document.getElementById('slide_next').setAttribute("id", "slide_")
      document.getElementById('slide').setAttribute("id", "slide_next")
      document.getElementById('slide_').setAttribute("id", "slide")

      document.getElementById("slide_next").innerHTML = slides[3]

      animateByMargin(
        document.getElementById('slide'),
        "verically",
        0,
        1000,
        20
      );

      animateByMargin(
        document.getElementById('slide_next'),
        "verically",
        0,
        800,
        20
      );

        await sleep(200);

        document.querySelectorAll(".spiral").forEach((s) => {
             s.style.visibility = "hidden"
        });
        document.querySelectorAll(".spiral2").forEach((s) => {
            s.style.visibility = "hidden"
        });

      await sleep(200);
      engine.world.bodies.forEach((b) => b.render.fillStyle ="#272757")
      
      await sleep(200);
      document.querySelectorAll('.park').forEach((p) => p.style.boxShadow = "inset 0px 0px 50px gold")

      clickCounter++;

    }

  };








  // Add a click listener -> add a bubble or drag a bubble
  // document.addEventListener("click", function(event){
  //   const shape = createShape(event.pageX, event.pageY);
  //   intialShapes.bodies.push(shape);
  //   World.add(engine.world, shape);
  // });

  // // Add a mousemove -> change bubble color or drag a bubble
  // document.addEventListener("mousemove", function(event){
  //   const vector = {x: event.pageX, y: event.pageY};
  //   const hoveredShapes = Query.point(intialShapes.bodies, vector);
    
  //   // hoveredShapes.forEach(shape => {
  //   //   shape.render.sprite = null
  //   //   shape.render.fillStyle = "black"
  //   //   shape.render.lineWidth = 5
  //   // });
    
  // });



  // // Add a mousemove -> change bubble color or drag a bubble
  // document.addEventListener("mouseover", function(event){

  //   const vector = {x: event.pageX, y: event.pageY};

  //   // console.log(vector)

  //   console.log(engine.world.bodies)
    
  //   const hoveredShapes = Query.point(engine.world.bodies, vector);
    
  //   hoveredShapes.forEach(shape => {

  //     label = shape.label

  //     console.log(label)

  //     if (label == "box") {
  //       bubble = this.getElementById("box")
  //       console.log(bubble.children[0])
  //       bubble.children[0].style.visibility = "visible"
  //     }
      
  //   });
    
  // });

  Matter.Events.on(mouseControl, 'mousemove', function (event) {
    //For Matter.Query.point pass "array of bodies" and "mouse position"
    const vector = event.mouse.absolute;

    const hoveredShapes = Query.point(engine.world.bodies, vector);
    
    if (hoveredShapes.length > 0) {

      document.querySelectorAll(".park").forEach((b) => {
          b.children[0].style.visibility = "hidden"
      });

      label = hoveredShapes[0].label

      if ((label != 'Rectangle Body') & (label != 'iceCream')) {
        bubble = document.getElementById(label)
        bubble.children[0].style.visibility = "visible"

        chart.series[1].data.find((d) => d["hc-key"] == label).setState('hover')
        chart.tooltip.refresh(chart.series[1].data.find((d) => d["hc-key"] == label))

      }

    };

    if (hoveredShapes.length == 0) {

      document.querySelectorAll(".park").forEach((b) => {
          b.children[0].style.visibility = "hidden"
      });

      chart.series[1].data.forEach((d) => {
        d.setState(undefined)
      })

      chart.tooltip.hide()

    }


    // document.querySelectorAll("park").forEach((b) => {
    //     b.children[0].style.visibility = "hidden"
    // });

  });


  Matter.Runner.run(engine);
  // Matter.Render.run(renderer);

  // Add time-dependent gravity
  // let time = 0;
  // const changeGravity = function() {
  // time = time + 0.01;
    
  // engine.world.gravity.x = Math.sin(time);
  // engine.world.gravity.y = Math.cos(time);
  
  // requestAnimationFrame(changeGravity);
  // };

  // changeGravity();

  // Add orientation listener -> gravity follows orientation
  /*
  window.addEventListener("deviceorientation", function(event){
    engine.world.gravity.x = event.gamma;
    engine.world.gravity.y = event.beta;
  });
  */


});




// https://stackoverflow.com/questions/49091970/how-to-make-a-spiral-in-svg
 function lineIntersection (m1, b1, m2, b2) {
      if (m1 === m2) {
          throw new Error("parallel slopes");
      }
      const x = (b2 - b1) / (m1 - m2);
      return {x: x, y: m1 * x + b1};
  }

  function pStr (point) {
    return `${point.x},${point.y} `;
  }

  // const path = getPath({x:400,y:400}, 0, 50, 0, 5*360, 30);
  // const path2 = getPath({x:400,y:400}, 0, 60, 0, 3*270, 30);

  function getPath (center, startRadius, spacePerLoop, startTheta, endTheta, thetaStep) {
      // Rename spiral parameters for the formula r = a + bθ
      const a = startRadius;  // start distance from center
      const b = spacePerLoop / Math.PI / 2; // space between each loop

      // convert angles to radians
      let oldTheta = newTheta = startTheta * Math.PI / 180;
      endTheta = endTheta * Math.PI / 180;
      thetaStep = thetaStep * Math.PI / 180;

      // radii
      let oldR,
          newR = a + b * newTheta;

      // start and end points
      const oldPoint = {x: 0, y: 0};
      const newPoint = {
          x: center.x + newR * Math.cos(newTheta), 
          y: center.y + newR * Math.sin(newTheta)
      };

      // slopes of tangents
      let oldslope,
          newSlope = (b * Math.sin(oldTheta) + (a + b * newTheta) * Math.cos(oldTheta)) /
                    (b * Math.cos(oldTheta) - (a + b * newTheta) * Math.sin(oldTheta));

      let path = "M " + pStr(newPoint);
      
      while (oldTheta < endTheta - thetaStep) {
          oldTheta = newTheta;
          newTheta += thetaStep;

          oldR = newR;
          newR = a + b * newTheta;

          oldPoint.x = newPoint.x;
          oldPoint.y = newPoint.y;
          newPoint.x = center.x + newR * Math.cos(newTheta);
          newPoint.y = center.y + newR * Math.sin(newTheta);

          // Slope calculation with the formula:
          // (b * sinΘ + (a + bΘ) * cosΘ) / (b * cosΘ - (a + bΘ) * sinΘ)
          const aPlusBTheta = a + b * newTheta;

          oldSlope = newSlope;
          newSlope = (b * Math.sin(newTheta) + aPlusBTheta * Math.cos(newTheta)) /
                    (b * Math.cos(newTheta) - aPlusBTheta * Math.sin(newTheta));

          const oldIntercept = -(oldSlope * oldR * Math.cos(oldTheta) - oldR * Math.sin(oldTheta));
          const newIntercept = -(newSlope * newR* Math.cos(newTheta) - newR * Math.sin(newTheta));

          const controlPoint = lineIntersection(oldSlope, oldIntercept, newSlope, newIntercept);

          // Offset the control point by the center offset.
          controlPoint.x += center.x;
          controlPoint.y += center.y;

          path += "Q " + pStr(controlPoint) + pStr(newPoint);
      }
      
      return path;
  }




function animateByMargin(obj, direction, from, to, step){
  if((from - step) == to){         
      return;  
  }
  else {

    var box = obj;

    if (direction == "verically") {
        box.style.marginTop = from + "px";
    } else {
        box.style.marginLeft = from + "px";
    }

    setTimeout(function(){
        animateByMargin(obj, direction, from + step, to, step);
    }, 0.1) 

  }
}