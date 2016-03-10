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
    var curJumpForce;
    var health;
    
    //custom event oground[i]jects
    collisionMethod = ndgmr.checkRectCollision;
    var eventOnDeath = new createjs.Event("onDeath",true);
    //add hero to the world
    var sprite = assetManager.getSprite("assets");
    sprite.x = 0;
    sprite.y = 0;
    stage.addChild(sprite);
    var heart = assetManager.getSprite("assets");
    heart.x = 600;
    heart.y = 10;
    heart.scaleX = 0.6;
    heart.scaleY = 0.6;
    stage.addChild(heart);
    var image = new Image();
    image.src = "assets/hitbox.png";
    var hitbox = new createjs.Bitmap(image);
    hitbox.scaleX = 0.3;
    hitbox.scaleY = 0.3;
    hitbox.visible = false;
    var bodyBox = new createjs.Bitmap(image);
    bodyBox.scaleX = 0.55;
    bodyBox.scaleY = 1.2;
    bodyBox.visible = false;
    stage.addChild(bodyBox);
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
        health = 4;
        me.updateHealth();
        //stage.addChild(me);
    };
    
    this.walkRight = function(){
        sprite.x += speed;
    }
    
    this.walkLeft = function(){
        sprite.x -= speed;
    }
    
    this.startJump = function(){
        if(touchingDown){
            sprite.gotoAndPlay("boofJumpStart");
            sprite.addEventListener("animationend",jump);
        }
    }
    
    
    this.run = function(){
        speed = 15;
    }
    
    this.walk = function(){
        speed = 10;
    }
    
    
    this.update = function(deltaTime){
        followMe();//make the 'camer
        checkIfGrounded();
        me.updateHealth();
        //console.log(touchingDown);
        if(isJumping){
            sprite.y -= Math.pow(curJumpForce, 2);
            curJumpForce -= 1.2;
            console.log(curJumpForce);
            if(curJumpForce <= 0){
                isJumping = false;
            }
        }
        
        if(!touchingDown){
            playIfNotPlaying("boofAir",sprite);
            //console.log(gravity * deltaTime);
            sprite.y += gravity * deltaTime;
        }else{
            stopIfPlaying("boofAir",sprite);
        }
        hitbox.x = sprite.x + 100;
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
    
    this.updateHealth = function(){
        var animName = "health" + health;
        playIfNotPlaying(animName,heart);
    }
    
    function followMe(){
        if(alive){
            stage.x = (sprite.x) * -1;
            if(touchingDown && !isJumping){
                var playerPoint = (sprite.y - 200) * -1;
                stage.y = playerPoint;
            }
        }   
    }
    
    //--------------event handlers
    
    
    function onDeath(e){
        sprite.stop();
        e.remove();
        sprite.dispatchEvent(eventHeroKilled);
    }
    
    function jump(e){
        sprite.stop();
        e.remove();
        curJumpForce = 11;
        isJumping = true;
    }
    
    function checkIfGrounded(){
        for(var i = 0;i<ground.length;i++){
            var intersection = ndgmr.checkRectCollision(hitbox,ground[i]);
            if(intersection !== null){
                touchingDown = true;
                //playIfNotPlaying("boofWalk");
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
                health --;
            }
        }
    }
    
    function playIfNotPlaying(animationName, sprite){
        if(sprite.currentAnimation !== animationName){
            sprite.gotoAndPlay(animationName);
        }
    }
    
    function stopIfPlaying(animationName, sprite){
        if(sprite.currentAnimation == animationName){
            sprite.stop();
        }
    }
}