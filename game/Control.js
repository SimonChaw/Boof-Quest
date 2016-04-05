var Controller = function(player){
    var states = ["walking","jumping","still"];
    var currentState;
    var maxJumpForce;
    var jumping;
    var startJump;
    var currentJumpForce;
    var maxHeight;
    var velocity;
    
    this.init = function(){
        currentState = "";
        maxHeight = false;
        maxJumpForce = 10;
        currentJumpForce = 0;
        player.sprite = player.getSprite();
        console.log(player.sprite);
    }
    
    function jumpStarted(e){
        startJump = false;
        e.remove();
    }
    
    this.startJump = function(e){
        if(player.isTouchingDown()){
            player.setJumping(true);
            console.log("Jump started!");
            velocity = -20;
        }
    }
    
    this.endJump = function(e){
        //jumping = false;
        console.log("Jump ended!");
    }
    
    
    this.updateAnimation = function(){
        if(!player.isTouchingDown()){
            playIfNotPlaying("boofAir");
        }else if(currentState === states[0]){
            playIfNotPlaying("boofWalk");
        }else if(currentState === states[2]){
            playIfNotPlaying("boofStand");
        }
    }
    
    this.update = function(upKey,rightKey,leftKey){
        if(player.isAlive()){
            if(upKey){
                if(!player.isJumping()){startJump = true;}
                currentState = states[1]; 
            }else if(player.isTouchingDown() && (leftKey || rightKey)){
                currentState = states[0];
            }else if(player.isTouchingDown() && !(leftKey || rightKey)){
                currentState = states[2];
            }

            if(player.isJumping()){
                velocity = player.jump(velocity);
                if(velocity > 0)
                    if(player.isTouchingDown())
                        player.setJumping(false);
                    
            }

            if(rightKey){
                player.walkRight();
            }else if(leftKey){
                player.walkLeft();
            }

            this.updateAnimation();
        }
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