'use strict';

module.exports = function(Valueoption) {
	Valueoption.afterRemote('**', function (ctx, user, next) {
	  if(ctx.result) {
	    if(Array.isArray(ctx.result)) {
	      ctx.result.forEach(function (result) {
	        var t_ar = result.value_v.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	        if(t_ar != null)
	        	result.value_v_ar = t_ar[1]
	        else
	        	result.value_v_ar = result.value_v;
	        var t_en = result.value_v.match(/<!--:en-->(.*)<!--:-->/);
	        if(t_en != null)
	        	result.value_v_en = t_en[1]
	        else
	        	result.value_v_en = result.value_v;
	      });
	    } else {
	      	var t_ar = ctx.result.value_v.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	      	if(t_ar != null)
	      		ctx.result.value_v_ar = t_ar[1]
	      	else
	      		ctx.result.value_v_ar = result.value_v;
	      	var t_en = ctx.result.value_v.match(/<!--:en-->(.*)<!--:-->/);
	      	if(t_en != null)
	      		ctx.result.value_v_en = t_en[1]
	      	else
	      		ctx.result.value_v_en = result.value_v;
	    }
	  }

	  next();
	});
};
