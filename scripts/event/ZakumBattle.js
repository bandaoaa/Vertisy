/* 
 * This file is part of the OdinMS Maple Story Server
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
 * @Author Stereo
 * @Modified By XkelvinchiaX(Kelvin)
 * @Modified By Moogra
 * @Modified By SharpAceX(Alan)
 * @Modified By iPoopMagic (David)
 * Zakum Battle
 */

var exitMap;
var altarMap;
var minPlayers = 1;
var fightTime = 120;
var altarTime = 15;
var gate;

function init() {
	em.setProperty("state", "0");
    em.setProperty("shuffleReactors", "false");
	exitMap = em.getChannelServer().getMap(211042300);
	altarMap = em.getChannelServer().getMap(280030000); // Last Mission: Zakum's Altar
	gate = exitMap.getReactorByName("gate");
	gate.setState(0); //Open gate
}

function setup() {
    var eim = em.newInstance("ZakumBattle_" + em.getProperty("channel"), false);
	var timer = 1000 * 60 * fightTime;
	eim.setProperty("summoned", "false");
	em.setProperty("state", "1");
    em.schedule("timeOut", eim, timer);
	em.schedule("altarTimeOut", eim, 1000 * 60 * altarTime);
    eim.startEventTimer(timer);
	gate.setState(1);//Close gate
	return eim;
}

function playerEntry(eim, player) {
	var altar = eim.getMapInstance(altarMap.getId());
    player.changeMap(altar, altar.getPortal(0));
	player.dropMessage(5, "The Zakum Shrine will close if you do not summon Zakum in " + altarTime + " minutes.");
    if (altarMap == null)
        debug(eim, "The altar map was not properly linked.");
}

function playerRevive(eim, player, wheel) {
    if(wheel) {
        // Using a wheel of destiny.
        return true;
    } else {
        eim.unregisterPlayer(player);
        var exped = eim.getPlayers();
        if (exped.size() < minPlayers)
            end(eim,"There are not enough players remaining, the battle is over.");
        return true;
    }
}

function playerDead(eim, player) {
}

function playerDisconnected(eim, player) {
    var exped = eim.getPlayers();
    if (player.getName().equals(eim.getProperty("leader"))) {
        var iter = exped.iterator();
        while (iter.hasNext()) {
            iter.next().getPlayer().dropMessage(6, "The leader of the expedition has disconnected.");
		}
    }
    //If the expedition is too small.
    if (exped.size() < minPlayers) {
        end(eim, "There are not enough players remaining. The battle is over.");
    }
}

function monsterValue(eim, mobId) { // potentially display time of death? does not seem to work
    if (mobId == 8800002) { // 3rd body
        var iter = eim.getPlayers().iterator();
        while (iter.hasNext()) {
            iter.next().dropMessage(6, "Congratulations on defeating Zakum!");
		}
    }
    return -1;
}

function leftParty(eim, player) { // do nothing in Zakum
}

function disbandParty(eim) { // do nothing in Zakum
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, exitMap.getPortal(0));
    if (eim.getPlayers().size() < minPlayers) {//not enough after someone left
        end(eim, "There are no longer enough players to continue, and those remaining shall be warped out.");
	}
}

function end(eim,msg) {
    var iter = eim.getPlayers().iterator();
    while (iter.hasNext()) {
        var player = iter.next();
        player.getPlayer().dropMessage(6,msg);
        eim.unregisterPlayer(player);
        if (player != null){
            player.changeMap(exitMap, exitMap.getPortal(0));
		}
    }
    
    eim.endExpedition();
    
	gate.setState(0);//Open gate
	em.setProperty("state", "0");
    eim.dispose();
}

function removePlayer(eim, player) {
    eim.unregisterPlayer(player);
    player.getMap().removePlayer(player);
    player.setMap(exitMap);
}

function clearPQ(eim) { //When the hell does this get executed?
    end(eim,"As the sound of battle fades away, you feel strangely unsatisfied.");
}

function finish(eim) {
    var iter = eim.getPlayers().iterator();
    while (iter.hasNext()) {
        var player = iter.next();
        eim.unregisterPlayer(player);
        player.changeMap(exitMap, exitMap.getPortal(0));
    }
	em.setProperty("state", "0");
    eim.dispose();
}

function allMonstersDead(eim) {
}

function cancelSchedule() {
}

function altarTimeOut(eim) {
    if (eim != null && eim.getProperty("summoned").equals("false")) {
        if (eim.getPlayerCount() > 0) {
            var pIter = eim.getPlayers().iterator();
            while (pIter.hasNext()){
				var player = pIter.next();
				player.dropMessage(6, "The Shrine has closed since you did not summon Zakum within " + altarTime + " minutes.");
                playerExit(eim, player);
			}
        }
		em.setProperty("state", "0");
        eim.dispose();
    }
}

function timeOut(eim) {
    if (eim != null) {
        if (eim.getPlayerCount() > 0) {
            var pIter = eim.getPlayers().iterator();
            while (pIter.hasNext()){
				var player = pIter.next();
				player.dropMessage(6, "You have run out of time to defeat Zakum!");
                playerExit(eim, player);
			}
        }
		em.setProperty("state", "0");
        eim.dispose();
    }
}

function debug(eim,msg) {
    var iter = eim.getPlayers().iterator();
    while (iter.hasNext()) {
        iter.next().getClient().announce(Packages.tools.MaplePacketCreator.serverNotice(6, msg));
    }
}

function changedMap(eim, chr, mapid){}