var rabbit={}

rabbit.speak= function(line){
   printt("the rabbit says '"+line+"'")
rabbit.age=15
}

function speak(line){
    printt("The "+this.adjective+" rabbit "+"says "+line+". I'm "+this.age+"!")
}

var whiteRabbit={adjective:"white",speak: speak, age:14}

whiteRabbit.speak("Hi")
rabbit.speak("howdy!")

function printt(line){
    var div = document.createElement("div");
    div.innerHTML=line
    document.body.appendChild(div);
}

//a constructor
function Rabbit(adjective,age){
    this.adjective=adjective;
    this.age=age
    this.speak=function(line){
        printt("The "+this.adjective+" rabbit says '"+line+"'.");
    };
}
//this doesn't work!
function delayspeak(){
    window.setTimeout(rabbit.speak("late howdy"),10000)
}
delayspeak()

