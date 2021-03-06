// Change attack_mode to true if you wish to start attacking things
var attack_mode = false;

// setInterval just a loop
// It just makes whatever is inside of it happen over an over again
// Whenever you return your code starts from this point
setInterval(function(){

	// Loots chests when you kill a monster
	loot();
	
	// Are you hurt? Use a health potion
	// Are you in need of mana? Use a mana potion
	use_hp_or_mp();
	
	// If attack_mode is false or you are not moving 
	if(!attack_mode || is_moving(character))
	{
		// Then start the loop over from the begining
		return;
	}

	// This variable is the monster you are targeting
	var target = get_targeted_monster();
	
	// No target?
	if(!target)
	{
		// Find a new target
		target = get_nearest_monster({type: "goo"});
		
		// Did you find a new monster?
		if(target) 
		{
			// Make the monster your target
			change_target(target);
		}
		// Still havent found a new monster...
		else
		{
			// Prints a little message
			set_message("No Monsters");
			
			// Start the loop over again from the begining
			return;
		}
	}
	
	// Your target is too far away!
	if(!in_attack_range(target))
	{	
		// Move half the distance towards your target
		move(
			character.real_x+(target.real_x-character.real_x)/2,
			character.real_y+(target.real_y-character.real_y)/2
			);
	}
	// Your target is close enough and you can attack it
	else if(can_attack(target))
	{
		// Print a little message
		set_message("Attacking");
		
		// ATTACK THAT MONSTER!!
		attack(target);
	}


// This is the end of your setInterval loop
// Loops every 1/4 seconds.
},1000/4); 