//this code allows your merchant to give luck boosts to anyone within range

//list of players names which you do not want to luck boost
var luckBlacklist = ['Put', 'Names', 'Here'];	

setInterval(function(){
	
	//searches everyone nearby
	for(id in parent.entities)
	{
		var current = parent.entities[id];

		//makes sure its a player, not a merchant and not in your blacklist
		if(current && current.type == 'character' && !current.npc && current.ctype != "merchant" && !luckBlacklist.includes(current.name))
		{
			//if they dont already have a boost
			if(!current.s.mluck)
			{
				//if they are in range then boost them
				if(Math.sqrt((character.real_x-current.real_x)*
								 (character.real_x-current.real_x)+
								 (character.real_y-current.real_y)*
								 (character.real_y-current.real_y)) < 320)
				{
					luck(current);
				}
			}
		}
	}	
}, 50);

var lastluck = new Date(0);
function luck(target){ 
	// Luck only if not on cd (cd is .1sec).
	if((new Date() - lastluck > 100)){
		parent.socket.emit("skill", {name: "mluck", id: target.id});
		set_message("Lucky " + target.name);
		lastluck = new Date();
	}
	
}
