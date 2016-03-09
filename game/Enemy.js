var Enemy = function(stage,type,x,y,assetManager){
    //properties
    var sprite;
    var alive;
    var walkTimer;
    var walkingLeft;
    var walkingRight;
    var speed;
    var ground;
    var hero = new Object();
    var image = new Image();
    var bodybox;
    var gravity = 19;
    
    this.init = function(){
        alive = true;
        image.src = "assets/hitbox.png";
        bodybox = new createjs.Bitmap(image);
        for(var i = 0;i <  stage.children.length; i ++){
            if(stage.children[i].type == "ground"){
                ground.push(container.children[i]);
            }else if(stage.children[i].type == "feet"){
                hero.feet = stage.children[i];
            }else if(stage.children[i].type == "body"){
                hero.body = stage.children[i];
            }
            else if(stage.children[i].type == "boof"){
                hero.sprite = stage.children[i];
            }
        }
        sprite = assetManager.getSprite("assets");
        if(type === "mouldy"){
            walkTimer = 60;
            sprite.gotoAndPlay("mouldyWalk");
            speed = 2;
        }
        stage.addChild(bodybox);
    }
    
    this.update = function(){
        bodybox.x = sprite.x;
        bodybox.y = sprite.y;
        if(!isGrounded()){
            sprite.y -= gravity;   
        }
        decide();
        
        
    }
    
    this.walkRight = function(){
        sprite.regX = 280;
        sprite.scaleX = -1;
        sprite.x += speed;
    }
    
    this.walkLeft = function(){
        sprite.regX = 0;
        sprite.scaleX = 1;
        sprite.x -= speed;
    }
    
    this.kill(){
        alive = false;
        if(type=="mouldy"){
            sprite.gotoAndPlay("mouldyDeath");
            sprite.addEventListener();
        }
    }
    
    function decide(){
        if(type==="mouldy"){
            if(walkingLeft){
                this.walkLeft();
                walkTimer --;
                if(walkTimer == 0){
                    walkingLeft = false;
                    walkingRight = true;
                    walkTimer = 60;
                }
            }else if(walkingRight){
                this.walkRight();
                walkTimer --;
                if(walkTimer == 0){
                    walkingLeft = true;
                    walkingRight = false;
                    walkTimer = 60;
                }
            }
        }
    }
    
    function checkCollision(){
        var intersection = ndgmr.checkRectCollision(hero.feet, sprite);
        if(intersection !== null){
               
        }
    }
    
    function isGrounded(){
        for(var i = 0;i<ground.length;i++){
            var intersection = ndgmr.checkRectCollision(hitbox,ground[i]);
            if(intersection !== null){
                return true;
            }else{
                return false;
            }
    }
    
}