var Controller = function(player){
    var states = ["walking","jumping","still"];
    var currentState;
    var maxJumpForce;
    var jumping;
    var currentJumpForce;
    var maxHeight;
    
    this.init = function(){
        currentState = "";
        maxHeight = false;
        maxJumpForce = 10;
        currentJumpForce = 0;
        startingJump = false;
        player.sprite = player.getSprite();
        console.log(player.sprite);
    }
    
    function jumpStarted(e){
        jumping = true;
        e.remove();
    }
    
    
    
    this.updateAnimation = function(){
        //console.log(currentState);
        if(currentState === states[1] && player.isTouchingDown()){
            playIfNotPlaying("boofJumpStart");
            player.sprite.addEventListener("animationend",jumpStarted);
        }else if(!player.isTouchingDown()){
            playIfNotPlaying("boofAir");
        }else if(currentState === states[0]){
            playIfNotPlaying("boofWalk");
        }else if(currentState === states[2]){
            playIfNotPlaying("boofStand");
        }
    }
    
    this.update = function(upKey,rightKey,leftKey){
        if(upKey){
            currentState = states[1]; 
        }else if(player.isTouchingDown() && (leftKey || rightKey)){
            currentState = states[0];
        }else if(player.isTouchingDown() && !(leftKey || rightKey)){
            currentState = states[2];
        }
        
        if(jumping){
            jumping = player.jump(upKey);
        }
        
        if(rightKey){
            player.walkRight();
        }else if(leftKey){
            player.walkLeft();
        }
        
        this.updateAnimation();
    }
    
    function playIfNotPlaying(animationName){
        if(player.sprite.currentAnimation !== animationName){
            player.sprite.gotoAndPlay(animationName);
        }
    }
    
    function stopIfPlaying(animationName){
        if(player.sprite.currentAnimation == animationName){
            player.sprite.stop();
        }
    }
}