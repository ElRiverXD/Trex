var checkpointSound;
var jumpSound,dieSound;
var restart,restart_Image;
var gameOver,gameOver_Img;
var cactusGroup,cloudsGroup;
var Score=0;
var rand;
var Cactus1,Cactus2,Cactus3,Cactus4,Cactus5,Cactus6;
var END=0;
var PLAY=1;
var gameState=PLAY; 
var cloud,cloudImg;
var edges;
var ground,groundImg,groundInvisible;
var trex,trex_running,trex_collided;

function preload(){
  groundImg = loadImage("ground2.png");
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  cloudImg = loadImage("cloud.png");
  Cactus1 = loadImage("obstacle1.png");
  Cactus2 = loadImage("obstacle2.png");
  Cactus3 = loadImage("obstacle3.png");
  Cactus4 = loadImage("obstacle4.png");
  Cactus5 = loadImage("obstacle5.png");
  Cactus6 = loadImage("obstacle6.png");
  trex_collided = loadImage("trex_collided-1.png");
  gameOver_Img = loadImage("gameOver.png");
  restart_Image = loadImage("restart.png");
  
  jumpSound = loadSound("jump.wav");
  dieSound = loadSound("die.wav");
  checkpointSound = loadSound("checkpoint.wav");
  
}

function setup(){
  createCanvas(600,200)
  
  //Crea el sprite del Trex
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale=0.4;
  
  ground = createSprite(300,170,600,20);
  ground.addImage(groundImg);
  groundInvisible = createSprite(300,195,600,20);
  groundInvisible.visible=false;
  var rand=Math.round(random(1,100));
  
  gameOver=createSprite(300,100);
  gameOver.addImage(gameOver_Img);
  
  restart=createSprite(300,150);
  restart.addImage(restart_Image);
  restart.scale=0.5
  
  
//  console.log(rand)
  edges=createEdgeSprites();
  
  cactusGroup=new Group();
  cloudsGroup=new Group();

  /*trex.debug=true; 
  trex.setCollider("circle",2 ,2,30);*/
  
}

function draw(){
  background("white")
  
  text("Score: "+Score,500,50);

  if(gameState==PLAY){
    
    if(Score>0&&Score%500==0){
      checkpointSound.play();
    }
    
    Score=Score+Math.round(getFrameRate()/60);
    
    ground.velocityX=-(2+Score/100);
    
      //saltos del Trex
    if(keyDown("space") && trex.y>160 ){
      trex.velocityY=-12;
      jumpSound.play();
     }
    trex.velocityY=trex.velocityY+0.6;
          
    if(ground.x<0){
      ground.x=ground.width/2;
     }
    
    if(cactusGroup.isTouching(trex)){
      gameState=END;
      dieSound.play();
    }
    
    gameOver.visible=false;
    restart.visible=false;
    
  spawnClouds();
  
  spawnCactus();
    
  }
  
  else if(gameState==END){
    ground.velocityX=0;
    trex.changeAnimation("collided",trex_collided);
    cactusGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cactusGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    gameOver.visible=true;
    restart.visible=true;
    if(mousePressedOver(restart)){
    reset();
  }

  }

  //console.log(frameCount);
  
  //evita que el Trex caiga 
  trex.collide([groundInvisible]);
  

  
  drawSprites();

}

 function reset(){
   gameState=PLAY
   gameOver.visible=false;
   restart.visible=false;
   cactusGroup.destroyEach();
   cloudsGroup.destroyEach();
   trex.changeAnimation("running", trex_running);
   Score=0;
 }

function spawnClouds(){
  if(frameCount % 60==0){
  
    cloud = createSprite(550,50,40,10);
    cloud.velocityX=-2;  
    cloud.addImage(cloudImg);
    cloud.y=Math.round(random(10,60));
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    cloud.lifetime=300;
    cloudsGroup.add(cloud);
    
  }
     
}

function spawnCactus(){
  if(frameCount % 80==0){

  Cactus = createSprite(550,170,20,10);
  Cactus.velocityX=-(4+Score/100);
  rand = Math.round(random(1,6));
  switch(rand){
    case 1: Cactus.addImage(Cactus1);
      break;
          case 2: Cactus.addImage(Cactus2);
      break;
          case 3: Cactus.addImage(Cactus3);
      break;
          case 4: Cactus.addImage(Cactus4);
      break;
          case 5: Cactus.addImage(Cactus5);
      break;
          case 6: Cactus.addImage(Cactus6);
      break;
      default:break;
  }
  Cactus.lifetime=300;
  Cactus.scale=0.4 ;
    cactusGroup.add(Cactus);
  }
}