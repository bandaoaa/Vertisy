var status = -1;
var map = 910310000;
var num = 5;
var maxp = 5;

function start() {
	status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
		status++;
    } else {
		if (status <= 1) {
			cm.dispose();
			return;
		}
		status--;
    }
    if (status == 0) {
		if (cm.getJobId() == 400 && cm.getPlayer().getLevel() < 20) {
			var selStr = "Would you like to go into the Training Center?";
			for (var i = 0; i < num; i++) {
				selStr += "\r\n#b#L" + i + "#Training Center " + i + " (" + cm.getPlayerCount(map + i) + "/" + maxp + ")#l#k";
			}
			cm.sendSimple(selStr);
		} else {
			cm.sendOk("You are not a thief or you are not under level 20! You may not enter the thief training center!");
			cm.dispose();
		}
    } else if (status == 1) {
		if (selection < 0 || selection >= num) {
			cm.dispose();
		} else if (cm.getPlayerCount(map + selection) >= maxp) {
			cm.sendNext("This training center is full.");
			status = -1;
		} else {
			cm.warp(map + selection, 0);
			cm.dispose();
		}
    }
}