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
/* Miranda
NLC Skin Change.
*/
var status = 0;
var price = 1000000;
var skin = Array(0, 1, 2, 3, 4);

function start() {
    cm.sendSimple("Well, hello! Welcome to the NLC Skin-Care! Would you like to have a firm, tight, healthy looking skin like mine?  With #b#t5153009##k, you can let us take care of the rest and have the kind of skin you've always wanted~!\r\n#L1#I would like to buy a #b#t5153009##k for " + price + " mesos, please!#l\r\n\#L2#I already have a Coupon!#l");
}

function action(mode, type, selection) {
    status++;
    if (mode != 1){
        cm.dispose();
        return;
    }
		if (status == 1) {
            if (selection == 1) {
                if(cm.getMeso() >= price) {
                    cm.gainMeso(-price);
                    cm.gainItem(5153009, 1);
                    cm.sendOk("Enjoy!");
                } else 
                    cm.sendOk("You don't have enough mesos to buy a coupon!");
                cm.dispose();
            } else if (selection == 2) 
                cm.sendStyle("With our specialized machine, you can see the way you'll look after the treatment PRIOR to the procedure. What kind of a look are you looking for? Go ahead and choose the style of your liking~!", skin);
        }
        else if (status == 2){
            cm.dispose();
            if (cm.haveItem(5153009)){
                cm.gainItem(5153009, -1);
                cm.setSkin(skin[selection]);
                cm.sendOk("Enjoy your new and improved skin!");
            } else 
                cm.sendOk("Um...you don't have the skin-care coupon you need to receive the treatment. Sorry, but I am afraid we can't do it for you...");
        }
}