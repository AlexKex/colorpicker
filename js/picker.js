/* Colorpicker by KeX */
/* v.1.1 */
/* released on 13.06.2013 */

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

    var color_block = document.createElement("div");
    color_block.id = "cb";

    // div для результирующего цвета
    var s_block = document.createElement("div");
    s_block.id = "show_block";
    s_block.class = "show_block";

    var hex_p = document.createElement("p");
    hex_p.id = "hex_p";
    hex_p.style.display = "block";
    hex_p.innerHTML = "HEX #";

    var hex = document.createElement("input");
    hex.id = "hex";
    hex.type = "text";

    var red = document.createElement("input");
    red.id = "red";
    red.type = "text";
    var green = document.createElement("input");
    green.id = "green";
    green.type = "text";
    var blue = document.createElement("input");
    blue.id = "blue";
    blue.type = "text";
    var r_p = document.createElement("p");
    r_p.id = "r_p";
    r_p.innerHTML = "R";
    var g_p = document.createElement("p");
    g_p.id = "g_p";
    g_p.innerHTML = "G";
    var b_p = document.createElement("p");
    b_p.id = "b_p";
    b_p.innerHTML = "B";

    var rgblock = document.createElement("div");
    rgblock.id="rgb_div";

    rgblock.appendChild(r_p).appendChild(red);
    rgblock.appendChild(g_p).appendChild(green);
    rgblock.appendChild(b_p).appendChild(blue);

    color_block.appendChild(s_block);
    color_block.appendChild(hex_p);
    color_block.appendChild(hex);
    color_block.appendChild(rgblock);

    // маска для выбора тонов
    var tones_img = document.createElement("img");
    tones_img.src = "js/grad.png";
    tones_img.class = "bk_img";

    pick.appendChild(tones_img);

    document.getElementById(app_div).appendChild(color_block);
    document.getElementById(app_div).appendChild(hex);
    document.getElementById(app_div).appendChild(pick);
    
    /* ------------------------- */

    // рабочий объект
    picker = {
        Y : 100,
        X : 100,
        init: function(){
            var params = {
                height: 256,
                width: 30,
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
                tones_block.style.backgroundColor= "rgb("+hue2rgb.conv(tmp_pos,100,100)+")";

                mpX = document.getElementById("circle").offsetLeft;
                mpY = document.getElementById("circle").offsetTop;

                var _res = hue2rgb.conv(hue.Pos,100,100);
                var hx = hue2rgb.getHex(_res);

                document.getElementById("hex").value = hx;
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

                var _res = hue2rgb.conv(hue.Pos,S,V);
                var hx = hue2rgb.getHex(_res);

                document.getElementById("hex").value = hx;
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

            document.getElementById("red").value = parseInt(R*255);
            document.getElementById("green").value = parseInt(G*255);
            document.getElementById("blue").value = parseInt(B*255);
            return [parseInt(R*255), parseInt(G*255), parseInt(B*255)];
        },

        getHex: function(rgb){
            var hex = '';

            for(var i=0;i<3;i++)
            {
                if(!rgb[i] || rgb[i].toString(16).length == 1)
                {
                    rgb[i] = rgb[i].toString(16)+""+rgb[i].toString(16);
                }
                else
                {
                    rgb[i] = rgb[i].toString(16);
                }
            }

            hex = rgb[0]+""+rgb[1]+""+rgb[2];

            return hex;
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