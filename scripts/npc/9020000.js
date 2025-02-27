/*
 This file is part of the OdinMS Maple Story Server
 Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
 Matthias Butz <matze@odinms.de>
 Jan Christian Meyer <vimes@odinms.de>
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License version 3
 as published by the Free Software Foundation. You may not use, modify
 or distribute this program under any other version of the
 GNU Affero General Public License.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Lakelis - Victoria Road: Kerning City (103000000)
 -- By ---------------------------------------------------------------------------------------------
 Stereo
 -- Version Info -----------------------------------------------------------------------------------
 1.0 - First Version by Stereo
 ---------------------------------------------------------------------------------------------------
 **/

var status;
var minLevel = 21;
//var maxLevel = 30; //let's not have max lvl requirement
var minPlayers = 4;
//var maxPlayers = 6;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1)
        status++;
    else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        if (cm.getParty() === null) { // No Party
            cm.sendOk("How about you and your party members collectively beating a quest? Here you'll find obstacles and problems where you won't be able to beat it without great teamwork.  If you want to try it, please tell the #bleader of your party#k to talk to me.");
        } else if (!cm.isLeader()) { // Not Party Leader
            cm.sendOk("If you want to try the quest, please tell the #bleader of your party#k to talk to me.");
        } else { // is party leader
            var em = cm.getEventManager("KerningPQ");
            if (em === null) {
                cm.sendOk("This PQ is currently unavailable.");
                return;
            }

            var party = cm.getParty().getMembers();
            var inMap = cm.partyMembersInMap();
            if (party.size() !== inMap || inMap < minPlayers/* || inMap > maxPlayers*/) { //checks for party members in map
                if(!cm.getPlayer().isGM()){
	                cm.sendOk("Your party is not a party of " + minPlayers
	                        + ". Please make sure all your members are present and qualified to participate in this quest.");
	                return;
                }
            }

            for (var i = 0; i < party.size(); i++) { //check lvl range.
                if (party.get(i).getLevel() < minLevel/* || party.get(i).getLevel() > maxLevel*/) {
//                    cm.sendOk("Please make sure all your members are present and qualified to participate in this quest. This PQ requires players ranging from level " //ori
                    cm.sendOk("Please make sure all your members are present and qualified to participate in this quest. This PQ requires players that are at least level "
                            + minLevel
//                            + " to level " + maxLevel
//                            + ". I see #b" + levelValid
//                            + "#k members are in the right level range"
                            + ". If this seems wrong, #blog out and log back in,#k or reform the party.");
                    return;
                }
            }

            if (em.getProperty("KPQOpen").equals("true")) {
                status++; //a hack so that status = 2 means start pq cuz status = 1 is taken by all the validation msg.
                action(mode, type, selection);
                //cm.sendOk("Let's start the party quest, shall we?");
            } else {
                cm.sendNext("There is already another party inside. Please wait !");
            }
        }
    } else if (status === 1) {
        cm.dispose();
    } else { //status = 2
        // Begin the PQ.
        var em = cm.getEventManager("KerningPQ");
        cm.removePartyItems(4001008);
        cm.removePartyItems(4001007);
        em.startPQ("KPQ", cm.getParty(), cm.getPlayer().getMap());
        cm.dispose();
    }
}