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
package net.server.channel.handlers;

import client.*;
import client.MapleCharacter.CancelCooldownAction;
import client.inventory.Item;
import client.inventory.MapleInventory;
import client.inventory.MapleInventoryType;
import client.inventory.MapleWeaponType;
import constants.ItemConstants;
import constants.skills.*;
import server.*;
import tools.MaplePacketCreator;
import tools.Randomizer;
import tools.data.input.SeekableLittleEndianAccessor;

public final class RangedAttackHandler extends AbstractDealDamageHandler{

	@Override
	public final void handlePacket(SeekableLittleEndianAccessor slea, MapleClient c){
		MapleCharacter player = c.getPlayer();
		/*long timeElapsed = System.currentTimeMillis() - player.getAutobanManager().getLastSpam(8);
		if(timeElapsed < 300) {
			AutobanFactory.FAST_ATTACK.alert(player, "Time: " + timeElapsed);
		}
		player.getAutobanManager().spam(8);*/
		AttackInfo attack = parseDamage(slea, player, true, false);
		if(player.getBuffEffect(MapleBuffStat.MORPH) != null){
			if(player.getBuffEffect(MapleBuffStat.MORPH).isMorphWithoutAttack()){
				// How are they attacking when the client won't let them?
				player.getClient().disconnect(false, false);
				return;
			}
		}
		if(attack.skill == Buccaneer.ENERGY_ORB || attack.skill == ThunderBreaker.SPARK || attack.skill == Shadower.TAUNT || attack.skill == NightLord.TAUNT){
			player.getMap().broadcastMessage(player, MaplePacketCreator.rangedAttack(player, attack), false);
			applyAttack(attack, player, 1);
		}else if(attack.skill == Aran.COMBO_SMASH || attack.skill == Aran.COMBO_PENRIL || attack.skill == Aran.COMBO_TEMPEST){
			player.getMap().broadcastMessage(player, MaplePacketCreator.rangedAttack(player, attack), false);
			if(attack.skill == Aran.COMBO_SMASH && player.getCombo() >= 30){
				player.setCombo((short) 0);
				applyAttack(attack, player, 1);
			}else if(attack.skill == Aran.COMBO_PENRIL && player.getCombo() >= 100){
				player.setCombo((short) 0);
				applyAttack(attack, player, 2);
			}else if(attack.skill == Aran.COMBO_TEMPEST && player.getCombo() >= 200){
				player.setCombo((short) 0);
				applyAttack(attack, player, 4);
			}
		}else{
			Item weapon = player.getInventory(MapleInventoryType.EQUIPPED).getItem((short) -11);
			MapleWeaponType type = ItemInformationProvider.getInstance().getWeaponType(weapon.getItemId());
			if(type == MapleWeaponType.NOT_A_WEAPON) return;
			int projectile = 0;
			byte bulletCount = 1;
			MapleStatEffect effect = null;
			if(attack.skill != 0){
				effect = attack.getAttackEffect(player, null);
				bulletCount = effect.getBulletCount();
				if(effect.getCooldown() > 0){
					c.announce(MaplePacketCreator.skillCooldown(attack.skill, effect.getCooldown()));
				}
			}
			boolean hasShadowPartner = player.getBuffedValue(MapleBuffStat.SHADOWPARTNER) != null;
			if(hasShadowPartner){
				bulletCount *= 2;
			}
			MapleInventory inv = player.getInventory(MapleInventoryType.USE);
			for(short i = 1; i <= inv.getSlotLimit(); i++){
				Item item = inv.getItem(i);
				if(item != null){
					int id = item.getItemId();
					boolean bow = ItemConstants.isArrowForBow(id);
					boolean cbow = ItemConstants.isArrowForCrossBow(id);
					if(item.getQuantity() >= bulletCount){ // Fixes the bug where you can't use your last arrow.
						ItemData data = ItemInformationProvider.getInstance().getItemData(id);
						if(player.getLevel() < data.reqLevel) continue;
						if(type == MapleWeaponType.CLAW && ItemConstants.isThrowingStar(id) && weapon.getItemId() != 1472063){
							projectile = id;
							break;
							/*if(((id == 2070007 || id == 2070018) && player.getLevel() < 70) || (id == 2070016 && player.getLevel() < 50)){}else{
								projectile = id;
								break;
							}*/
						}else if((type == MapleWeaponType.GUN && ItemConstants.isBullet(id))){
							projectile = id;
							break;
							/*if(id == 2331000 && id == 2332000){
								if(player.getLevel() > 69){
									projectile = id;
									break;
								}
							}else if(player.getLevel() > (id % 10) * 20 + 9){
								projectile = id;
								break;
							}*/
						}else if((type == MapleWeaponType.BOW && bow) || (type == MapleWeaponType.CROSSBOW && cbow) || (weapon.getItemId() == 1472063 && (bow || cbow))){
							projectile = id;
							break;
						}
					}
				}
			}
			boolean soulArrow = player.getBuffedValue(MapleBuffStat.SOULARROW) != null;
			boolean shadowClaw = player.getBuffedValue(MapleBuffStat.SHADOW_CLAW) != null;
			if(projectile != 0){
				if(!soulArrow && !shadowClaw && attack.skill != 11101004 && attack.skill != 15111007 && attack.skill != 14101006){
					byte bulletConsume = bulletCount;
					if(effect != null && effect.getBulletConsume() != 0){
						bulletConsume = (byte) (effect.getBulletConsume() * (hasShadowPartner ? 2 : 1));
					}
					MapleInventoryManipulator.removeStarById(c, MapleInventoryType.USE, projectile, bulletConsume, false, !ItemConstants.isThrowingStar(projectile));
				}
			}
			if(projectile != 0 || soulArrow || attack.skill == 11101004 || attack.skill == 15111007 || attack.skill == 14101006){
				int visProjectile = projectile; // visible projectile sent to players
				if(ItemConstants.isThrowingStar(projectile)){
					MapleInventory cash = player.getInventory(MapleInventoryType.CASH);
					for(int i = 1; i <= cash.getSlotLimit(); i++){ // impose order...
						Item item = cash.getItem((short) i);
						if(item != null){
							if(item.getItemId() / 1000 == 5021){
								visProjectile = item.getItemId();
								break;
							}
						}
					}
				}else // bow, crossbow
				if(soulArrow || attack.skill == 3111004 || attack.skill == 3211004 || attack.skill == 11101004 || attack.skill == 15111007 || attack.skill == 14101006){
					visProjectile = 0;
				}
				byte[] packet;
				attack.projectile = visProjectile;
				switch (attack.skill){
					case 3121004: // Hurricane
					case 3221001: // Pierce
					case 5221004: // Rapid Fire
					case 13111002: // KoC Hurricane
						packet = MaplePacketCreator.rangedAttack(player, attack);
						break;
					default:
						packet = MaplePacketCreator.rangedAttack(player, attack);
						break;
				}
				player.getMap().broadcastMessage(player, packet, false, true);
				if(effect != null){
					int money = effect.getMoneyCon();
					if(money != 0){
						int moneyMod = money / 2;
						money += Randomizer.nextInt(moneyMod);
						if(money > player.getMeso()){
							money = player.getMeso();
						}
						player.gainMeso(-money, false);
					}
				}
				if(attack.skill != 0){
					Skill skill = SkillFactory.getSkill(attack.skill);
					MapleStatEffect effect_ = skill.getEffect(player.getSkillLevel(skill));
					if(effect_.getCooldown() > 0){
						if(player.skillisCooling(attack.skill)){
							return;
						}else{
							c.announce(MaplePacketCreator.skillCooldown(attack.skill, effect_.getCooldown()));
							player.addCooldown(attack.skill, System.currentTimeMillis(), effect_.getCooldown() * 1000, TimerManager.getInstance().schedule("rah-cancel", new CancelCooldownAction(player, attack.skill), effect_.getCooldown() * 1000));
						}
					}
				}
				if((player.getSkillLevel(SkillFactory.getSkill(NightWalker.VANISH)) > 0 || player.getSkillLevel(SkillFactory.getSkill(WindArcher.WIND_WALK)) > 0) && attack.numAttacked > 0 && player.getBuffSource(MapleBuffStat.DARKSIGHT) != 9101004){
					player.cancelEffectFromBuffStat(MapleBuffStat.DARKSIGHT);
					player.cancelBuffStats(MapleBuffStat.DARKSIGHT);
					player.cancelEffectFromBuffStat(MapleBuffStat.WIND_WALK);
					player.cancelBuffStats(MapleBuffStat.WIND_WALK);
				}
				applyAttack(attack, player, bulletCount);
			}
		}
	}
}