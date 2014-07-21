var LINEWIDTH=30;
var mainCanvas = document.getElementById("canvas");
var mainContext = mainCanvas.getContext('2d');
GRIDSIZE=20
mainCanvas.width=Math.round(LINEWIDTH*GRIDSIZE)
mainCanvas.height=LINEWIDTH*GRIDSIZE
var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.height;
 
// depending on your browser, the right version of the rAF function will be returned...I hope
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


function snap(pt,dir){
    //dir tells if we should jump in any direction
    
    dirs=['up','down','left','right'];
    if(pt.length>1){
        newpt=new Array;
        for(var i=0;i<pt.length;i++){
            //pt[i]=Math.round(pt[i]);
            //remaind=pt[i]%LINEWIDTH;
            //pt[i]=pt[i]-remaind
            //grid coordinate
            x_grid=Math.floor(pt[i]/LINEWIDTH);
            if(i==0 && dir=='left'){x_grid-=1;}
            else if(i==0 && dir=='right'){x_grid+=1;}
            else if(i==1 && dir=='down'){x_grid+=1;}
            else if(i==1 && dir=='up'){x_grid-=1;}    
            //now snap it to the center of a grid square!
            newpt[i]=LINEWIDTH*(1.0/2+x_grid);
        }
    }
    else{
        x_grid=Math.floor(pt/LINEWIDTH);
            //now snap it to the center of a grid square!
        newpt=LINEWIDTH*(1.0/2+x_grid);
    }
    return newpt;
}

function Snake(){
    this.head=snap([canvasWidth/2,canvasHeight/2]);    
    this.direction='left';
    this.speed=2.5;
    this.length=LINEWIDTH*8;
    this.tail=snap([canvasWidth/2+this.length,canvasHeight/2]);
    this.path=[this.head,this.tail];
    this.previous_snap_pt=snap(this.head);//keeps track of the last place head snapped to 
}

function Score(){
    this.value=0;

}

function Apple(){
    //x=Math.floor(Math.random()*GRIDSIZE);
    //y=Math.floor(Math.random()*GRIDSIZE);
    
    this.location=snap([Math.random()*(canvasHeight-LINEWIDTH)+LINEWIDTH/2,
                        Math.random()*(canvasHeight-LINEWIDTH)+LINEWIDTH/2]);
}

Apple.prototype.update=function(respawn){
    if(respawn==true){
        this.location=snap([Math.random()*(canvasHeight-LINEWIDTH)+LINEWIDTH/2,
                            Math.random()*(canvasHeight-LINEWIDTH)+LINEWIDTH/2]);
    //make sure the apple isn't "on" the snake
            if(snake.point_intersect(this.location)){
               //console.log('I had to move the apple!')
                this.update(true);
            }

    }
    //console.log(this.location)
    mainContext.fillStyle = 'rgba(170, 0, 95, .8)';
    mainContext.fillRect(this.location[0]-LINEWIDTH/2,this.location[1]-LINEWIDTH/2,LINEWIDTH,LINEWIDTH);

}

Score.prototype.update=function(){
    
    mainContext.fillStyle = 'rgba(170, 170, 255, .9)';
    mainContext.font=1.5*LINEWIDTH+"px Georgia";
    mainContext.fillText(this.value,2*LINEWIDTH,2*LINEWIDTH);


}

var pressedKey; //I don't know why, but this needs to be global

function opposite(dir){
    if(dir=='left'){return 'right';}
    if(dir=='right'){return 'left';}
    if(dir=='up'){return 'down';}
    if(dir=='down'){return 'up';}
}

function arrayEqual(arr1,arr2){
    console.log('arr1: '+arr1+' arr2: '+arr2)
    if(arr1.length!=arr2.length){
        return false;
    }
    for(var i; i<arr1.length;i++){
        if(arr1[i]!=arr2[i]){
            return false;
        }
    }
    return true;
}

Snake.prototype.point_intersect=function(pt){
    //for each segment in the path, determine if the head is touching it:
    
    
    if(pt==null){
        pt=this.head;
        start_ind=3; //can't intersect itself in the first 3 segments 
    }
    else{
        start_ind=1
    }

    pt=snap(pt);
    for(var n=start_ind;n<this.path.length;n++){
            startSegment=snap(this.path[n-1]);
            endSegment=this.path[n];
            //some easy math
            //if it's not a vertical line
            if(startSegment[0]!=endSegment[0]){
                t=(pt[0]-startSegment[0]+0.0)/(endSegment[0]-startSegment[0]+0.0);
                p1=startSegment[1];//+t*(endSegment[1]-startSegment[1]);
                if(pt[1]==p1 && 0<t && t<=1){
                    console.log('the snake collided with itself '+t+' v ');
                    console.log('in segment '+n)
                    return true;
                }

            }
            //it's not horizontal (so it's vertical)
            if(startSegment[1]!=endSegment[1]){
                t=(pt[1]-startSegment[1]+0.0)/(endSegment[1]-startSegment[1]+0.0);
                p0=startSegment[0];//+t*(endSegment[0]-startSegment[0]);
                if(pt[0]===p0 && 0<t && t<=1){
                    console.log('the snake collided with itself'+t+' h ');
                    console.log('in segment '+n)
                    return true;
                }
            }
        }
        return false;    
}

Snake.prototype.move = function () {

    //move the head
    if(this.direction=='left'){
        this.head=[this.head[0]-this.speed,this.head[1]];
        //this.head[0]-=this.speed;
    }
    if(this.direction=='right'){
        this.head=[this.head[0]+this.speed,this.head[1]];
    }
    if(this.direction=='up'){
        this.head=[this.head[0],this.head[1]-this.speed];
    }
    if(this.direction=='down'){
        this.head=[this.head[0],this.head[1]+this.speed];
    }

    this.path[0]=this.head;

}

//i never use this function
d_to_next_snap=function(head,dir){
    //gives the last place the head snapped to
    if(dir=='up'){
        d=snap(head[1])-head[1];
        if(d>0){
            return LINEWIDTH-d
        }
        else return -d    
    }
    if(dir=='down'){
        d=snap(head[1])-head[1];
        if(d<0){
            return LINEWIDTH+d;
        }
        else return d;    
    }
    if(dir=='right'){
        d=snap(head[0])-head[0];
        if(d>0){
            return LINEWIDTH-d
        }
        else return -d    
    }
    if(dir=='left'){
        d=snap(head[0])-head[0];
        if(d<0){
            return LINEWIDTH+d;
        }
        else return d;    
    }

}

function segmentLen(pt1, pt2){
        //only words for vertical or horizontal lines
        d=[];
        for(i=0;i<pt1.length;i++){
            d[i]=Math.abs(pt1[i]-pt2[i])    
        }
        return Math.max(d[0],d[1]);
}

Snake.prototype.update = function () {

    //move the head
    this.move();
    //console.log(d_to_next_snap(this.head,this.direction));
    //look for a collision
    if(snap(snake.head[0])==apple.location[0]&&snap(snake.head[1])==apple.location[1]){
        score.value+=10;
        apple.update(true);
        snake.length+=LINEWIDTH*3
        snake.speed+=.15
    }

    //check for pressed key and possibly change direction
    window.onkeydown=function(e){
        code=e.keyCode;
        if(code==37){pressedKey='left';}
        else if(code==38){pressedKey='up';}
        else if(code==39){pressedKey='right';}
        else if(code==40){pressedKey='down';}
    }

    directions=['up','down','left','right'];
    for(var i=0;i<4;i++){
        dir=directions[i];
        if(pressedKey==dir){
            if(this.direction!=opposite(dir) && this.direction!=dir){
                
                //prepend new vertex to the path
                //we want even tiny paths to count
                
                //d=d_to_next_snap(this.head, this.direction);
                d=segmentLen(this.path[0],this.path[1])
                console.log(' d is '+d+' head: '+this.head);

                if(d<LINEWIDTH/2)// if it's a very small segment
                    {   //gives it an extra push so we don't have tiny path lengths
                        this.path.unshift(snap(this.head));
                        
                        console.log('pushed it a bit: '+this.direction)
                        
                        //console.log('going '+this.direction)
                        this.head=snap(this.head,this.direction);
                    }
                else{
                    this.head=snap(this.head);//snaphead;
                }
                this.head=snap(this.head);
                this.path.unshift(snap(this.head));
                this.path.unshift(snap(this.head));
                //console.log('prepended path point: '+this.path[0])
                //change direction
                this.direction=dir;
                

            }
            pressedKey=null;
            break; //we already know this key was pressed
        }

    }


    length_so_far=0;
    var pathSegmentStart;
    var pathSegmentEnd;
    //make a new path starting with the head
    newPath=[this.head];

    for (var i = 0; i < this.path.length-1; i++){
        pathSegmentStart=this.path[i];
        if(i==0){pathSegmentStart=this.head;}
        pathSegmentEnd=this.path[i+1]; //can be a vertical or horizontal piece
        
        segmentLength=Math.abs(pathSegmentStart[0]-pathSegmentEnd[0])+Math.abs(pathSegmentStart[1]-pathSegmentEnd[1])
        //see if the next segment 'fits'
        if(length_so_far+segmentLength<=this.length){
            //if it fits, append this last endpoint
            newPath[newPath.length]=snap(pathSegmentEnd);
            //increase the amount of room taken up so far
            length_so_far+=segmentLength;
        }
        //otherwise truncate the remaining segment
        else{
            //let 'remainder' keep track of how much we can 'fit'
            var remainder=this.length-length_so_far+0.0;

            if(remainder>0){
                //shorten this last piece
                //if it's vertical
                if(pathSegmentStart[1]>pathSegmentEnd[1] || pathSegmentStart[0]>pathSegmentEnd[0])
                    {helperSign=1;}
                else{helperSign=-1;}
                if(pathSegmentEnd[0]==pathSegmentStart[0]){
                    newPath[newPath.length]=[pathSegmentEnd[0],pathSegmentStart[1]-helperSign*remainder]
                }
                //if it's horizontal
                if(pathSegmentEnd[1]==pathSegmentStart[1]){
                    newPath[newPath.length]=([pathSegmentStart[0]-helperSign*remainder,pathSegmentEnd[1]])
                }
            }
            break;
        }
    }
    this.path=newPath;
    this.draw();


    pressedKey=null;
    //check for collision with wall
    if(snap(this.head[0])<=0 || 
        snap(this.head[0])>=canvasWidth||
        snap(this.head[1])<=0||
        snap(this.head[1])>=canvasHeight){
        return false
    }
    //check for collision with itself
    if(this.point_intersect()){
        return false
    }

    return true;
}

Snake.prototype.draw=function(){
    //show the path
    mainContext.beginPath();
    mainContext.moveTo(snap(this.head[0]),snap(this.head[1]));
    for (var i = 1; i < this.path.length; i++){
        //pathSegmentStart=this.path[i];
        pathSegmentEnd=snap(this.path[i]); //can be a vertical or horizontal piece
        mainContext.lineTo(snap(pathSegmentEnd[0]),snap(pathSegmentEnd[1]));
    }
    mainContext.fillStyle = 'rgba(177, 0, 129, .9)';
    mainContext.lineCap="round";
    mainContext.lineJoin='round'
    mainContext.lineWidth=LINEWIDTH*.9;    
    mainContext.stroke();

}

snake=new Snake;
score=new Score;
apple=new Apple;

function startGame(){
    requestAnimationFrame(draw);
}

function EndGameScreen(){
    

    mainContext.font=LINEWIDTH+"px Georgia";
    mainContext.fillText("Game Over!",canvasWidth/2-100,canvasHeight/2);
    
    mainContext.font=LINEWIDTH*.75+"px Georgia";
    mainContext.fillText("again! again!",canvasWidth/2-80,canvasHeight/2+50);

    mainCanvas.addEventListener("mousemove",againHiLight,false)

    function againHiLight(event){
        console.log('you\'re at' +event.pageX+', '+event.pageY);
        x=event.pageX;y=event.pageY;
        if(Math.abs(canvasWidth/2-x)<50 && Math.abs(canvasWidth/2+25-y)<30) {
            mainContext.font=LINEWIDTH*.75+"px Georgia";
            mainContext.fillStyle = 'rgba(170, 170, 255, .9)';
            mainContext.fillText("again! again!",canvasWidth/2-80,canvasHeight/2+50);
        }
        else{
            mainContext.font=LINEWIDTH*.75+"px Georgia";
            mainContext.fillStyle = 'rgba(170, 0,255, .8)';
            mainContext.fillText("again! again!",canvasWidth/2-80,canvasHeight/2+50);

        }
    }   

}

function draw(){
    mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
    mainContext.fillStyle = '#F6F6F6';
    mainContext.fillRect(0, 0, canvasWidth, canvasHeight);

    
    if(!snake.update()){
        EndGameScreen()
        score.update();
;    }
    else{ 
    score.update(); //also detects a collision with apple
    apple.update();
    requestAnimationFrame(draw);
    }
}

var scoreCanvas = document.getElementById("scoreCanvas");
var scoreContext = scoreCanvas.getContext('2d');

