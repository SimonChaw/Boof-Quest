var Hero = function(stage,assetManager,ground){
    //init
    var touchingDown = false;
    var alive = true;
    //keep track of scope
    var me = this;
    var speed = 10;
    var gravity = 0.5;
    
    //custom event oground[i]jects
    collisionMethod = ndgmr.checkRectCollision;
    var eventOnDeath = new createjs.Event("onDeath",true);
    //add hero to the world
    var sprite = assetManager.getSprite("assets");
    sprite.x = 0;
    sprite.y = 0;
    stage.addChild(sprite);
    var image = new Image();
    image.src = "assets/hitbox.png";
    var hitbox = new createjs.Bitmap(image);
    hitbox.x = sprite.x + 90;
    hitbox.y = sprite.y + 150;
    hitbox.scaleX = 0.4;
    hitbox.scaleY = 0.3;
    hitbox.visible = false;
    stage.addChild(hitbox);
    
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
        console.log(sprite.currentAnimation);
        checkIfGrounded();
        //console.log(touchingDown);
        if(!touchingDown){
            playIfNotPlaying("boofAir");
            //console.log(gravity * deltaTime);
            sprite.y += gravity * deltaTime;
        }else{
            stopIfPlaying("boofAir");
        }
        hitbox.x = sprite.x + 90;
        hitbox.y = sprite.y + 150;
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
        for(var i = 0;i<ground.length;i++){
        var intersection = ndgmr.checkRectCollision(hitbox,ground[i]);
            if(intersection !== null){
                touchingDown = true;
                break;
            }else{
                touchingDown = false;
            }
        }
    }
    
    function playIfNotPlaying(animationName){
        if(sprite.currentAnimation !== animationName){
            sprite.gotoAndPlay(animationName);
        }
    }
    
    function stopIfPlaying(animationName){
        if(sprite.currentAnimation == animationName){
            sprite.stop();
        }
    }
}