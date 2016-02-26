var Hero = function(stage,assetManager){
    //init
    var touchingDown = true;
    var alive = true;
    //keep track of scope
    var me = this;
    
    //custom event objects
    var eventOnDeath = new createjs.Event("onDeath",true);
    
    //add hero to the world
    var sprite = assetManager.getSprite("assets");
    stage.addChild(sprite);
    console.log(sprite);
    //Move method.... implement movement class like Sean's example?
    
    //---------- GET/SET
    this.isAlive = function(){
        return alive;
    }
    
    
    this.getSprite = function(){
        return sprite;
    };
    
    
    //-------- public methods
    this.init = function(){
        alive = true;
        //stage.addChild(me);
    };
    
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
}