//------  resources -----
var BusIcon = 'img/bus.png';
var HomeIcon = 'img/home.png';
var BusIcon_w = 20;
var BusIcon_l = 20;


//-------- main map -------

var GMap = function(target){
	this.target = target;
	this.center = { lng : 0 , lat : 0};
	this.zoom = 0;
	this.map = null;
	//this.markers[] = new Array();
};


GMap.prototype = {
	setZoom : function(zm){
		this.zoom = zm;
	},
	setCenter : function(latitude,longitude){
		this.center = { lng : longitude , lat : latitude };
	},
	runMap : function(){
		this.map = new google.maps.Map(
			this.target,
			{
				center : this.center,
				zoom : this.zoom
			}
		);
	},
	getInstance : function(){
		return this.map;
	},
	getCenter : function(){
		return this.center;
	}
	
};


//-----------------Bus Markers-----------

var BusMarker = function(id, map, position){
	this.id = id;
	this.marker = null;
	this.map = map;
	this.position = position;
	this.Icon = new google.maps.MarkerImage(
			BusIcon,
			null, /* size is determined at runtime */
			null, /* origin is 0,0 */
			null, /* anchor is bottom center of the scaled image */
			new google.maps.Size(40, 40)
		);
};

BusMarker.prototype = {
	
	initMarker : function(){
		this.marker = new google.maps.Marker({
			position : this.position,
			icon : this.Icon,
			label : this.id,
			animation : google.maps.Animation.BOUNCE,
			map : this.map 
		})
	}
	,
	getId : function(){
		return this.id;
	}
	,
	setId : function(id){
		this.id = id;
	}
	,
	setPosition : function(position){
		this.marker.setPosition(position);
	}
	,
	getPosition : function(){
		return this.marker.getPosition();
	}
	,
	getMarker : function(){
		return this.marker;
	}	
};

//--------Terminal Marker -----------
var HomeMarker = function(id, map, position){
	this.id = id;
	this.marker = null;
	this.map = map;
	this.position = position;
	this.Icon = new google.maps.MarkerImage(
			HomeIcon,
			null, /* size is determined at runtime */
			null, /* origin is 0,0 */
			null, /* anchor is bottom center of the scaled image */
			new google.maps.Size(40, 40)
		);
};

HomeMarker.prototype = {
	
	initMarker : function(){
		this.marker = new google.maps.Marker({
			position : this.position,
			icon : this.Icon,
			label : this.id,
			animation : google.maps.Animation.BOUNCE,
			map : this.map 
		})
	}
	,
	getId : function(){
		return this.id;
	}
	,
	setId : function(id){
		this.id = id;
	}
	,
	setPosition : function(position){
		this.marker.setPosition(position);
	}
	,
	getPosition : function(){
		return this.position;
	}
	,
	getMarker : function(){
		return this.marker;
	}
};

//-------------- Tie Class -------


var Tie = function( map , src , dest ){
	
	this.map = map;
	this.src = src;
	this.dest = dest;
	
	this.directionsService = new google.maps.DirectionsService;	
	this.directionsRender = new google.maps.DirectionsRenderer({suppressMarkers : true}) ;
	this.directionsRender.setMap(this.map);
};


Tie.prototype = {
	setSource : function(source){
		this.source = source;
	}
	,
	setSource : function(dest){
		this.dest = dest;
	}
	,
	tieUp : function(log,idSrc,idDest){
		var upd = this.directionsRender;
		var src = this.src;
		var dest = this.dest;
		
		this.directionsService.route(
			{
				origin : this.src,
				destination : this.dest,
				travelMode : google.maps.TravelMode.DRIVING,
			}
			,
			function(response,status){
				if( status == google.maps.DirectionsStatus.OK ){
					upd.setDirections(response);
					
					var distance = response.routes[0].legs[0].distance.value;
					var time = response.routes[0].legs[0].duration.value;
					
					var date = new Date();
					var eta = new Date();
					eta.setSeconds(time);
					
					var hdur = eta.getHours() - date.getHours();
					var mdur = eta.getMinutes() - date.getMinutes();
					var sdur = eta.getSeconds() - date.getSeconds();
					
					this.log.updateBox(idSrc,distance,(hdur+" : "+mdur+" : "+sdur));
					
					
					// Display the distance:
					//document.getElementById('distance').innerHTML += 
					//time + " meters";

					// Display the duration:
					//document.getElementById('duration').innerHTML += 
					//hdur +" : "+mdur + " : " + sdur ;
				}
				else{
					alert("Error : "+status);
				}
			}
		);
		
	}
	
};

//-------------- Log -----------

var Log = function(map , log){
	this.map = map;
	this.log = log;
};

Log.prototype = {
	
	initLog : function(position){
		var pos;
		var log = this.log;
		if(position === 'TOP_RIGHT')
			pos = google.maps.ControlPosition.TOP_RIGHT;
		else if(position === 'TOP_LEFT')
			pos = google.maps.ControlPosition.TOP_LEFT;
		else if(position === 'BOTTOM_RIGHT')
			pos = google.maps.ControlPosition.BOTTOM_RIGHT;
		else if(position === 'BOTTOM_LEFT')
			pos = google.maps.ControlPosition.BOTTOM_LEFT;
		
		this.map.controls[pos].push(this.log);
	}
	,
	addBox : function(id){
		if(!this.log.querySelector('#'+id)){
			var div = document.createElement('div');
			div.setAttribute('id',id);
			div.style = "border : 2px solid black ; padding-top : 2px ; padding-bottom : 2px";
			div.innerHTML = "<table>"
				+"<tr>"
					+"<td style = 'color : red'>Logo</td>"
					+"<td>"+id+"</td>"
				+"</tr>"
				+"<tr>"
					+"<td style = 'color : green'>distance</td>"
					+"<td>0</td>"
				+"</tr>"
				+"<tr>"
					+"<td style = 'color : green'>duration</td>"
					+"<td>0</td>"
				+"</tr>"
			+"</table>";
			this.log.appendChild(div);
			return true;
		}
		return false;
	}
	,
	updateBox : function(id,distance,duration){
		console.log("add box id :"+id);
		if(this.log.querySelector("#"+id)){
			var div = document.getElementById(id);
			div.style = "border : 2px solid black ; padding-top : 2px ; padding-bottom : 2px";
			div.innerHTML = "<table>"
				+"<tr>"
					+"<td style = 'color : red'>Logo</td>"
					+"<td>"+id+"</td>"
				+"</tr>"
				+"<tr>"
					+"<td style = 'color : green'>distance</td>"
					+"<td>"+distance+"</td>"
				+"</tr>"
				+"<tr>"
					+"<td style = 'color : green'>duration</td>"
					+"<td>"+duration+"</td>"
				+"</tr>"
			+"</table>";
		}
		else
			console.log('Error : \n\tBox id : '+id+ ' does not exists');
	}
};
