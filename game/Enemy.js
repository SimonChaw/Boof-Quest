var Enemy = function(stage,type,x,y,assetManager){
    //properties
    var me = this;
    var sprite;
    var alive;
    var walkTimer;
    var shotTimer;
    var walkingLeft;
    var walkingRight;
    var speed;
    var ground;
    var projectiles = new Array();
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
        }else if(type === "yogi"){
            shotTimer = 200;
            sprite.gotoAndPlay("yogiIdle");
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
        if(type==="yogi"){
            for(var i = 0; i < projectiles.length; i ++){
                if(!projectiles[i].isLive()){
                    projectiles.splice(i,1);
                }else{
                    projectiles[i].update();
                }
            }
        }
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
        if(alive){
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
            }else if(type === "yogi"){
                if(shotTimer > 0){
                    shotTimer --;
                }else{
                    shotTimer = 200;
                    shootProjectile();
                }
            }
        }
    }
    
    function onDeath(e){
        createjs.Sound.play("death");
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
     
    function shootProjectile(){
        var projectile = new Projectile(assetManager,sprite.x,sprite.y,stage);
        projectiles.push(projectile);
    }
    
}
}

var Projectile = function(assetManager,x,y,stage){
    var sprite;
    var lifeDuration;
    var me;
    var speed;
    var live;
    
    this.init = function(){
        me = this;
        sprite = assetManager.getSprite("assets");
        sprite.goToAndPlay("yogurtShot");
        lifeDuration = 500;
        sprite.x = x;
        sprite.y = y;
        stage.addChild(sprite);
        live = true;
        speed = 3;
    }
    
    this.collide = function(){
        sprite.goToAndPlay("yogurtHit");
        sprite.addEventListener("animationend",remove)
    }
    
    this.remove = function(){
        live = false;
        stage.removeChild(sprite);
    }
    
    this.isLive = function(){
        return live;
    }
    
    this.update = function(){
        if(live){
            lifeDuration --;
            if(lifeDuration <= 0){
                me.remove();
            }
            sprite.x -= speed;
            checkCollision();
        }
    }
    
    function checkCollision(){
        for(var i = 0;i<stage.children.length;i++){
            if(stage.children[i].type === "boof" || stage.children[i].type === "ground"){
                var intersection = ndgmr.checkRectCollision(sprite,stage.children[i]);
                if(intersection !== null){
                    if(stage.children[i].type === "boof"){
                        stage.children[i].takeDamage();
                    }
                    me.collide();
                }
            }
        }
    }
    
    
}