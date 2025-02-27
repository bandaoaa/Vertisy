/**
 *	@Author: iPoopMagic (David)
 *	@Description: Thief Sigil (Stirge / Flame stage)
 */
function act() {
	var em = rm.getEventManager("CWKPQ");
	if (em != null && !em.getProperty("glpq4thief").equals("1")) {
		rm.mapMessage(6, "The Thief Sigil has been activated!");
		em.setProperty("glpq4", parseInt(em.getProperty("glpq4")) + 1);
		em.setProperty("glpq4thief", "1");
		if (em.getProperty("glpq4").equals("5")) { //all 5 done
			rm.mapMessage(6, "All Sigils activated. The Antellion grants you access to the next portal! Proceed!");
			rm.getPlayer().getMap().environmentChange("4pt", 2);
		}
	} else {
		rm.getPlayer().dropMessage(5, "The Thief Sigil has already been activated.");
	}
}