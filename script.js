// for the carCanvas
const carCanvas = document.getElementById("carCanvas")

   

carCanvas.width = 200;

// for the network Canvas
const networkCanvas = document.getElementById("networkCanvas")
carCanvas.width = 300;  

//getting ctx from the canvas which contains lot of methods for drawing objects.
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

// for storing the bestCar in the local storage so that the current state ramains if browser is closed
function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));


}
const savecarnumber =()=>{
    
      // Get the value from the input field
  const userInputValue = document.getElementById('carNumberr').value;
    
  // Check if the user entered a number (optional)


      if (!userInputValue || userInputValue>100) {
          alert('Please enter a valid number.');
          return;
        }
    
    else{

        // Store the value in local storage
        localStorage.setItem('userNumber', userInputValue);
      
        // Optionally, you can provide a success message to the user
        alert('Car Number saved ');
    }

   
//   console.log(userInputValue)

}


// for deleting the bestCar history from the local storage
function discard(){
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("userNumber");
}



const carNumber = localStorage.getItem("userNumber")



let N=1;  // DEFAULT value of a car

    if(carNumber){
        

        N = carNumber // this is the number of AI cars going to be generated  in parallel
    }

    document.getElementById('carNumberr').value = N


    let isChecked;


    // for the player either user (keys) or AI
  const handlePlayer = () =>{
    isChecked = document.getElementById('player').checked;
    // console.log(isChecked)
  
  
          if(isChecked){
              localStorage.setItem("player","KEYS")
          }
          else{
              localStorage.setItem("player","AI")
          }
        //   console.log(localStorage.getItem("player"))
  
      }

   
    let player = localStorage.getItem("player")

    if(!player){
        player = "AI";
    }

    if(player== 'KEYS'){

        document.getElementById('player').checked = true
    } 
    else{
        document.getElementById('player').checked = false

    }






const cars = generateCars(N);


let bestCar =  cars[0]; // storing the first car and will be adding more to it
// console.log(localStorage.getItem("bestBrain"))
if(localStorage.getItem("bestBrain")){
    for(let i = 0 ; i<cars.length; i++){
        // console.log("called")
        cars[i].brain = JSON.parse( // setting all the car's brain to the bestCar's brain from the local storage
             localStorage.getItem("bestBrain"))
            //  console.log(cars[i].brain)
             if(i!=0){
                NeuralNetwork.mutate(cars[i].brain,0.1)
             }
    }
    
}


// generating traffic for AI and user , here more traffic when user is playing
const traffic = player=="AI"? [ 
    new Car(road.getLaneCenter(1),-100,30,50, "DUMMY",2,"red"), // for generating N number of cars
    new Car(road.getLaneCenter(0),-300,30,50, "DUMMY",2,"deeppink") ,// for generating N number of cars
    new Car(road.getLaneCenter(2),-300,30,50, "DUMMY",2, "orange"), // for generating N number of cars
    new Car(road.getLaneCenter(0),-500,30,50, "DUMMY",2, "magenta") ,// for generating N number of cars
    new Car(road.getLaneCenter(1),-500,30,50, "DUMMY",2, "lime"), // for generating N number of cars
    new Car(road.getLaneCenter(1),-700,30,50, "DUMMY",2, "cyan") ,// for generating N number of cars
    new Car(road.getLaneCenter(2),-700,30,50, "DUMMY",2, "yellowgreen") // for generating N number of cars

]:
[ 
    new Car(road.getLaneCenter(1),-100,30,50, "DUMMY",2,"red"), // for generating N number of cars
    new Car(road.getLaneCenter(0),-300,30,50, "DUMMY",2,"deeppink") ,// for generating N number of cars
    new Car(road.getLaneCenter(2),-300,30,50, "DUMMY",2, "orange"), // for generating N number of cars
    new Car(road.getLaneCenter(0),-500,30,50, "DUMMY",2, "magenta") ,// for generating N number of cars
    new Car(road.getLaneCenter(1),-500,30,50, "DUMMY",2, "lime"), // for generating N number of cars
    new Car(road.getLaneCenter(1),-700,30,50, "DUMMY",2, "cyan") ,// for generating N number of cars
    new Car(road.getLaneCenter(2),-700,30,50, "DUMMY",2, "yellowgreen"), // for generating N number of cars

    new Car(road.getLaneCenter(0),-900,30,50, "DUMMY",2,"red"), // for generating N number of cars
    new Car(road.getLaneCenter(1),-1000,30,50, "DUMMY",2,"deeppink") ,// for generating N number of cars
    new Car(road.getLaneCenter(2),-950,30,50, "DUMMY",2, "orange"), // for generating N number of cars
    new Car(road.getLaneCenter(0),-1100,30,50, "DUMMY",2, "magenta") ,// for generating N number of cars
    new Car(road.getLaneCenter(1),-1200,30,50, "DUMMY",2, "lime"), // for generating N number of cars
    new Car(road.getLaneCenter(0),-1400,30,50, "DUMMY",2, "cyan") ,// for generating N number of cars
    new Car(road.getLaneCenter(2),-1500,30,50, "DUMMY",2, "yellowgreen") // for generating N number of cars

]
;
animate();









function generateCars(N){
    const cars = [];
    for(let i = 1; i<= N ; i++){
      

            cars.push(new Car(road.getLaneCenter(1),100,30,50, player)) //road.getLaneCenter(1) = x, 100 = y, 30 = width, 50= height
    //    console.log(localStorage.getItem("player"))
    }
    return cars;
}

function animate(time){
    for(let i =0; i<traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i = 0 ; i<cars.length ; i++){

        cars[i].update(road.borders, traffic); //updates the road borders while animating
    }

     bestCar = cars.find( c=> c.y == Math.min(...cars.map(c=>c.y)));  // here all best car stores the best cars with the minimum value of y

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save(); // this saves the ctx properties until next changes and repeat
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    road.draw(carCtx);
    for(let i =  0 ; i<traffic.length; i++){
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha = 0.2; // for the transparent looks of the parallaly generated cars
    for(let i = 0 ; i<cars.length ; i++){ // for all the AI cars
    cars[i].draw(carCtx,"yellow");
    }
    carCtx.globalAlpha = 1; 
    bestCar.draw(carCtx,"yellow",true);
    carCtx.restore();

    networkCtx.lineDashOffset = -time/50; // this is for speed of animation in visualiser of feedforward network
    Visualizer.drawNetwork(networkCtx, bestCar.brain); // this is for drawing the current neural network visuallization
    requestAnimationFrame(animate); // this makes animate for the infinite loop so that changes can be seen as a animations

}