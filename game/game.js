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
    // frame rate of game
    var frameRate = 26;
    var Boof;
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
        
        Boof = new Hero(stage, assetManager);
        Boof.sprite = Boof.getSprite();
        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
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
        if (e.keyCode == 37) leftKey = true;
        else if (e.keyCode == 39) rightKey = true;
        else if (e.keyCode == 38) upKey = true;
        else if (e.keyCode == 40) downKey = true;
    }

    function onKeyUp(e) {
        // which keystroke is up?
        if (e.keyCode == 37) leftKey = false;
        else if (e.keyCode == 39) rightKey = false;
        else if (e.keyCode == 38) upKey = false;
        else if (e.keyCode == 40) downKey = false;
    }

    function onTick(e) {
        // TESTING FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        
        // only monitor keyboard if snake is alive
        if (Boof.isAlive()) {
            if (leftKey) {
                Boof.sprite.regX = 300;
                Boof.sprite.scaleX = -1;
            } else if (rightKey) {
                Boof.sprite.regX = 0;
                Boof.sprite.scaleX = 1;
            } else if (upKey) {
                //console.log("jumping");
            } else if (downKey) {
                Boof.sprite.gotoAndPlay("boofWalk");
                //console.log("croutching I guess");
            } else {
                //console.log("here");
            }
        }
        

        // update the stage!
        stage.update();
    }

})(); 