var Hero = function(stage,assetManager,hud){
    //BOOF: CURRENT INFO - JUMP HEIGHT: 2 TILES. JUMP SPAN: 3 TILES
    
    //init
    var touchingDown = false;
    var isJumping = false;
    var alive = true;
    var hitpoints;
    var healthHud;
    var velX;
    var velY;
    //keep track of scope
    var me = this;
    var speed = 10;
    var time;
    var gravity = 0.5;
    var maxJumpForce = 5;
    var currentJumpForce = 0;
    var hitpoints;
    var maxHeight;
    var controller;
    var levelComplete;
    var invisibilityTimer = 0; 
    var eventOnDeath = new createjs.Event("onDeath",true);
    //add hero to the world
    var sprite = assetManager.getSprite("assets");
    
    var image = new Image();
    image.src = "assets/hitbox.png";
    var hitbox = new createjs.Bitmap(image);
    
    var bodyBox = new createjs.Bitmap(image);
    
    
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
    }
    
    this.getSpeed = function(){
        return speed;
    }
    
    this.levelCompleted = function(){
        return levelComplete;
    }
    
    //-------- public methods
    this.init = function(){
        //BOOF
        sprite.x = 0;
        sprite.y = 0;
        sprite.type = "boof";
        //FEET
        hitbox.scaleX = 0.4;
        hitbox.scaleY = 0.3;
        hitbox.visible = false;
        //BODY
        bodyBox.scaleX = 0.55;
        bodyBox.scaleY = 1.2;
        bodyBox.visible = false;
        
        stage.addChild(bodyBox);
        stage.addChild(hitbox);
        stage.addChild(sprite);
        maxHeight = false;
        alive = true;
        controller = new Controller(me);
        controller.init();
        healthHud = assetManager.getSprite("assets");
        healthHud.x = 650;
        healthHud.y = 0;
        healthHud.scaleX = 0.6;
        healthHud.scaleY = 0.6;
        hud.addChild(healthHud);
        hitpoints = 4;
        healthHud.gotoAndPlay("health4");
        levelComplete = false;
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
    
    this.jump = function(velocity){
        sprite.y += velocity ;
        velocity -= 10;
        if(velocity < -98){
            velocity = 0;
        }
        console.log(velocity);
        return velocity;
    }
    
    
    this.run = function(){
        speed = 15;
    }
    
    this.walk = function(){
        speed = 10;
    }
    
    this.takeDamage = function(colObj){
        if(invisibilityTimer <= 0){
            hitpoints --; 
            invisibilityTimer = 50;
        }
    }
    
    
    this.update = function(deltaTime){
        if(alive){
            if(invisibilityTimer > 0){
                sprite.visible = !sprite.visible;
                invisibilityTimer --;
            }
            updateHealth();
            time = deltaTime;
            stage.x = (sprite.x/1.43 * -1) + 150;
            stage.y = (sprite.y/1.5) * -1 + 200;
            checkIfGrounded();
            hitbox.x = sprite.x + 90;
            hitbox.y = sprite.y + 160;
            bodyBox.x = sprite.x + 70;
            bodyBox.y = sprite.y + 25;
        }else{
            sprite.visible = true;
        }
        if(!touchingDown || !alive){
                sprite.y += gravity * deltaTime;
            }
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
    }
    
    function updateHealth(){
        if(hitpoints > 1){
            var currentAnim = "health" + hitpoints; 
            if(healthHud.currentAnimation !== currentAnim){
                healthHud.gotoAndPlay(currentAnim);
            }
        }else{
            var currentAnim = "health" + hitpoints; 
            if(healthHud.currentAnimation !== currentAnim){
                healthHud.gotoAndPlay(currentAnim);
            }
            me.kill();
        }
    }
    
    function checkIfGrounded(){
        for(var i = 0;i<stage.children.length;i++){
            if(stage.children[i].type !== "boof" && stage.children[i].type !== undefined){
                var intersection = ndgmr.checkRectCollision(hitbox,stage.children[i]);
                if(intersection !== null){
                    touchingDown = true;
                    console.log(stage.children[i].type);
                    if(stage.children[i].type === "sharp" || stage.children[i].type === "hazard"){
                        me.takeDamage();
                    }
                    //check if enemy was stomped
                    if(stage.children[i].type === "enemy"){
                        stage.children[i].kill();
                    }
                    if(stage.children[i].type === "key"){//check if the player has reached the key
                        levelComplete = true;
                        stage.removeChild(stage.children[i]);
                    }
                    break;
                }else{
                    touchingDown = false;
                }
                var intersection = ndgmr.checkRectCollision(bodyBox,stage.children[i]);
                if(intersection !== null){
                    if(stage.children[i].x > bodyBox.x){
                        sprite.x -= speed;
                    }else if(stage.children[i].x < bodyBox.x){
                        sprite.x += speed;
                    }
                    //check if the player has run into an enemy
                    if(stage.children[i].type === "enemy"){
                        me.takeDamage();
                    }
                    if(stage.children[i].type === "key"){//check if the player has reached the key
                        levelComplete = true;
                        stage.removeChild(stage.children[i]);
                    }
                }
            }
        }
    }
}