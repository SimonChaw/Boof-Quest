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
    var score = 0;
    var levels = ["final1","final2","final3"];
    var level;
    //holder for enemies
    var Enemies = Array();
    // frame rate of game
    var frameRate = 26;
    var Boof;
    var isMobile = false;
    var ground = Array();
    var canWalkRight;
    var canWalkLeft;
    var lastUpdate;
    var myInterval;
    // game objects
    var assetManager;
    
    // ------------------------------------------------------------ event handlers
    function onInit() {
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
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
        assetManager = new AssetManager(stage,canvas);
        stage.addEventListener("onAllAssetsLoaded", titleScreen);
        // load the assets
        /*
        
        */
        stage.update();
        createjs.Ticker.addEventListener("tick",function(){});
        assetManager.loadAssets(manifest);
        if(true){
            setupMobileControls();
        }
    }
    
    function titleScreen(){
        createjs.Sound.play("title");
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
        button.on("click",function(){stage.removeChild(button,logo);createjs.Sound.stop("title");
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
        Boof = new Hero(container, assetManager,stage,score);
        Boof.sprite = Boof.getSprite();
        //myInterval = setInterval(onTick,0);
        container.addEventListener("mapLoaded",onStartGame);
        console.log("mapTest/" + levels[level] + ".json");
        stage.on("click",function(){
           console.log(stage); 
        });
    }

    function onStartGame(e) {
        container.removeEventListener("mapLoaded",onStartGame);
        for(var i = 0; i < Enemies.length; i ++){
            Enemies[i].init();
        }
        Boof.init();
        //Boof.sprite.on("click",function(){onWin();});
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
        createjs.Sound.play("gameover");
        score = 0;
        // gameOver
        stage.removeAllChildren();
        console.log("Game Over");
        var gameOverTitle = assetManager.getBitmap("Game Over");
        gameOverTitle.scaleX = 1.5;
        gameOverTitle.scaleY = 1.5;
        gameOverTitle.x = 170;
        gameOverTitle.y = 0;
        stage.addChild(gameOverTitle);
        var button = assetManager.getBitmap("btnRestart");
        button.x = 250;
        button.y = 300;
        button.on("mousedown",
        function(e){
            e.target.image = assetManager.getBitmap("btnRestart_clicked").image;
            stage.addChild(e.target);
            stage.update();
        });
        button.on("click",function(){
            stage.removeChild(button,gameOverTitle);
            cleanUpStage();
            createjs.Sound.stop("gameover");
            onSetup();
        });
        stage.addChild(button);
        stage.update();
        // remove all listeners
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
    }
    
    
    function cleanUpStage(){
        for(var i = 0; i<Enemies.length;i++){
                Enemies[i].killInstantly();
            }
        Enemies.splice(0,Enemies.length);
        container.removeAllChildren();
    }
    
    function onResetGame(e) {
        console.log("Reseting");
        container.removeAllChildren();
        level = 0;
        onSetup();
    } 
    
    function colorChanger(){
        
    }
    
    function onWin(){
        createjs.Ticker.removeEventListener("tick",onTick);
        createjs.Sound.stop("bgmusic");
        stage.removeAllChildren();
        //setup win interface
        var winTitle = assetManager.getBitmap("winTitle");
        winTitle.x = 100;
        winTitle.y = 0;
        var txtScore = new createjs.Text();
        txtScore.set({
            text: "Your score was: " + score,
            font: "bold 25px Fantasy",
            x: 400,
            y: 400
        })
        var button = assetManager.getBitmap("btnReset");
        button.x = 400;
        button.y = 300;
        button.on("mousedown",
        function(e){
            e.target.image = assetManager.getBitmap("btnReset_clicked").image;
            stage.addChild(e.target);
            stage.update();
        });
        button.on("click",
                 function(){
            stage.removeChild(button, winTitle,txtScore);
            stage.update();
            Boof.setScore(0);
            score = 0;
            cleanUpStage();
            onResetGame();
        });
        stage.addChild(button, winTitle,txtScore);
        stage.update();
        
    }

    function onKeyDown(e) {
        if (e.keyCode == 65){
            leftKey = true;
        }else if(e.keyCode == 68){
            rightKey = true;
        }else if (e.keyCode == 87 && !upKey){
            upKey = true;
            Boof.getController().startJump(e);
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
        else if (e.keyCode == 87){ upKey = false; Boof.getController().endJump(e);}
        else if (e.keyCode == 40) downKey = false;
        else if (e.keyCode == 16) shiftKey = false;
        
        if(e.keyCode ==37 || e.keyCode == 39){Boof.sprite.gotoAndStop("boofWalk");}
    }

    function loadNextLevel(){
    if((level + 1) < levels.length){
            if(container.scaleX < 1.2){
                container.scaleX += 0.01;
                container.scaleY += 0.01;
                container.x = container.x * 1.3;
                container.y = container.y * 1.8;          
            }else{
                level ++;
                createjs.Sound.stop("bgmusic");
                stage.removeAllChildren();
                container.removeAllChildren(); //dumpstage
                cleanUpStage();
                score = Boof.getScore();
                onSetup();
            }
        }else{
            if(container.scaleX < 1.2){
                container.scaleX += 0.01;
                container.scaleY += 0.01;
                container.x = container.x * 1.3;
                container.y = container.y * 1.8;          
            }else{
                score = Boof.getScore();
                onWin();
            }
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
        }else if(!Boof.isAlive() && !Boof.isWaiting()){
            console.log(Boof.isWaiting());
            onGameOver();
        }else{
            Boof.getController().update();
        }
        Boof.update(deltaTime);
        
        for(var i = 0; i < Enemies.length; i ++){
            Enemies[i].update();
        }
        if(Boof.levelCompleted()){
            loadNextLevel();
        }
        // update the stage!
        stage.update();
    }
    
    function setupMobileControls(){
        document.getElementById("mobileControls").style.display = "block";
        document.getElementById("btnLeft").onmousedown = function(){leftKey = true};
        document.getElementById("btnRight").onmousedown = function(){rightKey = true};
        document.getElementById("btnRun").onmousedown = function(){shiftKey = true};
        document.getElementById("btnJump").onmousedown = function(){upKey = true};
        document.getElementById("btnLeft").onmouseup = function(){leftKey = false};
        document.getElementById("btnRight").onmouseup = function(){rightKey = false};
        document.getElementById("btnRun").onmouseup = function(){shiftKey = false};
        document.getElementById("btnJump").onmouseup = function(){upKey = false};
    }

})(); 