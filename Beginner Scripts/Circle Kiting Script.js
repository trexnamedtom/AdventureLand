//This can be a simple script for kiting monsters.

//This code picks a point and allows for 3 different characters to walk around it in a circle. 

//Most of this code is from Spadars follow a recorded path code, i do not want to take credit for all of this

var name1 = "characters name here";		//name of first character
var name2 = "characters name here";		//name of second character
var name3 = "characters name here";		//name of third character

//changing this variable will change the range of the circle in which the characters rotate around
var buffer = 20;		

//change these variables to x,y points in which you want to rotate around
var midpointx = 0;
var midpointy = 0;

/**-------------no more changes are needed below this point---------------**/

var followPath = true;
var kitePath = [];

initializeKitePath();

var targetIndex = findNearestPathPoint(character.real_x, character.real_y);

var kiteDirection = 1;

setInterval(function()
{
	followKitePath();
}, 100);


function findNearestPathPoint(x, y)
{
	var closestPoint;
	var closestPointDist;
	var closestIndex;
	
	for(var i = 0; i < kitePath.length; i++)
	{
		var point = kitePath[i];
		var pointDist = distanceToPoint(x, y, point.x, point.y);
		if(closestPoint == null || pointDist < closestPointDist)
		{
			closestPoint = point;
			closestPointDist = pointDist;
			closestIndex = i;
		}
	}
	
	return closestIndex;
}

function distanceToPoint(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x1 - x2, 2) + 							Math.pow(y1 - y2, 2));
}


function followKitePath()
{
	

	var targetPoint = kitePath[targetIndex];
	if(distanceToPoint(character.real_x, character.real_y, targetPoint.x, targetPoint.y) < 25)
	{
		
		targetIndex = targetIndex + kiteDirection;
		if(targetIndex > kitePath.length - 1)
		{
			targetIndex = 0;
		}

		if(targetIndex < 0)
		{
			targetIndex = kitePath.length - 1;
		}

		targetPoint = kitePath[targetIndex];
	}


	move(
		character.real_x+(targetPoint.x-character.real_x),
		character.real_y+(targetPoint.y-character.real_y)
	);

	
}

function offsetToPoint(x, y)
{
	var angle = angleToPoint(x, y) + Math.PI;
	
	return angle - characterAngle();
	
}

function characterAngle()
{
	return (character.angle * Math.PI)/180;
}

function angleToPoint(x, y)
{
	var deltaX = character.real_x - x;
	var deltaY = character.real_y - y;
	
	return Math.atan2(deltaY, deltaX);
}



function initializeKitePath()
{

	if(character.name == name1)
	{
		kitePath = [
			{
				"x": midpointx+buffer+50,
				"y": midpointy
			},
			{
				"x": midpointx+buffer+20,
				"y": midpointy-buffer-20
			},
			{
				"x": midpointx,
				"y": midpointy-buffer-50
			},
			{
				"x": midpointx-buffer-20,
				"y": midpointy-buffer-20
			},
			{
				"x": midpointx-buffer-50,
				"y": midpointy
			},
			{
				"x": midpointx-buffer-20,
				"y": midpointy+buffer+20
			},
			{
				"x": midpointx,
				"y": midpointy+buffer+50
			}
		];
	}
	else if(character.name == name2)
	{
		kitePath = [
			{
				"x": midpointx+buffer+75,
				"y": midpointy
			},
			{
				"x": midpointx+buffer+40,
				"y": midpointy-buffer-40
			},
			{
				"x": midpointx,
				"y": midpointy-buffer-75
			},
			{
				"x": midpointx-buffer-40,
				"y": midpointy-buffer-40
			},
			{
				"x": midpointx-buffer-75,
				"y": midpointy
			},
			{
				"x": midpointx-buffer-40,
				"y": midpointy+buffer+40
			},
			{
				"x": midpointx,
				"y": midpointy+buffer+75
			}
		];
	}
	else if(character.name == name3)
	{
		kitePath = [
			{
				"x": midpointx+buffer+100,
				"y": midpointy
			},
			{
				"x": midpointx+buffer+60,
				"y": midpointy-buffer-60
			},
			{
				"x": midpointx,
				"y": midpointy-buffer-100
			},
			{
				"x": midpointx-buffer-60,
				"y": midpointy-buffer-60
			},
			{
				"x": midpointx-buffer-100,
				"y": midpointy
			},
			{
				"x": midpointx-buffer-60,
				"y": midpointy+buffer+60
			},
			{
				"x": midpointx,
				"y": midpointy+buffer+100
			}
		];
	}
}