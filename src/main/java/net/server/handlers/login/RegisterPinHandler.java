/*
 * This file is part of the OdinMS Maple Story Server
 * Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
 * Matthias Butz <matze@odinms.de>
 * Jan Christian Meyer <vimes@odinms.de>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 as published by
 * the Free Software Foundation. You may not use, modify or distribute
 * this program under any other version of the GNU Affero General Public
 * License.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package net.server.handlers.login;

import client.MapleClient;
import constants.ServerConstants;
import net.AbstractMaplePacketHandler;
import tools.MaplePacketCreator;
import tools.data.input.SeekableLittleEndianAccessor;
import tools.logger.Logger;
import tools.logger.Logger.LogFile;
import tools.logger.Logger.LogType;

/*
 * @author Rob
 */
public final class RegisterPinHandler extends AbstractMaplePacketHandler{

	@Override
	public final void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c){
		if(!ServerConstants.ENABLE_PIN){
			Logger.log(LogType.INFO, LogFile.LOGIN_BAN, c.getAccountName() + " tried to register a pin when pin is disabled.");
			c.getSession().close();
			return;
		}
		byte c2 = slea.readByte();
		if(c2 == 0){
			c.updateLoginState(MapleClient.LOGIN_NOTLOGGEDIN);
		}else{
			String pin = slea.readMapleAsciiString();
			if(pin != null){
				c.setPin(pin);
				c.announce(MaplePacketCreator.pinRegistered());
				c.updateLoginState(MapleClient.LOGIN_NOTLOGGEDIN);
			}
		}
	}
}
