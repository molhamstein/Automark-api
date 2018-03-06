'use strict';

module.exports = function(Category) {
	Category.afterRemoteError('*.*', function(context, next) {
	    console.log(context.error)
	      if (context.error && context.error.toString().indexOf("No instance with id") >= 0)
	      {
	          context.res.status(404).json({data:null, status:context.status, msg: 'No such data matching criteria'});
	      } 
	      else if(context.error){
	      		context.res.status(502).json({data:null, status:context.status, msg: 'Internal server error'});
	      }
	      else {
	          next();
	      }
	  });
  
  	Category.afterRemote('**', function (ctx, user, next) {
	  if(ctx.result) {
	    if(Array.isArray(ctx.result)) {
	      ctx.result.forEach(function (result) {
	        var t_ar = result.code_ss.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	        if(t_ar != null)
	        	result.code_ss_ar = t_ar[1]
	        else
	        	result.code_ss_ar = result.code_ss;
	        var t_en = result.code_ss.match(/<!--:en-->(.*)<!--:-->/);
	        if(t_en != null)
	        	result.code_ss_en = t_en[1]
	        else
	        	result.code_ss_en = result.code_ss;
	      });
	    } else {
	      	var t_ar = ctx.result.code_ss.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
	      	if(t_ar != null)
	      		ctx.result.code_ss_ar = t_ar[1]
	      	else
	      		ctx.result.code_ss_ar = result.code_ss;
	      	var t_en = ctx.result.code_ss.match(/<!--:en-->(.*)<!--:-->/);
	      	if(t_en != null)
	      		ctx.result.code_ss_en = t_en[1]
	      	else
	      		ctx.result.code_ss_en = result.code_ss;
	    }
	  }

	  next();
	});
};
