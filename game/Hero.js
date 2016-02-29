var Hero = function(stage,assetManager,ground){
    //init
    var touchingDown = false;
    var alive = true;
    //keep track of scope
    var me = this;
    var speed = 10;
    var gravity = 0.5;
    
    //custom event oground[i]jects
    var eventOnDeath = new createjs.Event("onDeath",true);
    var shape = new createjs.Shape();
    shape.type = "ground";
    //add hero to the world
    var sprite = assetManager.getSprite("assets");
    shape.graphics.beginFill("").drawRect(sprite.x + 90, sprite.y + 160, 100, 20);
    stage.addChild(sprite);
    stage.addChild(shape);
    console.log(sprite);
    //Move method.... implement movement class like Sean's example?
    
    //---------- GET/SET
    this.isAlive = function(){
        return alive;
    }
    
    
    this.getSprite = function(){
        return sprite;
    };
    
    this.getSpeed = function(){
        return speed;
    }
    
    //-------- public methods
    this.init = function(){
        alive = true;
        //stage.addChild(me);
    };
    
    this.walkRight = function(){
        sprite.x += speed;
    }
    
    this.walkLeft = function(){
        sprite.x -= speed;
    }
    
    this.run = function(){
        speed = 15;
    }
    
    this.walk = function(){
        speed = 10;
    }
    
    
    this.update = function(deltaTime){
        checkIfGrounded();
        console.log(touchingDown);
        if(!touchingDown){
            if(sprite.currentAnimation !== "boofAir"){
                sprite.gotoAndPlay("boofAir");
                console.log(sprite.currentAnimation);
            }
            //console.log(gravity * deltaTime);
            sprite.y += gravity * deltaTime;
        }
        shape.x = sprite.x;
        shape.y = sprite.y;
    }
    
    this.kill = function(){
        if(alive){
            alive = false;
            sprite.gotoAndPlay("boofDeath");
            sprite.addEventListener("animationend",onDeath);
        }
    }
    
    //--------------event handlers
    
    function onDeath(e){
        sprite.stop();
        e.remove();
        sprite.dispatchEvent(eventHeroKilled);
    }
    
    function checkIfGrounded(){
         if (
        (shape.y == (ground[0].y)) ||
        (shape.y > (ground[0].y + ground[0].height)) ||
        ((shape.x + shape.width) < ground[0].x) ||
        (shape.x > (ground[0].x + ground[0].width))
    ){
             touchingDown = true;
         }else{
             touchingDown = false;
         }
        console.log("Statement 1:"+ (shape.y) + " " + ground[0].y);
    }
}