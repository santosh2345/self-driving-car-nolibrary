class Road{
    constructor(x, width, laneCount=3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;
        this.left  = x-width/2;
        this.right = x +width/2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft= {x:this.left, y:this.top}; // this is the top left point of the road line and it is at infinity
        const topRight= {x:this.right, y:this.top}; // this is the top right point of the road line and it is also at infinity
        const bottomLeft= {x:this.left, y:this.bottom}; // this is also at infinity
        const bottomRight= {x:this.right, y:this.bottom}; // this is also at infinity


        //road borders point for the left two and right two
        this.borders =[
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ]
    }

    // making the road at the center of two edges
     getLaneCenter(laneIndex){
        const  laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2+ Math.min(laneIndex, this.laneCount-1)*laneWidth;
     }
    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";
         
        for(let i= 1 ; i<=this.laneCount-1 ; i++){ // for the all the number of lane calculating the lane line position linear interpolation is used that is defined inside the utils.js
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            )
       
            
        ctx.setLineDash([20,20])
        ctx.beginPath();
        ctx.moveTo(x, this.top);
        ctx.lineTo(x, this.bottom);
       

        ctx.stroke();
        } 
        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
    }
}


