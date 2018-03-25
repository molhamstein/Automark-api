'use strict';

module.exports = function(Mazad) {
	Mazad.observe('before save', function(ctx, next) {
		if(ctx.isNewInstance){
	  		ctx.instance.id_user = ctx.options.accessToken.userId
	  		next();
	  	}
	  })
};
