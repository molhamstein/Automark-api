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
  
};
