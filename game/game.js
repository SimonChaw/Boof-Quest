// Munch implemented in HTML5
// Sean Morrow
// May 12, 2014

"use strict";
(function() {

    window.addEventListener("load", onInit);

    // game variables
    var stage = null;
    var canvas = null;
    var downKey = false;
    var upKey = false;
    var leftKey = false;
    var rightKey = false;
    var shiftKey = false;
    // frame rate of game
    var frameRate = 26;
    var Boof;
    var ground = Array();
    
    var lastUpdate;
    var myInterval;
    // game objects
    var assetManager;
    // ------------------------------------------------------------ event handlers
    function onInit() {
        console.log(">> initializing");

        // get reference to canvas
        canvas = document.getElementById("stage");
        // set canvas to as wide/high as the browser window
        canvas.width = 600;
        canvas.height = 600;
        // create stage object
        stage = new createjs.Stage(canvas);

        // construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.addEventListener("onAllAssetsLoaded", onSetup);
        // load the assets
        assetManager.loadAssets(manifest);
    }

    function onSetup() {
        console.log(">> setup");
        // kill event listener
        stage.removeEventListener("onAllAssetsLoaded", onSetup);

        //Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
        var shape = new createjs.Shape();
        shape.type = "ground";
        shape.graphics.beginFill("#ff0000").drawRect(0, 500, 500, 100);
        
        stage.addChild(shape);
        // construct game objects
        //background = assetManager.getSprite("assets");
        //background.gotoAndStop("background");
        //stage.addChild(background);
        
        //introCaption = assetManager.getSprite("assets");
        //introCaption.gotoAndStop("introCaption");
        //introCaption.x = 50;
        //introCaption.y = 50;
        //stage.addChild(introCaption);
        
        //gameOverCaption = assetManager.getSprite("assets");
        //gameOverCaption.gotoAndStop("gameOverCaption");
        //gameOverCaption.x = 50;
        //gameOverCaption.y = 50;
        
        //userInterface = new UserInterface(stage, assetManager, snakeMaxSpeed);
        //userInterface.setupMe();	
        
        
        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
        lastUpdate = Date.now();
        for(var i = 0;i <  stage.children.length; i ++){
            if(stage.children[i].type == "ground"){
                ground.push(stage.children[i]);
            }
        }
        Boof = new Hero(stage, assetManager,ground);
        Boof.sprite = Boof.getSprite();
        //myInterval = setInterval(onTick,0);
        onStartGame();
    }

    function onStartGame(e) {
        
        // start the snake object
        Boof.init();
        
        // current state of keys
        leftKey = false;
        rightKey = false;
        upKey = false;
        downKey = false;

        // setup event listeners for keyboard keys
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
    }
    
    function onGameOver(e) {
        // gameOver


        // remove all listeners
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
    }

    function onResetGame(e) {
        console.log("Reseting");
    }    

    function onKeyDown(e) {
        // which keystroke is down?
        if (e.keyCode == 37 && !leftKey){
            leftKey = true;
            Boof.sprite.regX = 300;
            Boof.sprite.scaleX = -1;
            Boof.sprite.gotoAndPlay("boofWalk");
        }else if(e.keyCode == 39 && !rightKey){
            rightKey = true;
            Boof.sprite.regX = 0;
            Boof.sprite.scaleX = 1;
            Boof.sprite.gotoAndPlay("boofWalk");
        }else if (e.keyCode == 38 && !upKey){
            upKey = true;
            Boof.sprite.gotoAndPlay("boofJump");
        }
        else if (e.keyCode == 40){
            downKey = true;
        }else if(e.keyCode == 16){
            shiftKey = true;
        }
        
        //console.log(e.keyCode);
    }

    function onKeyUp(e) {
        // which keystroke is up?
        if (e.keyCode == 37) leftKey = false;
        else if (e.keyCode == 39) rightKey = false;
        else if (e.keyCode == 38) upKey = false;
        else if (e.keyCode == 40) downKey = false;
        else if (e.keyCode == 16) shiftKey = false;
    }

    function onTick(e) {
        // TESTING FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();
        
        var now = Date.now();
        var deltaTime = now - lastUpdate;
        lastUpdate = now;
        
        
        // only monitor keyboard if snake is alive
        if (Boof.isAlive()) {
            if(shiftKey){
                Boof.run();
            }else{
                Boof.walk();
            }
            
            
            if (leftKey) {
                Boof.walkLeft();
            } else if (rightKey) {
                Boof.walkRight();
            } else if (upKey) {
                //console.log("jumping");
            } else if (downKey) {
                
                //console.log("croutching I guess");
            } else {
                //console.log("here");
            }
        }
        
        Boof.update(deltaTime);
        // update the stage!
        stage.update();
    }

})(); 