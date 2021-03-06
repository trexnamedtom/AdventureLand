// Change healing_mode to true if you wish to heal your party members
var healing_mode = false;

// setInterval just a loop
// It just makes whatever is inside of it happen over an over again
// Whenever you return your code starts from this point
setInterval(function(){

	// Loots chests when you kill a monster
	loot();
	
	// Are you hurt? Use a health potion
	// Are you in need of mana? Use a mana potion
	use_hp_or_mp();
	
	// Who is your party leader
    var leader = get_player(character.party);
	
	// No leader?
	if(!leader) 
	{
		// Start the loop over from the begining
		return;
	}
	// If healing_mode is false or you are not moving or you are not a priest
	if(!healing_mode || is_moving(character) || character.ctype != 'priest')
	{
		// Start the loop over from the begining
		return;
	}
	
	// Your party leader is hurt?!?
	if(leader.hp < leader.max_hp/2)
	{
		// QUICK HEAL YOUR LEADER!!!
		heal(leader);
	}
	
	// Your not moving
	if(!character.moving)
	{
		// Better moving close to your party leader
		move(leader.real_x + 20, leader.real_y + 20);
	}

// This is the end of your setInterval loop
// Loops every 1/4 seconds.
},1000/4); 