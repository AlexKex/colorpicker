/* Colorpicker by KeX */
/* v.0.1alpha */
/* started 11.06.2013 */

function Colorpicker(div_app){
    this.color = "431ec4"; // текущий цвет
    this.div = div_app; // куда цепляем пикер
}

Colorpicker.prototype.init = function(){
    var hue; // шкала цвета
    var picker; // выбор оттенков

    var app_div = this.div;

    hue = {
        init: function(){
            var layer;
            layer = hue.create(350, 50);
        },
        create: function(height, width){
            var layer;
            layer = document.createElement('canvas');
            layer.height = height;
            layer.width = width;

            hue.gradient(layer, width, height);
            document.getElementById(app_div).appendChild(layer);
        },
        gradient: function(layer, width, height){
            var cont = layer.getContext("2d"); // HTML 5 метод для canvas
            var grad = cont.createLinearGradient(width/2,height,width/2,0);
            var cols = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,255,255]];

            for(var i=0; i<=6; i++)
            {
                color = 'rgb('+cols[i][0]+','+cols[i][1]+','+cols[i][2]+')';
                grad.addColorStop(i*1/6, color);
            }

            cont.fillStyle = grad;
            cont.fillRect(0,0,width,height);
        }
    }

    hue.init();
}