'use strict';
var loopback = require('loopback');
var app = module.exports = loopback();
module.exports = function(Geoaddress) {
	/**
 * service lookup the local data set if not then get data from google
 * @param {geopoint} latlang latitude and longitude
 * @param {Function(Error, object)} callback
 */
//
Geoaddress.afterRemote('reverseGeocode', function( context,unused, next) {
    if(context.result.length===0){
    	console.log('length 0');
//    	next();
	var google = Geoaddress.app.dataSources.google;
	 google.geocode(context.args.latlang.lat,context.args.latlang.lng,'AIzaSyBwf5g-yaO0LczUrTukYgr7eWnlSYyfJq0', /* @callback */ function(err,response,ctx){
    	if (err) throw err; //error making request
    	
    	    if (response.error) {
        next('> response error: ' + response.error.stack);
      }
 		var loc = {};
 			loc.location = {"type":response[0].geometry.location_type,"coordinates": [context.args.latlang.lat,context.args.latlang.lng] };
 			loc.formatted_address = response[0].formatted_address;
 			loc.location_type= response[0].geometry.location_type;
 			loc.types = response[0].types;
// 			console.log('my loc Object *',loc);
 			context.result=loc;
//------------		
 	Geoaddress.create(loc, function (err,items){
      	
      	if(err!==null){
      		
      	 next('> response error: ' + items.error.stack);
      	}
      });
////------------------ 		
// 		
// 		
 		next();
// 		//return response;
});
//
    }else{
//		console.log( "Lenght is not 0");    	
		next();
    }
    
    
//      callback(null, {"HI":12});
});

Geoaddress.reverseGeocode = function(latlang, callback) {
//	var here = new GeoPoint({lat: 10.32424, lng: 5.84978});
//	var here = new loopback.GeoPoint(latlang);
	var filter = {where: {'location.coordinates': [latlang.lat,latlang.lng]}};
//	var filter = {where: {'location.coordinates': {near: latlang}}, limit:3};
//					{where: {location: {near: here}}, limit:3}	
      Geoaddress.find(filter, function (err,items){
      	
      	if(err!==null){
      		
      		return callback(err);
      	}
       callback(null, items);
       
      
      });
  
};
	

};
