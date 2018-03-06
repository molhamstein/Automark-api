'use strict';

module.exports = function(Carstype) {
	Carstype.afterRemote('**', function (ctx, user, next) {
	  if(ctx.result) {
	    if(Array.isArray(ctx.result)) {
	      ctx.result.forEach(function (result) {
	        var t_ar = result.name_t.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	        if(t_ar != null)
	        	result.name_t_ar = t_ar[1]
	        else
	        	result.name_t_ar = result.name_t;
	        var t_en = result.name_t.match(/<!--:en-->(.*)<!--:-->/);
	        if(t_en != null)
	        	result.name_t_en = t_en[1]
	        else
	        	result.name_t_en = result.name_t;
	      });
	    } else {
	      	var t_ar = ctx.result.name_t.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	      	if(t_ar != null)
	      		ctx.result.name_t_ar = t_ar[1]
	      	else
	      		ctx.result.name_t_ar = result.name_t;
	      	var t_en = ctx.result.name_t.match(/<!--:en-->(.*)<!--:-->/);
	      	if(t_en != null)
	      		ctx.result.name_t_en = t_en[1]
	      	else
	      		ctx.result.name_t_en = result.name_t;
	    }
	  }

	  next();
	});
};
