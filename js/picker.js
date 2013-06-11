/* Colorpicker by KeX */
/* v.0.5 */
/* started 11.06.2013 */

function Colorpicker(div_app){
    this.color = "431ec4"; // текущий цвет
    this.div = div_app; // куда цепляем пикер
}

Colorpicker.prototype.init = function(){
    var hue; // шкала цвета
    var picker; // выбор оттенков

    var app_div = this.div;

    var params = {
        height: 350,
        width: 50,
        arrows: "arrows",
        show_block: "show_block",
        hue: this.div
    };

    hue = {
        Pos : 0,
        init: function(params){
            var layer, arrows, pst, show_block, tmp_pos = 0;

            layer = hue.create(params.height, params.width, params.hue, "hueline");

            arrows = document.getElementById(params.arrows);
            show_block = document.getElementById(params.show_block);

            hue.place = function (e){
                var top, rgb_col;

                top = mouse.pageY(e) - pst;
                top = (top < 0 )? 0 : top;
                top = (top > params.height )? params.height  : top;

                arrows.style.top = top-2 +"px";
                tmp_pos = Math.round(top /(params.height/ 360));
                tmp_pos = Math.abs(tmp_pos - 360);
                tmp_pos = (tmp_pos == 360)? 0 : tmp_pos;

                hue.Pos = tmp_pos;

                show_block.style.backgroundColor = "rgb("+hue2rgb.conv(tmp_pos,100,100)+")";
                //picker.out_color.style.backgroundColor= "rgb("+hue2rgb.conv(tmp_pos,picker.S,picker.V)+")";
            }

            arrows.onmousedown = function (){
                pst = Obj.positY(layer);
                document.onmousemove = function(e){hue.place(e);}
            }

            arrows.onclick = hue.place;

            layer.onclick = function (e){hue.place(e)};
            layer.onmousedown = function (){
                pst = Obj.positY(layer);
                document.onmousemove = function(e){hue.place(e);}
            }
            document.onmouseup = function (){
                document.onmousemove = null;
                arrows.onmousemove = null;
            }
        },
        create: function(height, width, line, classnm){
            var layer;
            layer = document.createElement('canvas');
            layer.height = height;
            layer.width = width;

            layer.className = classnm;
            document.getElementById(line).appendChild(layer);

            hue.gradient(layer, width, height);
            return layer;
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
    hue.init(params);

    picker = {
        width : 200,

    }

    // перегоняем позицию в цвет
    var hue2rgb = {
        conv: function (H,S,V){
            var f , p, q , t, lH;

            S /=100;
            V /=100;

            lH = Math.floor(H / 60);

            f = H/60 - lH;
            p = V * (1 - S);
            q = V *(1 - S*f);
            t = V* (1 - (1-f)* S);

            switch (lH){
                case 0: R = V; G = t; B = p; break;
                case 1: R = q; G = V; B = p; break;
                case 2: R = p; G = V; B = t; break;
                case 3: R = p; G = q; B = V; break;
                case 4: R = t; G = p; B = V; break;
                case 5: R = V; G = p; B = q; break;}
            return [parseInt(R*255), parseInt(G*255), parseInt(B*255)];
        }

    }
}

Colorpicker.prototype.get = function(){
    this.init();
}