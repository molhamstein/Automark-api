'use strict';

module.exports = function(Comments) {
	Comments.observe('before save', function(ctx, next) {
		console.log(ctx);
	  	if(ctx.isNewInstance){
	  		ctx.instance.id_user = ctx.options.accessToken.userId
	  		next();
	  	}
	  	else if(ctx.instance.id_com){
	  		console.log("here")
	  		Comments.findOne({
	            where: {
	              id_com: ctx.instance.id_com
	            }
	        },function(err,res){
	        	console.log(res.id_user + " == "+ctx.options.accessToken.userId)
	        	if(err) return next(err);
	        	else if(res.id_user == ctx.options.accessToken.userId){
	        		ctx.instance.id_user = ctx.options.accessToken.userId
	        		console.log("HAS ACCESS TO EDIT")
	        		next();
	        	}
	        	else if(ctx.options.authorizedRoles.admin == true)
	        		next();
	        	else
	        		return next("Not authorized");	
	        })
	  	}
	  	else 
	  		return next("Not authorized or cant update the requested record");
	});
};
