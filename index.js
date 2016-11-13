var express = require('express');
var bodyparser = require('body-parser');
var notifier = require('node-notifier');
var fs = require('fs');
var path = require('path')
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.post('/task', function(req, res) {
      console.log("New Task Added to System",req.body);
      var  fsName = formFileName(req.body);
      fs.exists(fsName,function(exist){
      	if(exist){
      		
      		writeToTaskLister(fsName,req.body);
      		res.send("OK");
      	}else{
      		
      		var writeStream = fs.createWriteStream(fsName);
			writeStream.end();
      		writeToTaskLister(fsName,req.body);
      		res.send("OK");

      	}
      });
});

function formFileName(data){
	return "TasKForTheDay_"+data.year+"_"+data.month+"_"+data.day+".senthil";
}

function writeToTaskLister(filename,dataWrite){
	var  content =  {};
	fs.readFile(filename, {encoding: 'utf-8'},function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  if(data){
	  	content = JSON.parse(data);
	  }
	  writeAndPush(filename,content,dataWrite);

	});
}

function writeAndPush(filename,content,dataWrite){
	
	  if(content.task){
	  	content.task.push(dataWrite);
	  	
	    addTaskToFile(filename,content);
	  }else{
	  	var temp  =  {};
	  	temp.task = [];
	  	temp.task.push(dataWrite);
	  	
	  	addTaskToFile(filename,temp);
	  }
}

function  addTaskToFile(filename,content){
	fs.writeFile(filename,JSON.stringify(content),function(err){
	    	if(!err){
	    		
	    	}
	});
	notifier.notify({'title': 'Task','message': 'Hello World'});
}


app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/index.html'));
});

function clockfunction(){

	var date = new Date();
	var  accessFile = "TasKForTheDay_"+date.getFullYear()+"_"+(date.getMonth() + 1)+"_"+date.getDate()+".senthil";

	
	fs.exists(accessFile,function(exist){
		if(exist){
			
			var task = {};
			task.task = [];
			fs.readFile(accessFile, {encoding: 'utf-8'},function (err,data) {
			  if (err) {
			    return console.log(err);
			  }
			  if(data){
			  	task = JSON.parse(data);
			  	notifyTask(task,date);
			  }
			});
		}
	});
}

function notifyTask(task,date){
	if(task.task.length){
		var tasks = task.task;;
		for (var i = 0; i < tasks.length; i++) {
			if(tasks[i].hours == date.getHours() && tasks[i].minutes == date.getMinutes()){
				notifier.notify({'title': 'Task','message': tasks[i].message});
			}
		};

	}
}

setInterval(clockfunction,60000);

var server = app.listen(16000, function() {
  console.log('Server listening on port ' + server.address().port);
});