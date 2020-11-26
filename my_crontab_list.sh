2 0 * * * source /etc/profile && /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_bean_sign.js >> /app/jd_scripts/logs/jd_bean_sign.log 2>&1
2 0 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_blueCoin.js >> /app/jd_scripts/logs/jd_blueCoin.log 2>&1
2 0 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_club_lottery.js >> /app/jd_scripts/logs/jd_club_lottery.log 2>&1
20 6-18/6 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_fruit.js >> /app/jd_scripts/logs/jd_fruit.log 2>&1
*/20 */1 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_joy_feedPets.js >> /app/jd_scripts/logs/jd_joy_feedPets.log 2>&1
0 0,4,8,16 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_joy_reward.js >> /app/jd_scripts/logs/jd_joy_reward.log 2>&1
0 1,6 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_joy_steal.js >> /app/jd_scripts/logs/jd_joy_steal.log 2>&1
0 0,1,4,10,15,16 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_joy.js >> /app/jd_scripts/logs/jd_joy.log 2>&1
# 40 */3 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_moneyTree.js >> /app/jd_scripts/logs/jd_moneyTree.log 2>&1
35 23,4,10 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_pet.js >> /app/jd_scripts/logs/jd_pet.log 2>&1
0 23,0-13/1 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_plantBean.js >> /app/jd_scripts/logs/jd_plantBean.log 2>&1
2 0 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_redPacket.js >> /app/jd_scripts/logs/jd_redPacket.log 2>&1
3 0 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_shop.js >> /app/jd_scripts/logs/jd_shop.log 2>&1
15 * * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_superMarket.js >> /app/jd_scripts/logs/jd_superMarket.log 2>&1
# 1 0-18/6 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_818.js >> /app/jd_scripts/logs/jd_818.log 2>&1
# 2 0 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_xtg.js >> /app/jd_scripts/logs/jd_xtg.log 2>&1
# 2 0 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_xtg_nn.js >> /app/jd_scripts/logs/jd_xtg_nn.log 2>&1
# 2 0 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_xtg_ff.js >> /app/jd_scripts/logs/jd_xtg_ff.log 2>&1
0 */15 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_daily_egg.js >> /app/jd_scripts/logs/jd_daily_egg.log 2>&1
12 * * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_pigPet.js >> /app/jd_scripts/logs/jd_pigPet.log 2>&1
20 0,20 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_necklace.js >> /app/jd_scripts/logs/jd_necklace.log 2>&1
55 23 * * * /usr/bak/nodejs/node-v12.16.0-linux-x64/bin/node /app/jd_scripts/jd_unsubscribe.js >> /app/jd_scripts/logs/jd_unsubscribe.log 2>&1