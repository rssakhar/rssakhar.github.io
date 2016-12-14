//Copyright Radhika Sakhare

// scene object variables
var renderer, scene, camera;

// set the scene size
var WIDTH = 800, HEIGHT = 400;

// set some camera attributes
var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

var c = document.getElementById("gameCanvas");

//game related variables
var lives = 5; var score = 100; var level = 0;
var fieldWidth = 260, fieldHeight = 260;  // field variables
var rowsize = fieldWidth/13, colsize = fieldHeight/13;
var origin_x = -(fieldWidth/2) + rowsize, origin_y = (fieldWidth/2);
var num_rows = 13 , num_cols = 13;

var planeWidth = fieldWidth, planeHeight = fieldHeight, planeQuality = 10;  // set up the playing surface plane 
var frogWidth = 10, frogHeight = 10, frogDepth = 10, frogQuality = 1;
var carWidth = 10, carHeight = 15, carDepth = 8, carQuality = 1;
var busWidth = 10, busHeight = 25, busDepth = 10, busQuality = 1;
var logWidth = 10, logHeight = 35, logDepth = 2, logQuality = 1;

//texture
var frogTexture, carTexture, busTexture, logTexture;
var startTexture, roadTexture, barrierTexture, waterTexture, endTexture;

//materials
var planeMaterial, frogMaterial, carMaterial, busMaterial, logMaterial;
var startMaterial, roadMaterial, barrierMaterial, waterMaterial, endMaterial;

//geometry
var planeGeometry, frogGeometry, carGeometry, busGeometry, logGeometry;
var smallPlaneGeometry;

//objects
var plane, frog, car, bus, log;
var groundObjects = new Array(13);

//audio files
var jump = new Audio('audio/sound-frogger-hop.wav');
var squash = new Audio('audio/sound-frogger-squash.wav');
var coin = new Audio('audio/sound-frogger-coin-in.wav');

//speed for all rows
var objectSpeed = [0.2, 0.4, 0.6, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.5];
var objectDirection = [-1, 1, -1, 1, 1, -1, 1, -1, 1, -1];
var objectPositionArr, objectArr;
var objectLocation =   [[0, 5, 9],
						[0, 5],
						[0, 5],
						[0, 5, 9],
						[0, 5, 9],
						[0, 5, 9],
						[0, 5],
						[0, 5, 9],
						[0, 5],
						[0, 5, 9]]

function setup()
{
	lives = 5;

	// set up all the 3D objects in the scene	
	createScene();

	// and let's get cracking!
	draw();
}


function createScene()
{
	// create a WebGL renderer, camera and a scene
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	camera.position.z = 300;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	//load textures
	loadTextures();

	//load materials
	loadMaterial();

	//load Texture material
	loadTextureMaterial();

	//load geometry
	loadGeometry();

	//load objects
	loadObjects();

	// // create a point light
	pointLight = new THREE.PointLight(0xF8D898);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);

	// add a spot light
	// this is important for casting shadows
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);

	// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	renderer.shadowMapEnabled = true;	
}

function loadTextures()
{
	frogTexture = new THREE.ImageUtils.loadTexture('https://github.ncsu.edu/rssakhar/frogger.github.io/blob/master/frogger.png');

	busTexture = new THREE.ImageUtils.loadTexture('images/bus4.png');
	carTexture = new THREE.ImageUtils.loadTexture('images/car.png');
	logTexture = new THREE.ImageUtils.loadTexture('images/land.jpg');
	
	startTexture = new THREE.ImageUtils.loadTexture('images/land.jpg');

	roadTexture = new THREE.ImageUtils.loadTexture('images/road1.jpg');

	barrierTexture = new THREE.ImageUtils.loadTexture('images/land.jpg');

	waterTexture = new THREE.ImageUtils.loadTexture('images/water.jpg');

	endTexture = new THREE.ImageUtils.loadTexture('images/land.jpg');

}

function loadTextureMaterial()
{
	frogMaterial = new THREE.MeshPhongMaterial( { map: frogTexture } );
	busMaterial = new THREE.MeshPhongMaterial( { map: busTexture } );
	carMaterial = new THREE.MeshPhongMaterial( { map: carTexture} );
	logMaterial = new THREE.MeshPhongMaterial( { map: logTexture } );

	//startMaterial = new THREE.MeshPhongMaterial( { map: startTexture} );
	//roadMaterial = new THREE.MeshPhongMaterial( { map: roadTexture, side: THREE.DoubleSide } );
	//roadTexture.wrapS = THREE.RepeatWrapping;  roadTexture.wrapT = THREE.RepeatWrapping;

	//barrierMaterial = new THREE.MeshPhongMaterial( { map: barrierTexture } );
	//waterMaterial = new THREE.MeshPhongMaterial( { map: waterTexture } );
	//endMaterial = new THREE.MeshPhongMaterial( { map: endTexture } );
}

function loadMaterial()
{
	// create the plane's material	
	planeMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x330000
		});

	startMaterial =
		new THREE.MeshLambertMaterial(
		{
		  color: 0x003319
		});	

	landMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x330000
		});

	roadMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x101010
		});

	barrierMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x003319
		});		

	waterMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x3399FF
		});

	endMaterial	=
		new THREE.MeshLambertMaterial(
		{
		  color: 0x003319
		});	

	// create frog material
	frogMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x00FF00
		});

	carMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x999900
		});

	// create bus material
	busMaterial = 
		new THREE.MeshLambertMaterial(
		{
		  color: 0x660000
		});

	logMaterial = 
		new THREE.MeshLambertMaterial(
		{
			color: 0x404040
	    });	
}

function loadGeometry()
{
	planeGeometry = 	  
		new THREE.PlaneGeometry(
			planeWidth,
			planeHeight,
			planeQuality,
			planeQuality);

	//smallPlaneGeometry = new THREE.PlaneGeometry(planeWidth/13, planeHeight, 1, 1);
	smallPlaneGeometry = 
		new THREE.BoxGeometry(
			planeWidth/13,
			planeHeight,
			1,
			1,
			1,
			1);

	frogGeometry = 
		new THREE.BoxGeometry(
			frogWidth,
			frogHeight,
			frogDepth,
			frogQuality,
			frogQuality,
			frogQuality);

	carGeometry = 
		new THREE.BoxGeometry(
			carWidth,
			carHeight,
			carDepth,
			carQuality,
			carQuality,
			carQuality);

	busGeometry = 
		new THREE.BoxGeometry(
			busWidth,
			busHeight,
			busDepth,
			busQuality,
			busQuality,
			busQuality);

	logGeometry = 
		new THREE.BoxGeometry(
			logWidth,
			logHeight,
			logDepth,
			logQuality,
			logQuality,
			logQuality);
}

function loadObjects()
{
	var row = 0, id = 0;
	// create the playing surface plane
	/*plane = 
		new THREE.Mesh(
			planeGeometry,
		 	planeMaterial
			);
	scene.add(plane);
	plane.receiveShadow = true;*/

	var temp = -120;

	for(row=0; row<13; row++)
	{
		var newPlane;

		if(row == 0)
		{
			newPlane = new THREE.Mesh(smallPlaneGeometry, startMaterial);
		}
		else if(row >= 1 && row <= 5)
		{
			newPlane = new THREE.Mesh(smallPlaneGeometry, roadMaterial);
		}
		else if(row == 6)
		{
			newPlane = new THREE.Mesh(smallPlaneGeometry, barrierMaterial);
		}
		else if(row >=7 && row <= 11)
		{
			newPlane = new THREE.Mesh(smallPlaneGeometry, waterMaterial);
		}
		else if(row == 12)
		{
			newPlane = new THREE.Mesh(smallPlaneGeometry, endMaterial);
		}

		newPlane.position.x = temp;
		temp = temp + 20;
		newPlane.position.y = 0;
		newPlane.position.z = 0;
		newPlane.receiveShadow = true;
		scene.add(newPlane);
	}


	frog = 
		new THREE.Mesh(
			frogGeometry,
	  		frogMaterial);
	//add the frog to the scene
	scene.add(frog);
	frog.receiveShadow = false;
    frog.castShadow = true;
   	frog.position.x = -fieldWidth/2 + frogWidth;
   	frog.position.z = frogDepth/2;	

   	//buses initialize
   	
   	objectPositionArr = new Array(10);
   	objectArr = new Array(10);
   	for(row = 0; row < 10; row++)
   	{
   		objectArr[row] = new Array(13);
   		objectPositionArr[row] = new Array(13);
   	}

   	for(row = 0; row < 10; row++)
   	{
   		if(row == 0 || row == 2)  //cars
   		{
   			for(id=0; id<objectLocation[row].length; id++)
   			{
				objectPositionArr[row][id] = objectLocation[row][id]*rowsize;
				var newCar = new THREE.Mesh(carGeometry, carMaterial);
				newCar.position.x = -(fieldHeight/2) + (row+1)*rowsize + carWidth;
				newCar.position.y = objectPositionArr[row][id] - (fieldHeight/2) + carHeight;
				newCar.position.z = carDepth/2;
				newCar.receiveShadow = true;
    			newCar.castShadow = true;
				scene.add(newCar);
				objectArr[row][id] = newCar;   				
   			}
   		}
   		else if(row < 5) //buses
   		{
   			for(id=0; id<objectLocation[row].length; id++)
   			{
				objectPositionArr[row][id] = objectLocation[row][id]*rowsize;
				var newBus = new THREE.Mesh(busGeometry, busMaterial);
				newBus.position.x = -(fieldHeight/2) + (row+1)*rowsize + busWidth;
				newBus.position.y = objectPositionArr[row][id] - (fieldHeight/2) + busHeight;
				newBus.position.z = busDepth/2;
				newBus.receiveShadow = true;
    			newBus.castShadow = true;
				scene.add(newBus);
				objectArr[row][id] = newBus;   				
   			}
   		}
   		else if(row >= 5)  //logs
   		{
   			for(id=0; id<objectLocation[row].length; id++)
   			{
 				objectPositionArr[row][id] = objectLocation[row][id]*rowsize;
				var newLog = new THREE.Mesh(logGeometry, logMaterial);
				newLog.position.x = -(fieldHeight/2) + (row+2)*rowsize + logWidth;
				newLog.position.y = objectPositionArr[row][id] - (fieldHeight/2) + logHeight;
				newLog.position.z = logDepth/2;
				newLog.receiveShadow = true;
    			newLog.castShadow = true;
				scene.add(newLog);
				objectArr[row][id] = newLog;    				
   			}
   		}
   	}

}

function moveObjects()
{
	var row, id;

	for(row=0; row<10; row++)
	{
		for(id=0; id<objectLocation[row].length; id++)
		{
			objectPositionArr[row][id] = (objectPositionArr[row][id] + objectSpeed[row])%fieldHeight;

			if(objectDirection[row] == 1)
			{
				objectArr[row][id].position.y = objectPositionArr[row][id] - (fieldHeight/2) ;
			}
			else
			{
				objectArr[row][id].position.y = -objectPositionArr[row][id] + (fieldHeight/2) ;
			}
		}
	}
}

function frogDead()
{
	frog.position.x = -(fieldWidth/2) + frogWidth;
	frog.position.y = 0;
	frog.position.z = frogDepth;
	score = score - 20;
	lives--;	
	document.getElementById("lives").innerHTML = "Lives: " + lives;
	document.getElementById("score").innerHTML = "Score: " + score;
    squash.pause();
    squash.currentTime = 0;
    squash.play();	
}

function check()
{
	var check_row = ((frog.position.x + (fieldWidth/2) - frogWidth)/rowsize);
	//console.log(frog.position.x, (fieldWidth/2), frogWidth, rowsize);
	var id = 0;

	if(((check_row > 0) && (check_row < 6)) ) //roads
	{
		check_row = check_row - 1;
		check_row = Math.round(check_row);
		for(id=0; id<objectLocation[check_row].length; id++)
		{
			var objLeft   = objectArr[check_row][id].geometry.vertices[0].y + objectArr[check_row][id].position.y;
			var objRight  = objectArr[check_row][id].geometry.vertices[7].y + objectArr[check_row][id].position.y;
			var frogLeft  = frog.geometry.vertices[0].y + frog.position.y;
			var frogRight = frog.geometry.vertices[7].y + frog.position.y;	

			if(!((objRight>frogLeft) || (frogRight > objLeft)))
			{
				frogDead();
				break;
			}	
		}
	}
	else if(((check_row > 6) && (check_row < 12))) //water
	{
		var dead = 1;
		check_row = check_row - 2;
		check_row = Math.round(check_row);
		for(id=0; id<objectLocation[check_row].length; id++)
		{
			var objLeft   = objectArr[check_row][id].geometry.vertices[0].y + objectArr[check_row][id].position.y;
			var objRight  = objectArr[check_row][id].geometry.vertices[7].y + objectArr[check_row][id].position.y;
			var frogLeft  = frog.geometry.vertices[0].y + frog.position.y;
			var frogRight = frog.geometry.vertices[7].y + frog.position.y;

			if(!((objRight>frogLeft) || (frogRight>objLeft)))
			{
				frog.position.y = frog.position.y + objectDirection[check_row] * objectSpeed[check_row];
				dead = 0;
				break;
			}
		}
		if(dead)
		{			
			frogDead();
		}
	}
	else if(check_row == 12)
	{
		document.getElementById("score").innerHTML = "Congratulations!! You WON with Score: " + score + "!!";
		coin.play();
	}

	if(	((frog.geometry.vertices[0].y + frog.position.y) > (fieldWidth/2)) ||
		((frog.geometry.vertices[7].y + frog.position.y) < -(fieldWidth/2)))
	{
		frogDead();
	}

	if(lives == 0)
	{
		document.getElementById("score").innerHTML = "You LOSE!";
	}
}

// Handles camera and lighting logic
function cameraPhysics()
{	
	// move to behind the player's paddle
	camera.position.x = frog.position.x - 85;
	camera.position.y += (frog.position.y - camera.position.y) * 0.05;
	camera.position.z = frog.position.z + 60 + 0.04 * (-0.0 + frog.position.x);
	
	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * (0.0) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

document.onkeydown = handleKeyDown; // call this when key pressed

// does stuff when keys are pressed
function handleKeyDown(event) 
{
	if(lives != 0)
	{
		jump.pause();
		jump.currentTime = 0;
	    jump.play();		
	    switch (event.code) 
	    {
	        // model transformation
	        case "KeyW": // translate left, rotate left with shift
	        	if(frog.position.x < (fieldWidth/2 - rowsize))
	        	{
	        		frog.rotation.z = 0;
	        		frog.position.x += 20;
	        	}
	            break;
	        case "KeyA": // translate right, rotate right with shift
	        	if(frog.position.y < (fieldHeight/2 - colsize))
	        	{
	        		frog.rotation.z = Math.PI/2;
	        		frog.position.y += 5;
	        	}
	            break;
	        case "KeyS": // translate up, rotate counterclockwise with shift 
	        	if(frog.position.x > (-fieldWidth/2 + rowsize))
	        	{
	        		frog.rotation.z = Math.PI;
	        		frog.position.x -= 20;
	        	}
	            break;
	        case "KeyD": // translate down, rotate clockwise with shift
	        	if(frog.position.y > (-fieldHeight/2 + colsize))
	        	{
	        		frog.rotation.z = -Math.PI/2;
	        		frog.position.y -= 5;
	        	}
	        case "KeyP":
	        		camera.rotation = Math.PI/2;
	    } // end switch
	}
} // end handleKeyDown

function draw()
{
	// draw THREE.JS scene
	renderer.render(scene, camera);
	// loop draw function call
	requestAnimationFrame(draw);

	moveObjects();
	check();

	cameraPhysics();
}
