/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/*@author Jvlaple
 * Spawns Eak When 20 Clouds are Dropped.
  *2006000.js
  */
  
function act() {
	// How to make the reactor disappear?
    rm.mapMessage(5, "As the light flickers, someone appears out of the light.");
    rm.spawnNpc(2013001, new java.awt.Point(375, 99));
	rm.getEventManager("OrbisPQ").setProperty("pre", "2");
}