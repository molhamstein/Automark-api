'use strict';

module.exports = function(Cars) {
	var app = require('../../server/server');
	const connector = app.dataSources.mysql_automark_db.connector

	Cars.cars_meta_option_by_id = function(id,include,callback) {
		if(typeof id !="undefiend" && !isNaN(id)){

			if(include=="users")
				var sql = " select * from cars inner join cars_meta on cars_meta.id_cars_m = cars.id_c inner join option_car on code_o = code_m inner join users on users.id_u = cars.id_user where id_cars_m = "+id
			else	
				var sql = " select * from cars inner join cars_meta on cars_meta.id_cars_m = cars.id_c inner join option_car on code_o = code_m where id_cars_m = "+id
			connector.execute(sql, null, (err, resultObjects) => {
			   if(!err){

			   		process.nextTick(function() {
			      		callback(null, normalize_results(resultObjects,include));
				    });
			   }
			   else
				    process.nextTick(function() {
				      callback(err, null);
				    });
			   	//next();
			})
		}
		else
			process.nextTick(function() {
		      callback("Invalid argument", null);
		    });
	}

	Cars.cars_meta_option = function(offset,limit,include,callback) {
		if(include=="users")
			var sql = " select * from cars inner join cars_meta on cars_meta.id_cars_m = cars.id_c inner join option_car on code_o = code_m inner join users on users.id_u = cars.id_user order by id_c"
		else	
			var sql = " select * from cars inner join cars_meta on cars_meta.id_cars_m = cars.id_c inner join option_car on code_o = code_m order by id_c"
		if(typeof limit !="undefiend" && offset !="undefiend" && !isNaN(limit) && !isNaN(offset)){
			sql += " limit "+limit+" offset "+(offset * limit);
			connector.execute(sql, null, (err, resultObjects) => {
			   if(!err){
			   		process.nextTick(function() {
			      		callback(null, normalize_results(resultObjects,include));
				    });
			   }
			   else
				    process.nextTick(function() {
				      callback(err, null);
				    });
			   	//next();
			})
		}
		else
			process.nextTick(function() {
				      callback("Invalid argument", null);
				    });
	}

	function normalize_results(resultObjects,include) {
		var all_result = [];
		var car_id = 0;
		for (var i = 0; i < resultObjects.length; i++) {
			var result = {}
			result.id_c = resultObjects[i].id_c
			result.title_c = resultObjects[i].title_c
			result.mysql = resultObjects[i].mysql
			result.type_c = resultObjects[i].type_c
			result.model_c = resultObjects[i].model_c
			result.category_c = resultObjects[i].category_c
			result.year_c = resultObjects[i].year_c
			result.color_c = resultObjects[i].color_c
			result.odometer_c = resultObjects[i].odometer_c
			result.transmission_c = resultObjects[i].transmission_c
			result.status_c = resultObjects[i].status_c
			result.body_c = resultObjects[i].body_c
			result.form_c = resultObjects[i].form_c
			result.price_c = resultObjects[i].price_c
			result.Country_c = resultObjects[i].Country_c
			result.city_c = resultObjects[i].city_c
			result.features_c = resultObjects[i].features_c

			/*
			** Users attributes
			*/
			if(include=="users"){
				result.users={}
				result.users.id_u =resultObjects[i].id_u
				result.users.username =resultObjects[i].username
				result.users.joined_u =resultObjects[i].joined_u
				result.users.group_u =resultObjects[i].group_u
				result.users.name_u =resultObjects[i].name_u
				result.users.lastname_u =resultObjects[i].lastname_u
				result.users.age_u =resultObjects[i].age_u
				result.users.mobile_u =resultObjects[i].mobile_u
				result.users.telphone =resultObjects[i].telphone
				result.users.email_u =resultObjects[i].email_u
				result.users.lastnews_u =resultObjects[i].lastnews_u
				result.users.option_u =resultObjects[i].option_u
				result.users.act_u =resultObjects[i].act_u
				result.users.image_u =resultObjects[i].image_u
			}

			try {
			    result.images_c = JSON.parse(resultObjects[i].images_c)
			}
			catch(err) {
			    result.images_c = resultObjects[i].images_c
			}

			result.type_ads_c = resultObjects[i].type_ads_c
			result.shows_c = resultObjects[i].shows_c
			result.description_c = resultObjects[i].description_c
			result.special_c = resultObjects[i].special_c
			result.dateadd_c = resultObjects[i].dateadd_c
			result.end_c = resultObjects[i].end_c
			result.id_user = resultObjects[i].id_user
			result.act_c = resultObjects[i].act_c
			result.vzt_c = resultObjects[i].vzt_c
			result.cars_meta_details = [];
			for (i; i < resultObjects.length; i++) {
				if(car_id > 0 && car_id != resultObjects[i].id_c){
					car_id = resultObjects[i].id_c
					i--;
					break
				}
				car_id = resultObjects[i].id_c
				var tempObj = {}
		  		tempObj.id_m = resultObjects[i].id_m
				tempObj.id_cars_m = resultObjects[i].id_cars_m
				tempObj.code_m = resultObjects[i].code_m
				tempObj.value_m  = resultObjects[i].value_m 

				tempObj.id_o = resultObjects[i].id_o 
				tempObj.name_o = resultObjects[i].name_o 
				tempObj.code_o = resultObjects[i].code_o 
				
				try {
					    tempObj.option_o = JSON.parse(resultObjects[i].option_o) 
					}
					catch(err) {
					    tempObj.option_o = resultObjects[i].option_o
					}

				tempObj.type_o = resultObjects[i].type_o 
				tempObj.order_o = resultObjects[i].order_o 

				var tempParsed = parseXML(tempObj.name_o);
				tempObj.name_o_ar = tempParsed.name_o_ar
				tempObj.name_o_en = tempParsed.name_o_en

				result.cars_meta_details.push(tempObj)	
			}
			all_result.push(result);
		}
		return all_result;
	}

	function parseXML(argument) {
		var result = {}
		var t_ar = argument.match(/<!--:ar-->(.*)<!--:--><!--:en-->/);
        if(t_ar != null)
        	result.name_o_ar = t_ar[1]
        else
        	result.name_o_ar = argument;

        var t_en = argument.match(/<!--:en-->(.*)<!--:-->/);
        if(t_en != null)
        	result.name_o_en = t_en[1]
        else
        	result.name_o_en = argument;

        return result;
	}
	
	Cars.observe('before save', function(ctx, next) {
		console.log(ctx);
	  	if(ctx.isNewInstance){
	  		ctx.instance.id_user = ctx.options.accessToken.userId
	  		next();
	  	}
	  	else if(ctx.instance.id_c){
	  		console.log("here")
	  		Cars.findOne({
	            where: {
	              id_c: ctx.instance.id_c
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

	Cars.observe('after save', function(ctx, next) {
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