'use strict';

module.exports = function(Cars) {
	var app = require('../../server/server');
	const connector = app.dataSources.mysql_automark_db.connector
	
	Cars.observe('after save', function(ctx, next) {
  	console.log('Car before save', ctx.instance);
  	var Carsmeta = app.models.cars_meta;
  	var itemsProcessed = 0;
  	if(ctx.instance.cars_meta && ctx.instance.cars_meta.length > 0)
  		Object.keys(ctx.instance.cars_meta).forEach(function(k){
	  		ctx.instance.cars_meta[k].id_cars_m = ctx.instance.id_c
	  		Carsmeta.create(ctx.instance.cars_meta[k],function(){})
	    	itemsProcessed++;
			if(itemsProcessed === Object.keys(ctx.instance.cars_meta).length) {
	      		next();
	    	}
		});
  	else
  		next();
	});

	Cars.observe('after save', function(ctx, next) {
  		var Carsmeta = app.models.cars_meta;
  		try {
  			Carsmeta.remove({id_cars_m: ctx.instance.id_c},function(err,result){
				if(!err)
					addCars_meta(Carsmeta,ctx,next);
  			})
  		}catch(err) {
			console.log("No deleted cars_meta records")
			addCars_meta(Carsmeta,ctx,next);
		}
	});

function addCars_meta(Carsmeta,ctx,next) {
	var itemsProcessed = 0;
	if(ctx.instance.cars_meta && ctx.instance.cars_meta.length > 0)
  		Object.keys(ctx.instance.cars_meta).forEach(function(k){
	  		//Carsmeta.update({id_m: ctx.instance.cars_meta[k].id_m},ctx.instance.cars_meta[k],function(){})
	  		ctx.instance.cars_meta[k].id_cars_m = ctx.instance.id_c
	  		delete ctx.instance.cars_meta[k].id_m
	  		Carsmeta.create(ctx.instance.cars_meta[k],function(){})
	    	itemsProcessed++;
			if(itemsProcessed === Object.keys(ctx.instance.cars_meta).length) {
	      		next();
	    	}
		});
  	else
  		next();
}
/**
 * fetch cars according to cars_meta filters (dynamic fields)
 * @param {object} filter filter object is an array of dynamic attributes filter and each object contains {op, code_m, _1, _2}
 * @param {Function(Error, array)} callback
 */
	Cars.cars_advertisment = function(dynamic_filter,static_filter,offset,limit, callback) {
	  var data;
	  // TODO
	  	console.log("filter >"+limit )
	  	console.log("filter >"+offset)
	  	var filterCondition_CarsMeta = generateCarsMetaFilter(dynamic_filter);
	  	var filterCondition_CarsFilter = generateCarsFilter(static_filter);

	 	var sql = " select * ,COUNT(id_m) from cars inner join cars_meta on cars.id_c = cars_meta.id_cars_m "

	 	if((filterCondition_CarsFilter !== null && filterCondition_CarsFilter.length > 0) && !(filterCondition_CarsMeta !== null && filterCondition_CarsMeta.length > 0))
	 		sql += " where "+filterCondition_CarsFilter + " " ;

	  	if((filterCondition_CarsMeta !== null && filterCondition_CarsMeta.length > 0) && !(filterCondition_CarsFilter !== null && filterCondition_CarsFilter.length > 0))
	  		sql += " where "+filterCondition_CarsMeta + " GROUP by id_cars_m HAVING COUNT(id_m) = "+dynamic_filter.length 

	  	if ((filterCondition_CarsMeta !== null && filterCondition_CarsMeta.length > 0) && (filterCondition_CarsFilter !== null && filterCondition_CarsFilter.length > 0))
			sql += " where "+filterCondition_CarsFilter + " and ("+ filterCondition_CarsMeta + ") GROUP by id_cars_m HAVING COUNT(id_m) >= "+dynamic_filter.length 	  		

		if(typeof limit !="undefiend" && offset !="undefiend")
			sql += " limit "+limit+" offset "+(offset * limit);

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

	function generateCarsMetaFilter(filter) {
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
				    case "like":
				        filterCondition += "(code_m='"+filter[i].code_m+"' and value_m like '%"+filter[i]._1+"%' )"
				        break;    
				}
			}

			return filterCondition;
		}
		else
			return null;
	}

	function generateCarsFilter(filter) {
		if(filter && filter.length>0){
			var filterCondition="";
			for (var i = 0; i < filter.length; i++) {
					
				if(i > 0 && i < filter.length)
					filterCondition += " and "
				switch(filter[i].op) {
				    case "between":
				        filterCondition += filter[i].option+" BETWEEN "+filter[i]._1+" and "+filter[i]._2+" "
				        break;
				    case "=":
				        filterCondition += filter[i].option+" = '"+filter[i]._1+"' "
				        break;
				    case "<":
				        filterCondition += filter[i].option+" < "+filter[i]._1+" "
				        break;
				    case ">":
				        filterCondition += filter[i].option+" > "+filter[i]._1+" "
				        break;
				    case "<=":
				        filterCondition += filter[i].option+" <= "+filter[i]._1+" "
				        break;
				    case ">=":
				        filterCondition += filter[i].option+" >= "+filter[i]._1+" "
				        break;
				    case "like":
				        filterCondition += filter[i].option+" like '%"+filter[i]._1+"%' "
				        break;    
				}
			}

			return filterCondition;
		}
		else
			return null;
	}
};