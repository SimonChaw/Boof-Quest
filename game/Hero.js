var Hero = function(stage,assetManager,ground){
    //init
    var touchingDown = false;
    var isJumping = false;
    var alive = true;
    //keep track of scope
    var me = this;
    var speed = 10;
    var gravity = 0.5;
    var maxJumpForce = 5;
    var currentJumpForce = 0;
    var maxHeight;
    var controller;
    var eventOnDeath = new createjs.Event("onDeath",true);
    //add hero to the world
    var sprite = assetManager.getSprite("assets");
    sprite.x = 0;
    sprite.y = 0;
    sprite.type = "boof";
    stage.addChild(sprite);
    var image = new Image();
    image.src = "assets/hitbox.png";
    var hitbox = new createjs.Bitmap(image);
    hitbox.scaleX = 0.4;
    hitbox.scaleY = 0.3;
    hitbox.type = "feet";
    hitbox.visible = false;
    var bodyBox = new createjs.Bitmap(image);
    bodyBox.scaleX = 0.55;
    bodyBox.scaleY = 1.2;
    bodyBox.type = "body";
    bodyBox.visible = false;
    stage.addChild(bodyBox);
    stage.addChild(hitbox);
    
    //Move method.... implement movement class like Sean's example?
    
    //---------- GET/SET
    this.isAlive = function(){
        return alive;
    }
    
    this.getController = function(){
        return controller;
    }
    
    this.isTouchingDown = function(){
        return touchingDown;
    }
    
    this.getSprite = function(){
        return sprite;
    };
    
    this.getSpeed = function(){
        return speed;
    }
    
    //-------- public methods
    this.init = function(){
        maxHeight = false;
        alive = true;
        controller = new Controller(me);
        controller.init();
        //stage.addChild(me);
    };
    
    this.walkLeft = function(){
        sprite.regX = 280;
        sprite.scaleX = -1;
        sprite.x -= speed;
    }
    
    this.walkRight = function(){
        sprite.regX = 0;
        sprite.scaleX = 1;
        sprite.x += speed;
    }
    
    this.startJump = function(){
        if(touchingDown){
            sprite.gotoAndPlay("boofJumpStart");
            sprite.addEventListener("animationend",jump);
        }
    }
    
    this.jump = function(jumping){
        if(jumping && currentJumpForce !== maxJumpForce){
            currentJumpForce += 1;
            if(currentJumpForce === maxJumpForce){
                maxHeight = true;
            }
        }else if(!jumping || maxHeight){
            currentJumpForce -=1;
        }
        console.log(currentJumpForce);
        sprite.y -= Math.pow(currentJumpForce,2);
        return touchingDown;
    }
    
    
    this.run = function(){
        speed = 15;
    }
    
    this.walk = function(){
        speed = 10;
    }
    
    
    this.update = function(deltaTime){
        stage.x = (sprite.x) * -1;
        if(touchingDown)
            stage.y = (sprite.y - 200) * -1;
        checkIfGrounded();
        if(!touchingDown){
            sprite.y += gravity * deltaTime;
        }
        /*console.log(touchingDown);
        if(isJumping){
            sprite.y -= Math.pow(curJumpForce, 2);
            curJumpForce -= 1.2;
            console.log(curJumpForce);
            if(curJumpForce <= 0){
                isJumping = false;
            }
        }
        
        if(!touchingDown){
            playIfNotPlaying("boofAir");
            //console.log(gravity * deltaTime);
            sprite.y += gravity * deltaTime;
        }else{
            stopIfPlaying("boofAir");
        }
        */
        hitbox.x = sprite.x + 90;
        hitbox.y = sprite.y + 150;
        bodyBox.x = sprite.x + 70;
        bodyBox.y = sprite.y + 25;
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
                maxHeight = false;
                //playIfNotPlaying("boofLand");
                break;
            }else{
                touchingDown = false;
            }
            var intersection = ndgmr.checkRectCollision(bodyBox,ground[i]);
            if(intersection !== null){
                if(ground[i].x > bodyBox.x){
                    sprite.x -= speed;
                }else if(ground[i].x < bodyBox.x){
                    console.log("ground: " + ground[i].x + " player x: " + sprite.x);
                    sprite.x += speed;
                }
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