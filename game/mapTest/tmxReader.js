
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
                var bitmap;
                if(currentData > 0){  
                    bitmap = assetManager.getBitmap(arr.tilesets[currentData - 1].image);
                    if(arr.tilesets[currentData - 1].image !== "forkNknife.png"){
                        bitmap.type = "ground";
                        bitmap.y = y;
                        bitmap.x = counter * 80;
                        stage.addChild(bitmap);
                    }else{
                       bitmap = assetManager.getBitmap(arr.tilesets[currentData - 1].image);
                        bitmap.type ="hazard";
                        bitmap.y = y;
                        bitmap.x = counter * 80;
                        //console.log(bitmap);
                        stage.addChild(bitmap);
                    }
                }
                
                if(currentData == "M"){
                    var enemy = new Enemy(stage,"mouldy",(counter * 80),(y - 80), assetManager);
                    //enemy.init();
                    Enemies.push(enemy);
                }else if(currentData === "Y"){
                    var enemy = new Enemy(stage,"yogi",((counter * 80) - 65), (y - 50), assetManager);
                    Enemies.push(enemy);
                }
                
                if(currentData == "K"){
                    bitmap = assetManager.getBitmap("key.png");
                    bitmap.type ="key";
                    bitmap.y = y;
                    bitmap.x = counter * 80;
                    stage.addChild(bitmap);
                }
                counter ++;
            }
            stage.dispatchEvent(mapLoaded);
        }
    }