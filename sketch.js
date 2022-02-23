var dog,sadDog,happyDog,garden,washroom, database, foodS, foodStock;
var dog_img, dog_img1;
var food, fedTime, lastFed, feed, addFood;
var nam
var gameState, readState;

function preload(){
  dog_img = loadImage('dogImg.png');
  dog_img1 = loadImage('dogImg1.png');
  garden=loadImage("img/Garden.png");
washroom=loadImage("img/WashRoom.png");
bedroom=loadImage("img/BedRoom.png");
}

function setup(){
  database = firebase.database();
  createCanvas(1000, 500);

  food = new Food();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  dog = createSprite(750, 300, 10, 10);
  dog.addImage(dog_img);
  dog.scale = 0.2;


  

  feed = createButton("Feed The Dog");
  feed.position(1000, 75);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(900, 75);
  addFood.mousePressed(addFoods);

  nam= prompt("What do you want to call you dog?");
}

function draw(){
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  // background(46, 139, 87);

  // fedTime = database.ref('FeedTime');
  // fedTime.on("value", function(data){
  //   lastFed = data.val();
  // });
  // push();
  // textSize(20)
  // fill("black")
  //   text("Feed " + nam + " some milk!",600,100);
  // textSize(20);
  // fill ("black");
  // if(lastFed >= 12){
  //   text("Last Fed: "+ lastFed % 12 + " PM", 350, 45);
  // }
  
  // else if(lastFed==0){
  //   text("Last Fed: 12 AM", 350, 45);
  // }
  
  // else{
  //   text("Last Fed: "+ lastFed + " AM", 350, 45);
  // }

  // food.display();
  // pop();
  // drawSprites();
}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dog_img1);

  food.updateFoodStock(food.getFoodStock() - 1);
  database.ref('/').update({
    Food: food.getFoodStock(),
    FeedTime: hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}