var trex,trex_image;
var trex_collided;
var ground,ground2,ground_image;
var edges;
var cloud, cloud_image;
var obs1, obs2, obs3, obs4, obs5, obs6;
var all_obs;
var score = 0
var PLAY = 1;
var END= 0;
var gamestate = PLAY;
var clouds_group, obstacle_group;
var restart, restart_img, gameover, gameover_img;
var checkpoint, die, jump;
var highscore = 0;

function preload(){

trex_image = loadAnimation("trex1.png","trex3.png","trex4.png");

trex_collided = loadAnimation("trex_collided.png");

ground_image = loadImage("ground2.png");
  
cloud_image = loadImage("cloud.png");
  
obs1 = loadImage("obstacle1.png");
obs2 = loadImage("obstacle2.png");
obs3 = loadImage("obstacle3.png");
obs4 = loadImage("obstacle4.png");
obs5 = loadImage("obstacle5.png");
obs6 = loadImage("obstacle6.png");
  
restart_img = loadImage("restart.png");
gameover_img = loadImage("gameOver.png");

checkpoint = loadSound("checkPoint.mp3");
die = loadSound("die.mp3");
jump = loadSound("jump.mp3");
  
}



function setup(){

  createCanvas(600,250);
  edges = createEdgeSprites();
  
  trex = createSprite(40,240,20,20);
  trex.scale = 0.5;
  trex.addAnimation("running" , trex_image);
  
  ground = createSprite(300,240,600,10);
  ground.addImage(ground_image);
  
  ground2 = createSprite(300,245,600,10);
  ground2.visible = false;
  
  clouds_group = new Group();
  obstacle_group = new Group();
  
  trex.addAnimation("collide" , trex_collided);
  
  trex.debug = false;
  trex.setCollider("circle" , 0,0,50);
  
  restart = createSprite(300,168,30,30);
  restart.scale = 0.65;
  restart.addImage(restart_img);
    
  gameover = createSprite(300,130,30,30);
  gameover.scale = 0.65;
  gameover.addImage(gameover_img);
  
}

function draw(){

  background("white");
  drawSprites();
  
  if(gamestate === PLAY){
    ground.velocityX = -(6 + score/100);
    
    if(ground.x<0){
      ground.x = ground.width / 2;
    }
    
    if(keyDown("space") && trex.y > 212){
      trex.velocityY = -11;
      jump.play();
    }
    
    if(trex.isTouching(obstacle_group)){
      gamestate = END;
      die.play();
    }
    
    if(score % 100 === 0 && score > 0){
      checkpoint.play();
    }
    
    trex.velocityY = trex.velocityY + 0.7;
    
    spawn_clouds();
    obstacles();
    
    score = score + Math.round(frameRate() / 50);
    
    gameover.visible = false;
    restart.visible = false;
    
  }
  
  else if(gamestate === END){
   
    trex.velocityY = 0;
    ground.velocityX = 0;
    obstacle_group.setVelocityXEach(0);
    clouds_group.setVelocityXEach(0);
    obstacle_group.setLifetimeEach(-1);
    clouds_group.setLifetimeEach(-1);
    
    gameover.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
      reset();
    }
    
  }
  
  trex.collide(ground2);
  text("Score : " + score,500,20);
  //console.log("This is " , gamestate);
  
  text("Highscore : " + highscore, 50,20);
  
  if(score > highscore){
    highscore = score;
  }
  
}

function spawn_clouds(){
  
  if(frameCount % 100 === 0){
  
    cloud = createSprite(650,50,30,30);
    cloud.addImage(cloud_image);
    cloud.scale = 0.7;
    cloud.velocityX = -2;
    clouds_group.add(cloud);
    cloud.y = Math.round(random(10, 100));
    cloud.lifetime = 350;
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    //console.log(cloud.depth); 
    //console.log(trex.depth);
  }
}

function obstacles(){
  
  if(frameCount % 100 === 0){
    
  all_obs = createSprite(700,220,20,40);
  obstacle_group.add(all_obs);
  all_obs.scale = 0.5;
  all_obs.velocityX = -(6 + score/100);
  all_obs.lifetime = 240;
    
  var rand = Math.round(random(1,6));
  switch(rand){
  case 1 : all_obs.addImage(obs1);
  break;
  case 2 : all_obs.addImage(obs2);
  break;
  case 3 : all_obs.addImage(obs3);
  break;
  case 4 : all_obs.addImage(obs4);
  break;
  case 5 : all_obs.addImage(obs5);
  break;
  case 6 : all_obs.addImage(obs6);
  break;
  } 

  }
  
}

function reset(){
  
  gamestate = PLAY;
  trex.changeAnimation("running" , trex_image);
  obstacle_group.destroyEach();
  clouds_group.destroyEach();
  score = 0;
  
}

