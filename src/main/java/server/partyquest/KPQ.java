/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package server.partyquest;

import java.util.Date;

import client.MapleCharacter;

/**
 * @author peter
 */
public class KPQ extends PartyQuest{

	public static final String PQ = "KPQ";
	public static final short QUEST = 1201;
	public static final int ITEM = 1072369;
	public static final int NPC = 9020000;

	public KPQ(){
		super();
		setPQIdentity("KPQ", 9020000, (short) 1201, 1072369);
	}

	// go thru rank requirements to determine the correct rank and record/update it in the db
	// insert/update areainfo in the db and also in game.
	@Override
	public boolean calcAndUpdateRank(MapleCharacter chr, final MapleCharacter.PQRankRecord pqRankRecord){
		int tries = pqRankRecord.tries;
		int completed = pqRankRecord.completed;
		byte completeRate = pqRankRecord.completeRate; // completed / tries
		int fastestTime = pqRankRecord.fastestTime; // in seconds
		Date fastestDate = pqRankRecord.fastestDate; // the date in which fastestTime occurs (based on pq end date)
		String rank = pqRankRecord.rank; // rank in the db
		String rank_; // rank now
		// ranking requirements
		// 1072369 - Squishy Shoes
		boolean haveItem = checkItemAndUpdate(chr);
		if(tries >= 100 && completeRate >= 90 && fastestTime <= 600 && haveItem){ // rank S
			rank_ = PQRank.S.name(); // 10 mins
		}else if(tries >= 50 && completeRate >= 70 && fastestTime <= 900 && haveItem){ // rank A
			rank_ = PQRank.A.name(); // 15 mins
		}else if(tries >= 30 && completeRate >= 50 && fastestTime <= 1200){ // rank B
			rank_ = PQRank.B.name(); // 20 mins
		}else if(tries >= 10 && completeRate >= 30 && fastestTime <= 1500){ // rank C
			rank_ = PQRank.C.name(); // 25 mins
		}else if(tries >= 1 && completeRate >= 20/* && fastestTime <= 1800*/){ // rank D
			// NOTE: i removed the fastestTime checking here since it's not needed
			rank_ = PQRank.D.name(); // 30 mins
		}else if(tries >= 1 && completeRate >= 0/* && fastestTime <= 1800*/){ // rank F
			// NOTE: i removed the fastestTime checking here since it's not needed
			// plus cuz of the default fastesttime value in the db.
			rank_ = PQRank.F.name();
		}else{ // should not reach here, if its here, might be bugs/ exploits.
			rank_ = PQRank.z.name(); // default, should not happen.
		}
		String areaInfo = "cmp=" + completed + ";try=" + tries + ";have=" + (haveItem ? 1 : 0) + ";rank=" + rank_;
		// update rank in db and area info (quest info UI)
		updateRank(chr, !rank.equalsIgnoreCase(rank_) ? null : rank_, // update ranks only if it's diff from the one in db
		        areaInfo, fastestTime, fastestDate);
		return true;
	}

	@Override
	public void invokeOpenPQ(MapleCharacter chr){
		openPQ(chr, "KerningPQ");
	}
}