
// this is the linear interpolation for finding the intermediate points for given start point and end point
function lerp(A,B,t){
    return A+(B-A)*t; 
}



// getIntersection is the function that returns the intersecting points if two lines intersect along with the offset that stores the distance from the center of the car.x to the roadBorders 
// so that we will know how far is the intersecting point is more details on the sensors.js
function getIntersection(A,B,C,D){
    const tTop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);

    if(bottom!=0){ // checking bottom is zero or not if zero we can't divide by 0 that results in infinity
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x, B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t

            }
        }
    }
    return null;
}


// this the intersecting points for the
function polysIntersect(poly1, poly2)
{

    // console.log(poly1.length) 
    for(let i =0; i<poly1.length; i++ )
    {

        for(let j =0; j<poly2.length; j++){
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}