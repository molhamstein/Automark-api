'use strict';

module.exports = function(Cars) {
	var app = require('../../server/server');
	const connector = app.dataSources.mysql_automark_db.connector
	
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


/**
 * fetch cars according to cars_meta filters (dynamic fields)
 * @param {object} filter filter object is an array of dynamic attributes filter and each object contains {op, code_m, _1, _2}
 * @param {Function(Error, array)} callback
 */
	Cars.cars_advertisment = function(filter, callback) {
	  var data;
	  // TODO
	  	console.log("filter  ssadas")
	  	var filterCondition = generateFilter(filter);
	 	var sql = " select * ,COUNT(id_m) from cars inner join cars_meta on cars.id_c = cars_meta.id_cars_m "
	  	if(filterCondition !== null && filterCondition.length > 0)
	  		sql += " where "+filterCondition + " GROUP by id_cars_m HAVING COUNT(id_m) = "+filter.length 
	  	console.log(sql);
	  	connector.execute(sql, null, (err, resultObjects) => {
		   if(!err){
		   	    process.nextTick(function() {
			      callback(null, resultObjects);
			    });
		   }
		   else
		   		process.nextTick(function() {
			      callback(err, null);
			    });
		   	//next();
		})
	};	

	function generateFilter(filter) {
		if(filter && filter.length>0){
			var filterCondition="";
			for (var i = 0; i < filter.length; i++) {
					
				if(i > 0 && i < filter.length)
					filterCondition += " OR "
				switch(filter[i].op) {
				    case "between":
				        filterCondition += "(code_m='"+filter[i].code_m+"' and value_m BETWEEN "+filter[i]._1+" and "+filter[i]._2+")"
				        break;
				    case "=":
				        filterCondition += "(code_m='"+filter[i].code_m+"' and value_m = '"+filter[i]._1+"')"
				        break;
				    case "<":
				        filterCondition += "(code_m='"+filter[i].code_m+"' and value_m < "+filter[i]._1+" )"
				        break;
				    case ">":
				        filterCondition += "(code_m='"+filter[i].code_m+"' and value_m > "+filter[i]._1+" )"
				        break;
				    case "<=":
				        filterCondition += "(code_m='"+filter[i].code_m+"' and value_m <= "+filter[i]._1+" )"
				        break;
				    case ">=":
				        filterCondition += "(code_m='"+filter[i].code_m+"' and value_m >= "+filter[i]._1+" )"
				        break;
				}
			}

			return filterCondition;
		}
		else
			return null;
	}
};