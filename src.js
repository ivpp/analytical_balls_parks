
/* To apply this animation to your website, paste the following into your HTML code:
<iframe src="https://codepen.io/tommyho/full/PoxdWJY" width=500 height=500></iframe>

/*
  Sources:
  https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/6-physics-libraries/1-matterjs-introduction
  Revised by: tommyho510@gmail.com   
*/


document.addEventListener('DOMContentLoaded', function() { 
  /* --- System Parameters (Recommended)--- */
  let pBounce = 0.75;  // Define Bounciness (0.8)
  let pFriction = 0.01; // Define air friction (0.01)
  // mouse click in mid-air to create more particles

  /* --- Main Program: DO NOT EDIT BELOW --- */
  let w = window.innerWidth;
  let h = window.innerHeight;


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
  // const staticObj = Bodies.polygon(w / 2, h / 2, 6, Math.min(w / 6, h / 6), {
  //   isStatic: true,
  //   render: {
  //     lineWidth: 5,
  //     strokeStyle: 'yellow',
  //     fillStyle: "#448",
  //     visible: true
  //   }
  // });

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

  coords = getOffset(document.getElementById("map"))

  console.log(coords)

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
    // box.body,

    // intialShapes,
    // circle1
  ]);

  


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

  // ########### New function to create parks: 

  const path = getPath({x:400,y:400}, 0, 50, 0, 5*360, 30);
  const path2 = getPath({x:400,y:400}, 0, 60, 0, 3*270, 30);

  var i = 0;

  function myLoop(x, y, radius) {
    setTimeout(function() {


      let div = document.createElement('div');
      // div.innerHTML = '<h1 class="tooltiptext">' + data[i].name + "</h1>";
      div.innerHTML = '<h1 class="tooltiptext">' + i + "</h1>" + '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 800 800"><path class="spiral" d="" fill="none" stroke="#fdeecd" stroke-width="15"/><path class="spiral2" d="" fill="none" stroke="#888b90" stroke-width="15"/></svg>';
      div.setAttribute('class', 'park'); // and make sure myclass has some styles in css
      div.setAttribute('id', i); // and make sure myclass has some styles in css
      div.setAttribute('style', "top: 0px; left:0 px; z-index: 0")
      
      document.body.appendChild(div);

      const circle_mtjs = Bodies.circle(x, y, radius, {
        frictionAir: pFriction,
        restitution: pBounce,
        friction: 0.7,
        frictionStatic:  0.7,
        slop: 0,
        isStatic: true,
        label: i,
        render: {
          // sprite: {
          //   yScale: 0.5,
          //   xScale: 0.5, 
          // },
          fillStyle: data[i].color,
          strokeStyle: "#FF0000",
          lineWidth: 5,
        }
      })


      let circle = {
        body: circle_mtjs,
        elem: document.getElementById(i),
        render() {
          const {x, y} = this.body.position;
          this.elem.style.top = `${y - this.body.circleRadius}px`;
          this.elem.style.left = `${x - this.body.circleRadius}px`;
          this.elem.style.width = `${this.body.circleRadius * 2}px`;
          this.elem.style.height = `${this.body.circleRadius * 2}px`;
          this.elem.style.backgroundColor = this.body.render.fillStyle;
          this.elem.style.borderRadius = `50%`
          this.elem.style.transform = `rotate(${this.body.angle}rad)`;
        },
      };

      // console.log(circle_mtjs)

      Composite.add(engine.world, circle_mtjs);

      (function rerender() {
        circle.render();
        // Engine.update(engine);
        requestAnimationFrame(rerender);
      })()

      i++;
      if (i < 117) {
        myLoop(coords.left + data[i].offset_x / 100, 900 - data[i].offset_y / 100, data[i].radius / 80);
      }
    }, 10)
  }


  myLoop(coords.left + data[i].offset_x / 100, 900 - data[i].offset_y / 100, data[i].radius / 80);

  console.log(engine.world)


  document.getElementById("matter_area").onclick=function(e) {


    if (clickCounter == 0 & engine.world.bodies.length == 121) {
    // if (clickCounter == 0) {
    var i = 1
    map = document.getElementById("map")
    function remove_map() { 
      setTimeout(function() { 
        map.style.top =  - (i * 20) + "px";
        i++;  
        if (i < 100) { 
          remove_map()
        } 
      }, 0.01)

    }

    remove_map();

    // map.style.display = 'none'

    engine.world.bodies.forEach((b) => {
        if (b.label != 'Rectangle Body') {
          Body.setMass(b, 0.01 * (b.area))
          Body.setStatic(b, false)
        }
    });

    clickCounter++;

    } else if (clickCounter == 1) {

      for (i = 0; i < engine.world.bodies.length; i++) {
          
        b = engine.world.bodies[i]
        if (b.area < 500 & b.label != 'Rectangle Body') {
          Composite.remove(engine.world, b)
          document.getElementById(b.label).remove();
          i = i - 1
        }
      }

      clickCounter++;

    } else if (clickCounter == 2) {
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

      clickCounter++;
  
    } else if (clickCounter == 3) {

      document.querySelectorAll(".spiral").forEach((s) => {
          s.style.zIndex = "1";
          s.setAttribute("d", path);
      });

      document.querySelectorAll(".spiral2").forEach((s) => {
          s.style.zIndex = "2";
          s.setAttribute("d", path2);
      });

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
    
    hoveredShapes.forEach(shape => {

      label = shape.label

      if (label != 'Rectangle Body') {
        bubble = document.getElementById(label)
        bubble.children[0].style.visibility = "visible"
      }

    });

    if (hoveredShapes.length == 0) {

      // document.getElementById(label).forEach()
      // bubble.children[0].style.visibility = "hidden"


      document.querySelectorAll(".park").forEach((b) => {
          b.children[0].style.visibility = "hidden"
      });

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
