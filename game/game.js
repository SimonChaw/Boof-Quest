"use strict";
(function() {

    window.addEventListener("load", onInit);
    //http://jsfiddle.net/gfcarv/QKgHs/
    // game variables
    var stage = null;
    var container = null;
    var canvas = null;
    var downKey = false;
    var upKey = false;
    var leftKey = false;
    var rightKey = false;
    var shiftKey = false;
    var mapLoaded;
    var levels = ["level1","level2","level3","level4"];
    var level;
    //holder for enemies
    var Enemies = Array();
    // frame rate of game
    var frameRate = 26;
    var Boof;
    var ground = Array();
    var canWalkRight;
    var canWalkLeft;
    var lastUpdate;
    var myInterval;
    // game objects
    var assetManager;
    // ------------------------------------------------------------ event handlers
    function onInit() {
        console.log(">> initializing");
        level = 0;
        mapLoaded = false;
        // get reference to canvas
        canvas = document.getElementById("stage");
        // set canvas to as wide/high as the browser window
        canvas.width = 800;
        canvas.height = 600;
        // create stage object
        stage = new createjs.Stage(canvas);
        container = new createjs.Container();
        stage.addChild(container);
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
        loadMap(container, assetManager,Enemies);
        //Alternatively use can also use the graphics property of the Shape class to renderer the same as above.
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
        Boof = new Hero(container, assetManager,stage);
        Boof.sprite = Boof.getSprite();
        //myInterval = setInterval(onTick,0);
        onStartGame();
    }

    function onStartGame(e) {
        //zoom camera
        container.scaleX = 0.7;
        container.scaleY = 0.7;
        // start the snake object
        Boof.init();
        console.log("Boof Initilized");
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
        if (e.keyCode == 37){
            leftKey = true;
        }else if(e.keyCode == 39){
            rightKey = true;
        }else if (e.keyCode == 38 && !upKey){
            upKey = true;
            Boof.getController().startJump();
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
        else if (e.keyCode == 38){ upKey = false; Boof.getController().endJump();}
        else if (e.keyCode == 40) downKey = false;
        else if (e.keyCode == 16) shiftKey = false;
        
        if(e.keyCode ==37 || e.keyCode == 39){Boof.sprite.gotoAndStop("boofWalk");}
    }

    function loadNextLevel(){
    if((level + 1) < levels.length){
            if(container.scaleX < 1.2){//maybe this will make a nice animation??
                container.scaleX += 0.01;
                container.scaleY += 0.01;
            }else{
                stage.removeAllChildren();//dump out previous loaded stage.
                container.removeAllChildren();
                loadMap(container,assetManager);//load next level
                container.scaleX = 0.7;//Reset camera zoom
                container.scaleY = 0.7;
                Boof.init();//reset hero
                stage.addChild(container);
            }
        }else{
            //game finished
        }
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
            Boof.getController().update(upKey,rightKey,leftKey);
            Boof.update(deltaTime);
        }else{
            onGameOver();
        }
        
        if(Boof.levelCompleted()){
            
            loadNextLevel();
        }
        // update the stage!
        stage.update();
    }

})(); 