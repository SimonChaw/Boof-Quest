(function(){
    "use strict";
    
    
    function loadMap(stage){
        var xmlhttp = new XMLHttpRequest();
        var url = "test.json";


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
            var tiles = new Array();
            
            
            for(i = 0; i < arr.tilesets.length; i++) {
                
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
    }
    
}());