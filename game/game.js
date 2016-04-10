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
    var levels = ["final1","final2","final3"];
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
        // construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.addEventListener("onAllAssetsLoaded", titleScreen);
        // load the assets
        assetManager.loadAssets(manifest);
        
    }
    
    function titleScreen(){
        console.log("Title Screen");
        var logo = assetManager.getBitmap("logo");
        logo.scaleX = 0.8;
        logo.scaleY = 0.8;
        logo.x = 80;
        logo.y = 0;
        stage.addChild(logo);
        var button = assetManager.getBitmap("btnStart");
        button.x = 250;
        button.y = 425;
        button.on("mousedown",
        function(e){
            e.target.image = assetManager.getBitmap("btnStart_clicked").image;
            stage.addChild(e.target);
            stage.update();
        });
        button.on("click",function(){stage.removeChild(button,logo);
                                    onSetup();});
        stage.addChild(button);
        stage.update();
    }

    function onSetup() {
        stage.addChild(container);
        createjs.Sound.play("bgmusic");
        console.log(">> setup");
        // kill event listener
        stage.removeEventListener("onAllAssetsLoaded", onSetup);
        
        loadMap(container, assetManager,Enemies, "mapTest/" + levels[level] + ".json");
        
        lastUpdate = Date.now();
        Boof = new Hero(container, assetManager,stage);
        Boof.sprite = Boof.getSprite();
        //myInterval = setInterval(onTick,0);
        container.addEventListener("mapLoaded",onStartGame);
        console.log("mapTest/" + levels[level] + ".json");
    }

    function onStartGame(e) {
        container.removeEventListener("mapLoaded",onStartGame);
        for(var i = 0; i < Enemies.length; i ++){
            Enemies[i].init();
        }
        Boof.init();
        stage.on("click",function(){Boof.kill();});
        //zoom camera
        container.scaleX = 0.7;
        container.scaleY = 0.7;
        // start the snake object
        
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
        createjs.Ticker.removeEventListener("tick",onTick);
        createjs.Sound.stop("bgmusic");
        // gameOver
        stage.removeAllChildren();
        console.log("Game Over");
        var gameOverTitle = assetManager.getBitmap("Game Over");
        gameOverTitle.scaleX = 1.5;
        gameOverTitle.scaleY = 1.5;
        stage.addChild(gameOverTitle);
        var button = assetManager.getBitmap("btnRestart");
        button.x = 250;
        button.y = 425;
        button.on("mousedown",
        function(e){
            e.target.image = assetManager.getBitmap("btnRestart_clicked").image;
            stage.addChild(e.target);
            stage.update();
        });
        button.on("click",function(){stage.removeChild(button,gameOverTitle);
                                    onSetup();});
        stage.addChild(button);
        stage.update();
        // remove all listeners
        //document.removeEventListener("keydown", onKeyDown);
        //document.removeEventListener("keyup", onKeyUp);
    }

    function onResetGame(e) {
        console.log("Reseting");
    }    

    function onKeyDown(e) {
        if (e.keyCode == 65){
            leftKey = true;
        }else if(e.keyCode == 68){
            rightKey = true;
        }else if (e.keyCode == 87 && !upKey){
            upKey = true;
            Boof.getController().startJump();
        }
        else if (e.keyCode == 40){
            downKey = true;
        }else if(e.keyCode == 16){
            shiftKey = true;
        }
    }

    function onKeyUp(e) {
        // which keystroke is up?
        if (e.keyCode == 65) leftKey = false; 
        else if (e.keyCode == 68) rightKey = false;
        else if (e.keyCode == 87){ upKey = false; Boof.getController().endJump();}
        else if (e.keyCode == 40) downKey = false;
        else if (e.keyCode == 16) shiftKey = false;
        
        if(e.keyCode ==37 || e.keyCode == 39){Boof.sprite.gotoAndStop("boofWalk");}
    }

    function loadNextLevel(){
    if((level + 1) < levels.length){
            if(container.scaleX < 1.2){//maybe this will make a nice animation??
                container.scaleX += 0.01;
                container.scaleY += 0.01;
                container.x = container.x * 1.3;
                container.y = container.y * 1.8;          
            }else{
                level ++;
                createjs.Sound.stop("bgmusic");
                stage.removeAllChildren();
                container.removeAllChildren(); //dumpstage
                onSetup();
                Enemies.splice(0,Enemies.length);
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
        
        for(var i = 0; i < Enemies.length; i ++){
            Enemies[i].update();
        }
        if(Boof.levelCompleted()){
            
            loadNextLevel();
        }
        // update the stage!
        stage.update();
    }

})(); 