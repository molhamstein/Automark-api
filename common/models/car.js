'use strict';

module.exports = function(Car) {
	var app = require('../../server/server');
	Car.afterRemote('*.save', function(ctx, CarObj, next) {
		var Carsmeta = app.models.Carsmeta; 
	  console.log('Car has been saved', CarObj);
	  if(CarObj.cars_meta)
	  	Object.keys(CarObj.cars_meta).forEach(function(k){
	  		console.log('Car has been saved', CarObj.cars_meta[k]);
		    Carsmeta.create(CarObj.cars_meta[k],function(ctx, CarMetaObj, next){
		    	console.log('CarMetaObj has been saved', CarMetaObj);
		    	console.log('+++++++++++++++++++++++++++++++++++++');
		    	//next();
		    })
		});
	});

	Car.afterRemote('*.*', function(ctx, CarObj, next) {
		//var Carsmeta = app.models.Carsmeta; 
	  console.log('Car has been saved', CarObj);
	  /*if(CarObj.cars_meta)
	  	Object.keys(CarObj.cars_meta).forEach(function(k){
	  		console.log('Car has been saved', CarObj.cars_meta[k]);
		    Carsmeta.create(CarObj.cars_meta[k],function(ctx, CarMetaObj, next){
		    	console.log('CarMetaObj has been saved', CarMetaObj);
		    	console.log('+++++++++++++++++++++++++++++++++++++');
		    	//next();
		    })
		});*/
	});

	Car.observe('before save', function(ctx, next) {
  	console.log('Car before save', ctx.instance);
  	var Carsmeta = app.models.cars_meta;
  	var itemsProcessed = 1;
  	if(ctx.instance.cars_meta)
  		Carsmeta.topId(function (err,result) {
  			var carsMetaId = 0;
  			if(result && result.length>0)
  				carsMetaId = result[0].id_m
  			Object.keys(ctx.instance.cars_meta).forEach(function(k){
		  		ctx.instance.cars_meta[k].id_m = result[0].id_m+itemsProcessed;
		    	itemsProcessed++;
				if((itemsProcessed - 1) === Object.keys(ctx.instance.cars_meta).length) {
		      		next();
		    	}
			});
  		})
	});
};
