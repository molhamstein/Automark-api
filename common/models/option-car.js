'use strict';

module.exports = function(Optioncar) {
	Optioncar.afterRemote('**', function (ctx, user, next) {
	  if(ctx.result) {
	    if(Array.isArray(ctx.result)) {
	      ctx.result.forEach(function (result) {
	        var t_ar = result.name_o.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	        if(t_ar != null)
	        	result.name_o_ar = t_ar[1]
	        else
	        	result.name_o_ar = result.name_o;
	        var t_en = result.name_o.match(/<!--:en-->(.*)<!--:-->/);
	        if(t_en != null)
	        	result.name_o_en = t_en[1]
	        else
	        	result.name_o_en = result.name_o;
	      });
	    } else {
	      	var t_ar = ctx.result.name_o.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	      	if(t_ar != null)
	      		ctx.result.name_o_ar = t_ar[1]
	      	else
	      		ctx.result.name_o_ar = result.name_o;
	      	var t_en = ctx.result.name_o.match(/<!--:en-->(.*)<!--:-->/);
	      	if(t_en != null)
	      		ctx.result.name_o_en = t_en[1]
	      	else
	      		ctx.result.name_o_en = result.name_o;
	    }
	  }

	  next();
	});
};
