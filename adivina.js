var Puntuacion = 0;
var myInter;
var tipogame = "";
var lugar;
var long;
var lat;
var nivel;
var numFotos= 1;
var distancia = 1;
var first = false;
var juegos ="";
var cambiosHistory = 0;
var pos = 0;
var puntuacionOld=0;
var numberOfEntries;
var ibapor= 0;
var oldgame = false;
function putmap(){
//pongo mapa
	var map = L.map('map').setView([0, 0], 1);

	  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://           		creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18
	  }).addTo(map);
	map.on('click', function(e) { //Dejo esta funcion escuchando los clicks del mapa
		//alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
		//comparoCoords(e.latlng.lat, e.latlng.lng);
		lat2 = e.latlng.lat;
		long2 = e.latlng.lng;
			rad = function(x) {return x*Math.PI/180;}

	var R     = 6378.137;                          
	var dLat  = rad( lat2 - lat );
	var dLong = rad( long2 - long );

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	distancia = d.toFixed(1);
	
	Puntuacion = (distancia * numFotos);
	alert("Solucion: \nBuscabas: "+lugar + "\nError en Km: " + distancia + "\nPuntuacion: " + Puntuacion+"\n**Menos puntos es mejor**");
	//$("#PanelControl").append("Puntuacion "+Puntuacion);


	historygames();
	//playGame();
	});
}

function getfotos(){
	numFotos = 1;
	$.getJSON("juegos/"+tipogame+".json",function(data){
	var ale = data.lista[Math.round(Math.random() * 5)];
	lat = ale.coordinates[0];
	long = ale.coordinates[1];
	lugar = ale.properties.name;
//pido fotos
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
        {
          tags: lugar,
          tagmode: "any",
          format: "json"
        },	function(data){
        		var num=0;
        		myInter = setInterval(function(){
                                $("#fotos").empty(); //quito la foto anterior
        			$("<img/>").attr("src", data.items[num].media.m).prependTo("#fotos");
                                if(num != data.items.length - 1)
        					num++;
                                else
                                        num = 0;
			numFotos++;
        		}, nivel*1000);
	    });       
    	
	});
}

function playGame(){
	history.pushState({}, "", tipogame+nivel); //hago pushstate cada vez que empiezo una partida
	//actHistory();
	clearInterval(myInter);
	getfotos();
	$("#bottipo").hide();
	$("#map").show();
        $("#fotos").show();
}
function playOldGame(Tgame,Level,Points){
	$("#startbotton").hide();
	$(".col-lg-4").hide();
	getfotos();
	$("#bottipo").hide();
	$("#map").show();
        $("#fotos").show();
	clearInterval(myInter);
	tipogame = Tgame;
	nivel = Level;
	PuntuacionOld = Points;
}
function playNewGame(){
	history.pushState({}, "", tipogame+nivel);//hago pushstate en la primera partida
	putmap(); //Cargo el mapa una sola vez
	getfotos();
	$("#bottipo").hide();
	$("#map").show();
        $("#fotos").show();
}
   $("#startbotton").click(function(){
	$("#startbotton").hide();
        $("#botnivel").show();
	$(".col-lg-4").hide();
	history.pushState({}, "", "Start");
    });

   $("#botnivel").click(function(){
	$("#botnivel").hide();
        $("#bottipo").show();
    });

   $("#botfacil").click(function(){
	nivel=5;
    });

   $("#botmedio").click(function(){
	nivel=3;
    });
   $("#botdificil").click(function(){
	nivel=1;
    });

   $("#botcapitales").click(function(){
	tipogame="capitales";
        $("#bottipo").hide();
	if(!first){
		playNewGame();
		first = true;
	}else
		playGame();
    });

   $("#botmarcas").click(function(){
	tipogame="marcas";
        $("#bottipo").hide();
	if(!first){
		playNewGame();
		first = true;
	}else
		playGame();
    });
   $("#botequipo").click(function(){
	tipogame="equipos";
       $("#bottipo").hide();
	if(!first){
		playNewGame();
		first = true;
	}else
		playGame();
    });
   $("#restart").click(function(){
	tipogame="equipos";
       	$("#bottipo").hide();
	
	restartGame();
	
    });

function restartGame(){
	//history.pushState({}, "", "Game");
	$("#map").hide();
	$("#fotos").hide();
	$("#bottipo").hide();
	$("#botnivel").hide();
	$("#startbotton").show();
	$(".col-lg-4").show();
	//$("#PanelControl").html(juegos);
}

window.onpopstate = function(event) {

	if(JSON.stringify(event.state.tipogame) != undefined){
		juegos+= "<li onclick='resumegame("+pos+");playOldGame("+JSON.stringify(event.state.tipogame)+
		","+JSON.stringify(event.state.nivel)+","+JSON.stringify(event.state.Puntuacion) +");'>juegos : " 
		+ JSON.stringify(event.state.tipogame) + ", nivel : " 
		+JSON.stringify(event.state.nivel)+", puntos: "
		+JSON.stringify(event.state.Puntuacion)+"</li>";
	}/*else{
alert("noentro");
		juegos += "und";
	}*/
//alert("fuera");
}

function resumegame(pos){
	if(pos>0){
		window.history.go(-(window.history.length-pos-1));
	}else{
		window.history.go(-(window.history.length+pos));
	}
	oldgame = true;
}

function historygames(){
	juegos ="<p><ul>";
	cambiosHistory = window.history.length;
	if(cambiosHistory>1 && !oldgame){
		var object = {tipogame: tipogame, Puntuacion: Puntuacion, nivel: nivel};
		history.pushState(object, "partida", tipogame); //Hago pushstate cada vez que acabo una partida
		
		cambiosHistory = window.history.length;
		for(i=1; i<cambiosHistory;i++){
			window.history.back();
	   	}
		pos = -cambiosHistory+1;
	   	window.history.go(cambiosHistory-1);	
	}else{
		juegos+= "<li onclick='resumegame("+pos+");playOldGame("+JSON.stringify(tipogame)+
		","+JSON.stringify(nivel)+","+JSON.stringify(Puntuacion) +");'>juegos : " 
		+ JSON.stringify(tipogame) + ", nivel : " 
		+JSON.stringify(nivel)+", puntos: "
		+JSON.stringify(Puntuacion)+"</li>";
		
		var ira= +window.history.length;
		for(i=1; i<cambiosHistory;i++){
				window.history.forward();
	   	}
		oldgame = false;
	}
	juegos+="</ul></p>";
	$("#PanelControl").empty();
   	$("#PanelControl").append("Puntuacion "+juegos);
	restartGame();
}

$(document).ready(function() {
	$("#map").hide();
        $("#fotos").hide();
	$("#bottipo").hide();
	$("#botnivel").hide();
	$("#startbotton").show();
	$(".col-lg-4").show();
	$("#PanelControl").append("...Sin partidas...");
	//history.pushState({}, "", "Principal");//hago pushstate al tener el dom
});

