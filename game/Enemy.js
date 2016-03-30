var Enemy = function(stage,type,x,y,assetManager){
    //properties
    var me = this;
    var sprite;
    var alive;
    var walkTimer;
    var walkingLeft;
    var walkingRight;
    var speed;
    var ground;
    var hero = new Object();
    var image = new Image();
    var gravity = 19;
    
    this.init = function(){
        alive = true;
        sprite = assetManager.getSprite("assets");
        sprite.type = "enemy";
        if(type === "mouldy"){
            walkTimer = 100;
            sprite.gotoAndPlay("mouldyWalk");
            speed = 4;
            walkingLeft = true;
        }
        sprite.x = x;
        sprite.y = y;
        sprite.kill = function(){
            alive = false;
            if(type==="mouldy"){
                sprite.gotoAndPlay("mouldyDeath");
            }
            sprite.addEventListener("animationend",onDeath);
        }
        stage.addChild(sprite);
        
    }
    
    this.update = function(){
        if(!isGrounded()){
            //sprite.y += gravity;   
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
    
    
    
    function decide(){
        if(type==="mouldy"){
            if(walkingLeft){
                me.walkLeft();
                walkTimer --;
                if(walkTimer == 0){
                    walkingLeft = false;
                    walkingRight = true;
                    walkTimer = 60;
                }
            }else if(walkingRight){
                me.walkRight();
                walkTimer --;
                if(walkTimer == 0){
                    walkingLeft = true;
                    walkingRight = false;
                    walkTimer = 60;
                }
            }
        }
    }
    
    function onDeath(e){
        sprite.stop();
        e.remove();
        stage.removeChild(sprite);
    }
    
    function isGrounded(){
        for(var i = 0;i<stage.children.length;i++){
            if(stage.children[i].type === "ground"){
                var intersection = ndgmr.checkRectCollision(sprite,stage.children[i]);
                if(intersection !== null){
                    return true;
                }else{
                    return false;
                }
            }
    }
    
}
}