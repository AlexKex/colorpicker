/* Colorpicker by KeX */
/* v.0.96 */

/* minified код для удобной работы с курсором и Drag'n'drop */
var mouse={pageX:function(b){var a,c,d;d=b||event;return null==d.pageX&&null!=d.clientX?(a=document.body,c=document.documentElement,b=c.scrollLeft||a&&a.scrollLeft||0,b=d.clientX+b-(c.clientLeft||a.clientLeft||0)):d.pageX},pageY:function(b){var a,c,d;d=b||event;return null==d.pageX&&null!=d.clientX?(a=document.body,c=document.documentElement,b=c.scrollTop||a&&a.scrollTop||0,b=d.clientY+b-(c.clientTop||a.clientTop||0)):d.pageY}},Obj={positX:function(b){var a,c;a=0;c=b.getBoundingClientRect();b=document.body;
    a=document.documentElement;a=c.left+(a.scrollLeft||b&&b.scrollLeft||0)-(a.clientLeft||b.sclientLeft||0);return Math.round(a)},positY:function(b){var a,c;a=0;c=b.getBoundingClientRect();b=document.body;a=document.documentElement;a=c.top+(a.scrollTop||b&&b.scrollTop||0)-(a.clientTop||b.sclientTop||0);return Math.round(a)}},querySelector={All:function(b){var a,c,d=[];if(a=document.querySelectorAll("["+b+"]"))return a;a=document.body.getElementsByTagName("*");for(var e=a.length;e--;)c=a[e],null!==c.getAttribute(b)&&
    d.push(c);return d}},cls={has:function(b,a){var c,d;d=b.className.split(" ");for(c=d.length;c--;)if(d[c]===a)return!0;return!1},removeClass:function(b,a){for(var c=b.className.split(" "),d=0;d<c.length;d++)c[d]==a&&c.splice(d--,1);b.className=c.join(" ")},addClass:function(b,a){for(var c=b.className.split(" "),d=0;d<c.length;d++)if(c[d]==a)return;c.push(a);b.className=c.join(" ")}};
/* -------------------------------------------------------- */

var colorpicker; // глобальный объект колорпикера

function Colorpicker(){
    this.color = "431ec4"; // текущий цвет
    this.div; // куда цепляем пикер
};

Colorpicker.prototype.init = function(div_app){
    this.div = div_app;

    var hue; // шкала цвета
    var picker; // выбор оттенков
    var tones; // выбор тонов

    var app_div = this.div;

    /* генерируем DOM для работы */
    // div для всего модуля
    var pick = document.createElement('div');
    pick.id = "picker";

    // div выбора конкретного цвета
    var c_marker = document.createElement("div");
    c_marker.id = "circle";
    c_marker.class = "circle";

    pick.appendChild(c_marker);

    // div для результирующего цвета
    var s_block = document.createElement("div");
    s_block.id = "show_block";
    s_block.class = "show_block";

    // маска для выбора тонов
    var tones_img = document.createElement("img");
    tones_img.src = "https://lh3.googleusercontent.com/-8Dm4nhAOssQ/T_IqwyIFXmI/AAAAAAAAACA/4QKmS7s_otE/s256/bgGradient.png";
    tones_img.class = "bk_img";

    pick.appendChild(tones_img);

    document.getElementById(app_div).appendChild(s_block);
    document.getElementById(app_div).appendChild(pick);
    
    /* ------------------------- */

    // рабочий объект
    picker = {
        Y : 100,
        X : 100,
        init: function(){
            var params = {
                height: 350,
                width: 50,
                show_block: "show_block",
                tones_block: "picker",
                hue: app_div
            };
            var t_params = {
                show_block: "picker",
                marker: "circle"
            };

            hue.init(params);
            tones.init(t_params);

            picker.show_block = document.getElementById("show_block");
        }

    };

    // шкала выбора цвета
    hue = {
        Pos : 0,
        init: function(params){
            var layer, pst, show_block, tones_block, tmp_pos = 0;

            layer = hue.create(params.height, params.width, params.hue, "hueline");

            show_block = document.getElementById(params.show_block);
            tones_block = document.getElementById(params.tones_block);

            hue.place = function (e){
                var top, rgb_col;

                top = mouse.pageY(e) - pst;
                top = (top < 0 )? 0 : top;
                top = (top > params.height )? params.height  : top;

                tmp_pos = Math.round(top /(params.height/ 360));
                tmp_pos = Math.abs(tmp_pos - 360);
                tmp_pos = (tmp_pos == 360)? 0 : tmp_pos;

                hue.Pos = tmp_pos;

                show_block.style.backgroundColor = "rgb("+hue2rgb.conv(tmp_pos,100,100)+")";
                tones_block.style.backgroundColor= "rgb("+hue2rgb.conv(tmp_pos,picker.X,picker.Y)+")";
            }

            layer.onclick = function (e){ hue.place(e); };
            layer.onmousedown = function (){
                pst = Obj.positY(layer);
                document.onmousemove = function(e){hue.place(e);}
            }
            document.onmouseup = function (){
                document.onmousemove = null;
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
    };

    // область выбора тона
    tones = {
        init: function (elem) {

            var circle, block, colorO, bPstX, bPstY, bWi, bHe, cW, cH, pxY, pxX;

            circle = document.getElementById(elem.marker);
            block = document.getElementById(elem.show_block);
            cW = circle.offsetWidth ;
            cH = circle.offsetHeight;
            bWi = block.offsetWidth - cW;
            bHe = block.offsetHeight - cH;
            pxY = bHe / 100;
            pxX = bWi / 100;

            tones_block_offset_left = block.offsetLeft + "px";
            tones_block_offset_top = block.offsetTop + "px";
            
            block.style.backgroundColor = "rgb("+hue2rgb.conv(hue.Pos,100,100)+")";

            circle.style.left = tones_block_offset_left;
            circle.style.top = tones_block_offset_top;

            tones.cPos = function (e){ 

                var top, left, S, V;

                document.ondragstart = function() { return false;}
                document.body.onselectstart = function() { return false; }

                left = mouse.pageX(e) - bPstX - cW/2;
                left = (left < 0)? 0 : left;
                left = (left > bWi  )? bWi  : left;
                var l1 = left;
                left = left + block.offsetLeft;

                circle.style.left = left  + "px";

                S = Math.ceil(l1 / pxX) ;

                top = mouse.pageY(e)  - bPstY - cH/2;
                top = (top > bHe  )? bHe : top;
                top = (top < 0)? 0 : top;
                var t1 = top;

                top = top + block.offsetTop;

                circle.style.top = top   + "px";

                V = Math.ceil(Math.abs(t1 / pxY - 100));

                if (V < 50)
                {
                    circle.style.borderColor = "#fff";  
                } 
                else
                {
                    circle.style.borderColor = "#000";
                } 
                
                picker.X = S;
                picker.Y = V;

                picker.show_block.style.backgroundColor = "rgb("+hue2rgb.conv(hue.Pos,S,V)+")";
                //block.style.backgroundColor = "rgb("+hue2rgb.conv(hue.Pos,S,V)+")";

                var _res = hue2rgb.conv(hue.Pos,S,V);
                _res = _res[0].toString(16)+""+_res[1].toString(16)+""+_res[2].toString(16);
            }

            block.onclick = function(e){tones.cPos(e);}
            block.onmousedown  = function (){
                document.onmousemove = function (e){
                    bPstX = Obj.positX(block);
                    bPstY = Obj.positY(block);
                    tones.cPos(e);
                }
            }

            document.onmouseup=function() {
                document.onmousemove = null;
            }
        }

    };

    // перегоняем позицию в цвет
    var hue2rgb = {
        conv: function (H,S,V){
            var f , p, q , t, lH;

            S /= 100;
            V /= 100;

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

    picker.init();
};

Colorpicker.prototype.get = function(app_div){
    if($("#"+app_div).find("#picker").length)
    {
        alert("На странице уже есть colorpicker!");
    }
    else
    {
        this.init(app_div);
    }
};

Colorpicker.prototype.destroy = function(){
    $("#"+this.div).empty();
}

$(document).ready(function(){
    colorpicker = new Colorpicker();
});