'use strict';

module.exports = function(City) {
  	City.afterRemote('**', function (ctx, user, next) {
	  if(ctx.result) {
	    if(Array.isArray(ctx.result)) {
	      ctx.result.forEach(function (result) {
	        var t_ar = result.name_c.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	        if(t_ar != null)
	        	result.name_c_ar = t_ar[1]
	        else
	        	result.name_c_ar = result.name_c;
	        var t_en = result.name_c.match(/<!--:en-->(.*)<!--:-->/);
	        if(t_en != null)
	        	result.name_c_en = t_en[1]
	        else
	        	result.name_c_en = result.name_c;
	      });
	    } else {
	      	var t_ar = ctx.result.name_c.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	      	if(t_ar != null)
	      		ctx.result.name_c_ar = t_ar[1]
	      	else
	      		ctx.result.name_c_ar = result.name_c;
	      	var t_en = ctx.result.name_c.match(/<!--:en-->(.*)<!--:-->/);
	      	if(t_en != null)
	      		ctx.result.name_c_en = t_en[1]
	      	else
	      		ctx.result.name_c_en = result.name_c;
	    }
	  }

	  next();
	});
};
