///////////////////////////////////////////////
//	Basic XP Efficiency Calculator	//
/////////////////////////////////////////////

/*

Hello, this is Trexnamedtom's Basic XP calculator. This will desplay the recomended monster to farm for maximum XP per hit. 

when you run this code the list provide will be shown from highest XP per hit to lowest. The list should have the following format:

///////////////////////////////////////
//	Monster name:			 //
//	Monster type:			 //
//	XP per hit:				  //
//	Map to locate Monster:	//
//////////////////////////////////////

This calculator does not take into account: 
- monsters attack
- monsters armor
- monsters resistance
- monsters evasion
- monsters reflection
and other damage reduction or damage modifiers

*/


var your_attack = character.attack;		//this is your characters average attack

var monster;                            //monster data
var monster_info;
var hits_needed_to_kill;                //number of attacks needed to kill monster
var array = [];
    
    
for(mapID in parent.G.maps)
{
    for(monsterID in parent.G.maps[mapID].monsters)
    {
		var checker = false;
        monster = parent.G.maps[mapID].monsters[monsterID];
        monster_info = parent.G.monsters[monster.type];
		
        hits_needed_to_kill = Math.ceil(monster_info.hp/your_attack);
        xp_per_hit = monster_info.xp / hits_needed_to_kill;
		
		if(array.every(e => e[1] != monster.type))
		{
			array.push([monster_info.name, monster.type, xp_per_hit, parent.G.maps[mapID].name]);
		}
    }
}

array.sort(function(a,b){
    return b[2] - a[2];
});

show_json(array);