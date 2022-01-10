//set to monsters name or list of mtype or to "any"
const monsterName = ["goo", "snowman"];
//if the list should only consist of monsters within your range (T/F)
const inRange = true;

//The variables below are all different lists that will be combined together.
//if you have them all set to false then you are going to get an empty array.

//if list of monsters contain monsters that have a partymember target (T/F)
const targetParty = true;
//if the list is to be of monsters that have targets (T/F)
const hasTarget = false;
//if the list will include coop monsters regardless if they have a target (T/F)
const coop = true;
//if the list will contain monsters without targets (T/F)
const noTarget = true;
//if the list will be sorted by distance (T/F)
const sortClosest = true;



function get_list_of_targets(monsterName, noTarget, hasTarget, targetParty, coop, sortClosest){
    let list = [];		        //list of monsters
    let coopList = [];          //list of coop monsters
    let noTargetList = [];      //list of monsters without targets
    let hasTargetList = [];     //list of monsters with targets
    let targetPartyList = [];   //list of monsters with party member targets
    let partyMembers = [];      //list of party members (includes yourself)
    let finalList = [];         //list that this function returns
    let monsterList = get_list_of_monsters(inRange);

    if(parent.character.party){
        //list of party members (includes yourself)
        partyMembers = get_party_members();
    }
    else{
        //list of party members (includes yourself)
        partyMembers = [character.name];
    }

    list = monsterList;
    if(monsterName != "any"){
        //list of monsters
        list = monster_list_name_filter(monsterList, monsterName);
    }
    if(coop){
        //list of coop monsters
        coopList = monster_list_coop_filter(list);
    }
    if(targetParty){
        //list of monsters with party member targets
        targetPartyList = monster_list_party_target_filter(list, partyMembers);
    }
    if(noTarget){
        //list of monsters without targets
        noTargetList = monster_list_no_target_filter(list);
    }
    if(hasTarget){
        //list of monsters with targets
        hasTargetList = monster_list_target_filter(list);
    }
    //combining all the lists together
    finalList = combine_lists(coopList, targetPartyList);
    finalList = combine_lists(finalList, noTargetList);
    finalList = combine_lists(finalList, hasTargetList);
	if(sortClosest){	//if list should be sorted
		finalList = sort_by_closest(finalList);
	}
    return finalList;	//return your filtered target list
}

function combine_lists(list1, list2){
    let combinedLists = [];     //list 1 and list 2 combined
	for( var i = 0; i < list1.length; i++){ 
        let current = list1[i];
        if (current && list2.includes(current)){
            list1.splice(i,1);      //remove dublicate from list 1
			i--;
        }
    }	
    combinedLists = list1.concat(list2);        //combine the lists
    return combinedLists;
}

function get_party_members(){
    let members = [];
    if(parent.character.party){
        for (id in parent.entities){
            let c = parent.entities[id];
            //Only add if the target is a player, has a party and it's your party
            if (c.type == "character" 
				&& ((c.party && c.party == parent.character.party))){
                members.push(c.name);
            }
        }
    }
	members.push(character.name);	//include yourself in the party
    return members;
}

function monster_list_party_target_filter(list, partyMembers){
    let targetList = [];		//list of only party target monsters
    for (id in list){
        let current = list[id];
        if (current && current.target && partyMembers.includes(current.target)){
            targetList.push(current);
        }
    }
    return targetList;
}

function monster_list_no_target_filter(list){
    let targetList = [];		//list of monsters with no target
    for (id in list){
        let current = list[id];
        if (current && !current.target){
            targetList.push(current);
        }
    }
    return targetList;
}

function monster_list_target_filter(list){
    let targetList = [];		//list of monsters with targets
    for (id in list){
        let current = list[id];
        if (current && current.target){
            targetList.push(current);
        }
    }
    return targetList;
}

function monster_list_coop_filter(list){
    let targetList = [];		//list of coop monsters regardless of target
    for (id in list){
        let current = list[id];
        if (current && current.cooperative){
            targetList.push(current);
        }
    }
    return targetList;
}

function monster_list_name_filter(monsterList, monsterName){
    let targetList = [];		//filtered list of monsters by mtypes
    for (id in monsterList){
        let current = monsterList[id];
        if (current && monsterName.includes(current.mtype)){
            targetList.push(current);
        }
    }
    return targetList;
}

function get_list_of_monsters(inRange){
    let targetList = [];		//list of monsters
    for (id in parent.entities){
        let current = parent.entities[id];
        if (current && current.type == "monster"){
            if (inRange && in_attack_range(current)){
                targetList.push(current);
            } else if (!inRange){
                targetList.push(current);
            }
        }
    }
    return targetList;
}

function sort_by_closest(list){
	let distanceList = [];		//list of distances
	let sortedList = [];		//Sorted list
	if(list){
		for (let y in list){	//loops to get list of distances
			let current = list[y];
			if (current){
				distanceList.push(parent.distance(character,current)); //distance
			}
		}
		distanceList.sort(function(a, b){return a-b});	//sorts list ascending order
		for (let i in list){	//loops to replace sorted distances with targets
			let current2 = list[i];
			if (current2){
				for (let x in distanceList){
					let currentDisctance = distanceList[x];
					if (currentDisctance){
						if(parent.distance(character,current2) == currentDisctance){
							sortedList.push(current2);	
						} 
					}
				}
			}
		}
		return sortedList; //returns list of sorted targets
	}
}
