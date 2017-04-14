"use strict";

function mkd(path,callback)
{
	fs.mkdir(path, function (err) 
	{
	    if (err) 
	    {
	    	console.log('Failed to create directory:\n', err);
	    	process.exit(0);
	    }
	    else 
	    	callback();
	});
}
function cp(tfp,nfp,fN,callback)
{
	try 
	{
		fs.copySync(path.resolve(__dirname,tfp), path.join(nfp,fN));
		callback();
	}
	catch(err)
	{
		console.log("ERROR: Couldn't create the file, "+fN+"\n"+err);
		process.exit(0);
	}
}
function cpNPM(pn,pd,fn,callback)
{
	var po = {
		"name": pn,
		"version": "1.0.0",
		"description": "This was setup with slowcook. This is the default description",
		"main": "server.js",
		"dependencies": {"express": "latest","body-parser": "latest","request": "latest","ejs": "latest"},
		"engines": {"node": "latest","npm": "latest"},
		"scripts": {"test": "echo \"Error: no test specified\" && exit 1"},
		"keywords": ["sample","slowcook"],
		"author": "@aBigSchwein",
		"license": "MIT"
	};
	fs.writeFile(path.join(pd,fn), JSON.stringify(po,null,4), function(err)
	{
    	if(err)
    	{
        	console.log("ERROR: Couldn't create the file, "+fn+"\n"+err);
			process.exit(0);
        }
        else
	        callback();
    }); 
}

function clog(message)
{
	if(cli_args.v)
		console.log(message);
}

var fs = require('fs-extra'),
    path = require('path'),
    cli_args = require('minimist')(process.argv.slice(2)),
    exec = require('child_process').exec;

console.log("!-- Welcome to slowcook --!");
console.log("turning up the heat");

if(cli_args.n == undefined || cli_args.n === "")
{
	console.log("ERROR: Please specify a name by passing -n 'name' when trying to slowcook");
	process.exit(0);
}
if(cli_args.n !== cli_args.n.toLowerCase())
{
	console.log("ERROR: due to npm constraints your project name must be all lowercase");
	process.exit(0);
}

clog("Creating the Project Directory: "+cli_args.n);
var projectDir = path.resolve(process.cwd(),"./"+cli_args.n);

mkd(projectDir,function()
{
	clog("Setting up the file structure!");
    cp("../template/server.js",projectDir,"server.js",function(){clog("Created server.js")});
    cp("../template/Procfile",projectDir,"Procfile",function(){clog("Created Procfile")});
    
    clog("Adding folders for views!");
    cp("../template/views",projectDir,"views",function(){clog("Created views directory")});
    
    clog("Adding folders for public static content!");
    cp("../template/public",projectDir,"public",function(){clog("Created public directory")});
    
    clog("Creating the Package.json file!");
    cpNPM(cli_args.n,projectDir,"package.json",function()
    {
	    clog("Created package.json");
	    clog("Attempting npm install!");
	    var command = "cd "+projectDir+" && npm install express request body-parser ejs --save";
	    console.log("mmmm can smell the food now, almost ready!");
		exec(command,function(error, stdout, stderr)
		{
			if(error) 
			{
				console.log("ERROR: NPM install command failed\n",error);
				process.exit(0);
			}
			else
			{
				clog(stdout);
				console.log("!-- Ding, your food is ready. Enjoy --!");
				process.exit(0);
			}
		});
    });
});