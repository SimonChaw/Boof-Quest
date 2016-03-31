
    function loadMap(stage, assetManager,Enemies, url){
        var xmlhttp = new XMLHttpRequest();
        console.log(assetManager.getSprite("assets"));
        var mapLoaded = new createjs.Event("mapLoaded");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var myArr = JSON.parse(xmlhttp.responseText);
                myFunction(myArr);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        function myFunction(arr) {
            var height = arr.height;
            var width = arr.width;
            var counter = 0;
            var y=0;
            var color;
            //console.log(arr);
            for(i =0; i < arr.layers[0].data.length;i++){
                var currentData = arr.layers[0].data[i];
                if(counter === width){
                    counter = 0;
                    y +=80;
                }
                var image = new Image();
                if(currentData > 0){   
                    image.src = "mapTest/" + arr.tilesets[currentData - 1].image;
                    if(arr.tilesets[currentData - 1].image !== "forkNknife.png"){
                        var bitmap = new createjs.Bitmap(image);
                        bitmap.type ="ground";
                        bitmap.y = y;
                        bitmap.x = counter * 80;
                        //console.log(bitmap);
                        stage.addChild(bitmap);
                    }else{
                       image.src = "mapTest/" + arr.tilesets[currentData - 1].image;
                        var bitmap = new createjs.Bitmap(image);
                        bitmap.type ="hazard";
                        bitmap.y = y;
                        bitmap.x = counter * 80;
                        //console.log(bitmap);
                        stage.addChild(bitmap);
                        createHazard(bitmap); 
                    }
                }
                
                if(currentData == "M"){
                    var enemy = new Enemy(stage,"mouldy",(counter * 80),y, assetManager);
                    //enemy.init();
                    Enemies.push(enemy);
                }
                
                if(currentData == "K"){
                    image.src = "mapTest/key.png";
                    var bitmap = new createjs.Bitmap(image);
                    bitmap.type ="key";
                    bitmap.y = y;
                    bitmap.x = counter * 80;
                    stage.addChild(bitmap);
                }
                counter ++;
            }
            stage.dispatchEvent(mapLoaded);
        }
        
        function createHazard(bitmap){
            console.log("creating hazard");
            var image = new Image();
            image.src = "assets/hitbox.png";
            var hitbox = new createjs.Bitmap(image);
            hitbox.scaleX = 0.3;
            hitbox.scaleY = 0.2;
            hitbox.x = bitmap.x + 5;
            hitbox.y = bitmap.y + 15;
            hitbox.type = "sharp";
            stage.addChild(hitbox);
        }
    }