class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3, color="yellow") {
    //defining the neccessary properties for the car
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damage = false;
    this.cType = controlType;
    this.useBrain = controlType == "AI"; // here if controlType is AI then the neccassary key that is given by the neural network and the brain.js

    if (controlType != "DUMMY") {
      // only creating sensor line if the car is not a dummy

      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork(
        [this.sensor.rayCount, 6, 4] //these  rayCount = input neurons, 6 = hidden neurons, 4 = output neurons
      );
    }
    this.controls = new Controls(controlType);

    this.img = new Image();
    this.img.src = "car.png";

    this.mask = document.createElement("canvas")
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext("2d")  // creating a new canvas for the mask

    // using arrow function  to refer the above object (car) inside the function with "this"
    // here is onload used to wait for the image to load before animation starts
    this.img.onload = () =>{  
        maskCtx.fillStyle = color;  // color of car
        maskCtx.rect(0,0,this.width,this.height)   // creating a rectangle with the color given 
        maskCtx.fill()

        maskCtx.globalCompositeOperation= "destination-atop"  // it's going to keep the given color for the car only where it overlaps with the visible pixel of the car image
        maskCtx.drawImage(this.img,0,0,this.width, this.height)
    }
  }
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon(); // creating the polygon , we can make it of desired size i mean desired sides and shapes
      this.damaged = this.#assessDamage(roadBorders, traffic); // this will return true if damage occurs between object(car) and road borders
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(
        (s) => (s == null ? 0 : 1 - s.offset) // returning low value(0) if the object is far away and there's no intersection between car's sensor and other object and returning high value if other object is closed and sensor detects it
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      //   console.log(outputs)

      if (this.useBrain) {
        this.controls.forward = true; // outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }
  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      // for eacht borders the intersecting points are calculated
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      // for each traffic the intersecting points are calculated
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false; // return false if no intersecting point found between roadBorderes and the car.
  }

  #createPolygon() {
    const points = []; //an array for storing the points of the polygon(car)
    const rad = Math.hypot(this.width, this.height) / 2; // this is the radius of hypotenus/2 of the car as a radius, diagonal divided by 2
    const alpha = Math.atan2(this.width, this.height); //  this gives the arc tangent based on the width and height
    points.push({
      // now pushing thea all 4 co-ordinates of the car inside the points and returning it to the polygon
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration; // increase the speed with time
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration; // this will give negative acceleration so that it will make car to move reverse
    }
    if (this.speed > this.maxSpeed ) {
      
      
      if(this.cType == "AI" || this.cType =="DUMMY"){ // only make constant speed for the dummy and Ai
        this.speed = this.maxSpeed; // the speed will be constant when it reaches to the max speed
      }
      else{
        this.speed += 0.01 // while user is playing than the speed is increased by 0.1 
      }
   

    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction; // this makes car slowdown if key released
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(ctx, drawSensor = false) {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx); // now car can draw its sensor lines from its own center points
    }
    // this is all commented out for using the car.png
    //     if(this.damaged){
    //         ctx.fillStyle = "gray";

    //     }

    //     else{
    //         ctx.fillStyle = color;
    //     }

    //    ctx.beginPath();  // starting the path line
    //    ctx.moveTo(this.polygon[0].x,this.polygon[0].y);  // for the first co-ordinate
    //    for(let i =1; i<this.polygon.length; i++){
    //     ctx.lineTo(this.polygon[i].x,this.polygon[i].y); // for the rest of the co-ordinates
    //    }
    //    ctx.fill() //filling the car with the color default "black" we can customize with different color we want

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

      if(!this.damaged)
      {

        //for drawImage function: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        ctx.drawImage(  // this will draw the given colored object with the shape of img that is car
          this.mask,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
    
        ctx.globalCompositeOperation= "multiply"  // now this will actually make our car with the given colored
      }



    ctx.drawImage(
        this.img,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    ctx.restore();


  }
}
