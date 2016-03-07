
    function loadMap(stage){
        var xmlhttp = new XMLHttpRequest();
        var url = "mapTest/test.json";


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
                if(currentData != 0){   
                    image.src = "mapTest/" + arr.tilesets[currentData - 1].image;
                    var bitmap = new createjs.Bitmap(image);
                    bitmap.type ="ground";
                    bitmap.y = y;
                    bitmap.x = counter * 80;
                    //console.log(bitmap);
                    stage.addChild(bitmap);
                }
                counter ++;
            }
        }
    }