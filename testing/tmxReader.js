(function(){
    "use strict";
    
    console.log("test");
    var output = document.getElementById("test");
    var xmlhttp = new XMLHttpRequest();
    var stage = new createjs.Stage("stage");
    var url = "test.json";
    var map = {
        'tilesets':[],
        'width':0,
        'height':0
    };
    

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            myFunction(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
    function myFunction(arr) {
        console.log(arr);
        var i;
        map.data = arr.layers[0].data;
        map.height = arr.height;
        map.width = arr.width;
        for(i = 0; i < arr.tilesets.length; i++) {
            map['tilesets'].push(arr.tilesets[i]);
            console.log(arr.tilesets[i].image);
        }
        var counter = 0;
        var y=0;
        var color;
        
        for(i =0; i < map.data.length;i++){
            
            output.innerHTML += map.data[i] + ",";
            color = ((map.data[i] !== 0)?"red":"blue");
            if(counter === map.width){
                counter = 0;
                y +=10;
                output.innerHTML += "<br />";
            }
            var square = new createjs.Shape();
            square.graphics.beginFill(color).drawRect((counter * 10),y,10,10);
            stage.addChild(square);
            counter ++;
        }
        
        
        stage.update();
    }
    
    function drawToCanvas(img){
        stage.addChild(img);
    }
    
}());