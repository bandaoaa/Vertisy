/**
 *	@Description: Into the Laboratory (Magatia PQ) - Romeo
 */
function enter(pi) {
    if (pi.haveItem(4001133) && pi.getPlayer().getEventInstance().getMapInstance(926100200).getReactorByName("rnj3_out1").getCurrState() < 1) {
		pi.getPlayer().getEventInstance().getMapInstance(926100200).getPortal("in00").setPortalState(true);
		pi.getPlayer().getEventInstance().getMapInstance(926100200).getReactorByName("rnj3_out1").setState(1);
		pi.gainItem(4001133, -1);
		pi.warp(926100201, 0);
	} else if (pi.getPlayer().getEventInstance().getMapInstance(926100200).getReactorByName("rnj3_out1").getCurrState() > 0) {
		pi.warp(926100201, 0);
    } else {
		pi.playerMessage(5, "The door is not open.");
    }
}