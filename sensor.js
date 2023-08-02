class Sensor{
    constructor(car){
        this.car= car;
        this.rayCount= 5;              // number of sensors rays
        this.rayLength = 150;           // length of the ray
        this.raySpread = Math.PI/2;             // angle between the sensors rays

        this.rays= [];           // for storing the start and end point of the sensors rays.

        this.readings= [];  // for storing the minimum offsets

    }

    update(roadBorders, traffic){
      this.#castRays();  // here #function means these are the private function and can't be accessed by another function of class objects rather than update()
        this.readings=[];
      for(let i=0; i<this.rays.length; i++){   // for all the sensors lines or rays
        this.readings.push(
            this.#getReading(this.rays[i], roadBorders, traffic)
        )
      }
    }


    // this gives the rays with the minimum offsets
    // here offsets is the distance of intersecting point between sensor line and the road borders

    #getReading(ray, roadBorders, traffic){
       let touches = [];
       for(let i =0; i <roadBorders.length; i++){

        const touch = getIntersection(  // this calls the getIntersection func implemented inside util.js
            ray[0],                     // this is the start point of the ray (sensor line)
            ray[1],                     // this is the end point of the ray (sensor line)           
            roadBorders[i][0],          // this is the either top left or top right depending on the value of i
            roadBorders[i][1]           // this is the either bottom left of bottom right depending on the value of i
        )
        if(touch){                  // if intersection point found than pushed inside touches array
            touches.push(touch);
        }
        
       }


       // Detecting the collision between traffic and the car 
       
       for(let i =0; i<traffic.length;i++){
        const poly = traffic[i].polygon;
        for(let j=0; j<poly.length; j++){
            const value  = getIntersection(
                ray[0],
                ray[1],
                poly[j],
                poly[(j+1)%poly.length]
            );
            if(value){
                touches.push(value);
            }
        }
       }
       if(touches.length==0)     // if no intersection
       {
        return null;
       } else{                  // if intersection point exist
        // console.log("work")
        const offsets = touches.map(e => e.offset);         //returns all the offsets of the intersecting points returns from the getIntersection func 
        const minOffset= Math.min(...offsets);              // returns the minimun offeset from the offsets array, here (...offsets) is used because Math.min does not take array as parameter so we have to destructure it as individual value
        return touches.find(e=> e.offset == minOffset);     // returns all the intersecting points along with the offesets value that is matching to the minimum offset value

       }
    }

    #castRays(){ // this will spread the sensors line in different direction with the equal angle between each neighbour lines
        this.rays=[];
        for(let i=0; i<this.rayCount; i++){

            //here linear interpolation is used which is defined inside utils.js and that returns the intermediate angles for the sensors lines
            const rayAngle = lerp(this.raySpread/2,-this.raySpread/2, this.rayCount==1?0.5:i/(this.rayCount-1))+this.car.angle;

            const start = {x:this.car.x, y:this.car.y};  // this is the starting point of the sensor which is from the centor of the car
            const end = {               //this is an endpoint for the sensor line which is till the ray length
                x:this.car.x-Math.sin(rayAngle)*this.rayLength,  // here sin and cos uses the radian value
                y:this.car.y-Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]); // storing the start and end point of the sensor lines inside the rays array
        }
    }
    draw(ctx){
        // console.log(this.rayCount)
        for(let i = 0; i < this.rayCount; i++){         // for the each ray
            let end= this.rays[i][1];                   // firstly the end point of sensor line will be the default one we calculated above
            if(this.readings[i]){
                end = this.readings[i];             // for those sensor line which intersect with the roadBorders the end point will be that intersecting point
            }


        //  this draw the line from centor of the car to the intersecting point between sensor line and the roadBorders with the red color or whatever we provide the value to the strokeStyle  
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="red";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            // console.log(end.x,end.y)
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();


         // this is for visualizing where the sensors line could go if no intersection point was found out and it draw line from the end of the sensors line to the intersecting point between sensor line and the roadBorders
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="white";
            ctx.moveTo(
               
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}