var fs = require("fs");
var sys = require('util');
var path = require("path");
var exec = require('child_process').exec;
var wrench = require(path.join(process.argv[1],"../node_modules/wrench"));
var models = require(process.argv[3]);
console.log(models.pages);
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.single = function(){
    return this.slice(0,this.length-1);
}
function puts(error, stdout, stderr) { 
	/**client js**/
	wrench.mkdirSyncRecursive(path.join(process.argv[2],"client/js"), 0777);
	wrench.copyDirSyncRecursive(path.join(process.argv[1], "../crudtemplate/client/js"), path.join(process.argv[2],"client/js"));

	/**client css**/
	wrench.mkdirSyncRecursive(path.join(process.argv[2],"client/css"), 0777);
	wrench.copyDirSyncRecursive(path.join(process.argv[1], "../crudtemplate/client/css"), path.join(process.argv[2],"client/css"));
	
	/**client controllers**/
	wrench.mkdirSyncRecursive(path.join(process.argv[2],"client/controllers/copy"), 0777);
	wrench.copyDirSyncRecursive(path.join(process.argv[1], "../crudtemplate/client/controllers/copy"), path.join(process.argv[2],"client/controllers/copy"));
	/**client views**/
	wrench.mkdirSyncRecursive(path.join(process.argv[2],"client/views"), 0777);

	/**global libs**/
	wrench.mkdirSyncRecursive(path.join(process.argv[2],"lib/copy"), 0777);
	wrench.copyDirSyncRecursive(path.join(process.argv[1], "../crudtemplate/lib/copy"), path.join(process.argv[2],"lib/copy"));
	
	/**public**/
	wrench.mkdirSyncRecursive(path.join(process.argv[2],"public"), 0777);

	/**server models**/
	wrench.mkdirSyncRecursive(path.join(process.argv[2],"server/models"), 0777);
	fs.readFile(path.join(process.argv[1], "../crudtemplate/.meteor/packages"), function (err, data) {
		data = new String(data);
		fs.writeFile(path.join(process.argv[2],".meteor/packages"),data,function(err){
			if(err) throw err;
		});
	  
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/client/controllers/posts.js"), function (err, data) {
	  var o = data;
	  for(i in models){
		data = o;
		data = new String(data);
		data = data.replace(/posts/g,i);
		data = data.replace(/Posts/g,i.capitalize());
		data = data.replace(/post/g,i.single());
		data = data.replace(/Post/g,i.single().capitalize());
		fs.writeFile(path.join(process.argv[2],"client/controllers/"+i+".js"),data,function(err){
			if(err) throw err;
		});
	  }
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/client/views/editposts.html"), function (err, data) {
	  var o =data;
	  for(i in models){
		data = o;
		data = new String(data);
		data = data.replace(/posts/g,i);
		data = data.replace(/Posts/g,i.capitalize());
		data = data.replace(/post/g,i.single());
		data = data.replace(/Post/g,i.single().capitalize());
		fs.writeFile(path.join(process.argv[2],"client/views/edit"+i+".html"),data,function(err){
			if(err) throw err;
		});
	  }
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/client/views/newposts.html"), function (err, data) {
	  var o =data;
	  for(i in models){
		data = o;
		data = new String(data);
		data = data.replace(/posts/g,i);
		data = data.replace(/Posts/g,i.capitalize());
		data = data.replace(/post/g,i.single());
		data = data.replace(/Post/g,i.single().capitalize());
		fs.writeFile(path.join(process.argv[2],"client/views/new"+i+".html"),data,function(err){
			if(err) throw err;
		});
	  }
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/client/views/posts.html"), function (err, data) {
	  var o = data;
	  for(i in models){
		data = o;
		var header = "";
		var content = "";
		for(a in models[i]){
			header += "<td>"+ a.capitalize() + "</td>";
			content += "<td>{{"+ a + "}}</td>";
		}
		data = new String(data);
	
		data = data.replace(/posts/g,i);
		data = data.replace(/Posts/g,i.capitalize());
		data = data.replace(/post/g,i.single());
		data = data.replace(/Post/g,i.single().capitalize());
		data = data.replace("{{header}}",header);
		data = data.replace("{{content}}",content);
		fs.writeFile(path.join(process.argv[2],"client/views/"+i+".html"),data,function(err){
			if(err) throw err;
		});
	  }
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/client/views/navigation.html"), function (err, data) {
	  var header = "";
	  for(i in models){
		header += "<li><a href='/" + i + "'>" + i.capitalize() + "</a></li>";
	  }
		data = new String(data);
		data = data.replace("{{header}}",header);
		fs.writeFile(path.join(process.argv[2],"client/views/navigation.html"),data,function(err){
			if(err) throw err;
		});
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/server/models/posts.js"), function (err, data) {
	  var o = data;
	  for(i in models){
	 	data = o;
		data = new String(data);
		data = data.replace(/posts/g,i);
		data = data.replace(/Posts/g,i.capitalize());
		data = data.replace(/post/g,i.single());
		data = data.replace(/Post/g,i.single().capitalize());
		fs.writeFile(path.join(process.argv[2],"server/models/"+ i +".js"),data,function(err){
			if(err) throw err;
		});
	  }
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/lib/models.js"), function (err, data) {
	  var o = data;
	  for(i in models){
		data = o;
		var validation = JSON.stringify(models[i]);
		
		data = new String(data);
		
		data = data.replace(/posts/g,i);
		data = data.replace(/Posts/g,i.capitalize());
		data = data.replace(/post/g,i.single());
		data = data.replace(/Post/g,i.single().capitalize());
		data = data.replace("{{validationcontent}}",validation);
		fs.writeFile(path.join(process.argv[2],"lib/model_"+ i +".js"),data,function(err){
			if(err) throw err;
		});
	  }
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/crudtemplate.css"), function (err, data) {
		data = new String(data);
		fs.writeFile(path.join(process.argv[2],process.argv[2]+".css"),data,function(err){
			if(err) throw err;
		});
	  
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/crudtemplate.html"), function (err, data) {
		data = new String(data);
		fs.writeFile(path.join(process.argv[2],process.argv[2]+".html"),data,function(err){
			if(err) throw err;
		});
	  
	 //console.log(data);
	});
	fs.readFile(path.join(process.argv[1], "../crudtemplate/crudtemplate.js"), function (err, data) {
		data = new String(data);
		fs.writeFile(path.join(process.argv[2],process.argv[2]+".js"),data,function(err){
			if(err) throw err;
		});
	  
	 //console.log(data);
	});
}


/**Create meteor project**/
exec(path.join(process.argv[1], "../meteor/meteor")  + " create " + process.argv[2] , puts);



