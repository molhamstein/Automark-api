'use strict';

module.exports = function(Testuser) {
	Testuser.observe('before save', function(ctx, next) {
	  	console.log('Car before save', ctx.instance);
	  	
	  	var request=require('sync-request');
	    var res1 = request('GET', 'http://automark.ae/users/login/hashPass?password='+ctx.instance.password);
	        console.log(">>>>>>>>>>>>>>>>>>>>>"); 
	        console.log(res1.body);
	        console.log(JSON.parse(res1.body).salt);
	        var base64Salt = JSON.parse(res1.body).salt
	        //var decodedSalt = Base64Decode(base64Salt, 'ISO-8859-1');
	        var decodedSalt = Base64Decode(base64Salt);
	        //console.log('decoded: '+decodedSalt);
	        //return {pass:JSON.parse(res1.body).hashed_password, salt: decodedSalt};


	        var b64string = JSON.parse(res1.body).salt;
			var buf = Buffer.from(b64string, 'base64'); // Ta-da


	  	ctx.instance.salt_u = buf.toString('latin1');
	  	ctx.instance.password = JSON.parse(res1.body).hashed_password;
	  	next();
	});

	function Base64Decode(str, encoding = 'utf-8') {
      var base64js = require('base64-js')
      var TextDecoderLib = require('text-encoding')
      var bytes = base64js.toByteArray(str);
      return new TextDecoderLib.TextDecoder(encoding).decode(bytes);
  	}
};
