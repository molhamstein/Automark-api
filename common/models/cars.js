'use strict';

module.exports = function(Cars) {
	var app = require('../../server/server');
	
	Cars.observe('after save', function(ctx, next) {
  	console.log('Car before save', ctx.instance);
  	var Carsmeta = app.models.cars_meta;
  	var itemsProcessed = 0;
  	if(ctx.instance.cars_meta)
  		Object.keys(ctx.instance.cars_meta).forEach(function(k){
	  		ctx.instance.cars_meta[k].id_cars_m = ctx.instance.id_c
	  		Carsmeta.create(ctx.instance.cars_meta[k],function(){})
	    	itemsProcessed++;
			if(itemsProcessed === Object.keys(ctx.instance.cars_meta).length) {
	      		next();
	    	}
		});
	});
};