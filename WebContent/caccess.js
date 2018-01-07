/**
 * 
 */

var CAccess = function(){
	this.fbase = new Firebase("https://bustracking-busloc.firebaseio.com/");
};

CAccess.prototype = {
	getMyBusses : function(terminal,update){
		
		var busses = this.fbase.child("BusLocation").orderByKey();
		busses.on("value",function(snapshot){
			var qs = "";
			console.log("Function called, in BusLocation ");
			snapshot.forEach(function(snap){
				if(snap.child('to').val() === terminal)
				{
					console.log("---> in snap ");
					/*
					qs += "Bus Name : "+snap.key()+"<br/>";
					qs += "-> From : "+snap.child('from').val()+"<br/>";  
					qs += "-> To : "+snap.child('to').val()+"<br/>";  
					qs += "-> Latitude : "+snap.child('latitude').val()+"<br/>";  
					qs += "-> Longitude : "+snap.child('longitude').val()+"<br/>";  
					*/
					update({lat : Number(snap.child('latitude').val()),lng : Number(snap.child('longitude').val())});
					//({lat : Number(snap.child('latitude').val()),lng : Number(snap.child('longitude').val())});
					//console.log("\n\t --- , lat : "+snap.child('latitude').val()+" , lng : "+snap.child('longitude').val());
					//console.log("\nbus position : "+boxref.getPosition());
				}
				else
					console.log("---> not in snap : "+terminal);
				//snap.forEach(function(temp){
				//});
			});
			
			//boxref.innerHTML = qs;
		});
	}
	,
	getBusLocation : function(busId){
		
	}
	,
	getTerminal : function(terminal,tupdate){
		var trmnl = this.fbase.child("Terminals").orderByKey();
		trmnl.on("value",function(snapshot){
			var qs = "";
			console.log("Function called, in BusLocation ");
			snapshot.forEach(function(snap){
				if(snapshot.hasChild(terminal))
				{
					console.log("---> in snap ");
					tupdate(
							 { 
								 lat : Number(snapshot.child(terminal).child('latitude').val())
								,lng : Number(snapshot.child(terminal).child('longitude').val())
							 }
							);
				}
				else
					console.log("---> not in snap : "+terminal);
			});
			
		});
	}
};


/*
query.on("value",function(snapshot){
	//alert("Key : "+snapshot.key()+" \n"
		//	+"Value : "+snapshot.val());
	
	var data = "";
	
	snapshot.forEach(function(snap){
		
		data += snap.key()+" : "+snap.val()+"\n";
		
	});
	
	alert(data);
	
});
*/
//getLocations of bus
//function getBusLocation(myTerminal){
// get to locations
// update list
//}