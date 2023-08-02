
class NeuralNetwork{
    constructor(neuronCounts){ // this takes an array of number of neurons per layer
         this.levels = [];  // this will stores the array of level that is defined below in level class
         for(let i = 0 ; i<neuronCounts.length-1; i++){    // for all layer
            this.levels.push(new Level(             // pushing the output returned from the level class  
                neuronCounts[i],neuronCounts[i+1]       //passing two consecutive layer's number of neurons number
            ));
         } 
    }
    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(        //this calls the feedforward function of the level for the given input and network
            givenInputs, network.levels[0]);    // this returns the outputs for the first level from the feedForward function of the level class
            for(let i =1; i<network.levels.length; i++){    //for the rest of the layers
                outputs = Level.feedForward(        // reseting the outputs for the next layers because we only need the outputs of the last layer so intermediate outputs will be replace by forward layers
                    outputs,network.levels[i]       // this is just calling for the feedForward func of the level class for the rest of the layers than level 0 which already called above
                );                // also this is the calling for the feedForward func of the level class with the previous output as the new input for the next layer
            }
        return outputs;             // now returning the final output of the output layer 
    }

    static mutate(network, amount = 1){
        network.levels.forEach(level =>{
            for(let i = 0; i < level.biases.length; i++){
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i = 0 ; i <level.weights.length; i++){
                for(let j = 0 ; j<level.weights[i].length; j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        })
    }
}

   

class Level{
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);  // inputs
        this.outputs   = new Array(outputCount); //outputs
        this.biases  = new Array(outputCount);    //biases

        this.weights = [];          //array for assigning weight between each input and output path
        for(let i = 0; i<inputCount; i++){
            this.weights[i] = new Array(outputCount); // creating array of output size for each input, this is like array inside an array
        }
        Level.#randomize(this);  
    }
    static #randomize(level){ // this function assigns random weight to the each input output path initially
        for(let i = 0 ; i<level.inputs.length; i++){  // for each input
            for(let j = 0 ; j<level.outputs.length; j++){  // for each output
                level.weights[i][j] = Math.random()*2-1; // this will give value between -1 and 1, Math.random() gives value between 0 and 1 
            }
        }

        // now assigning the random values between -1 and 1 to the biases like to the weights
        for(let i = 0 ; i<level.biases.length; i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    // to compute the output based on the bias and the weights feed-forward algorithm is used.
    static feedForward(givenInputs, level){
        for(let i = 0; i<level.inputs.length; i++){
            level.inputs[i] = givenInputs[i]; 
        }

        for(let i=0; i<level.outputs.length; i++){
            let sum = 0 ; 
            for(let j =0; j<level.inputs.length; j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }
            if(sum>level.biases[i]){
                level.outputs[i]= 1;
            } else {
                level.outputs[i] = 0 ; 
            }
        }
        return level.outputs 

    }
}