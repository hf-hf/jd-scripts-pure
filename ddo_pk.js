/*
京享值PK
cron 15 0,6,13,19,21 * * * ddo_pk.js
更新时间：2021-6-7
活动入口：京东APP-我的-京享值
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京享值PK
15 0,6,13,19,21 * * * https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js, tag=京享值PK
================Loon==============
[Script]
cron "15 0,6,13,19,21 * * *" script-path=https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js,tag=京享值PK
===============Surge=================
京享值PK = type=cron,cronexp="15 0,6,13,19,21 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js
============小火箭=========
京享值PK = type=cron,script-path=https://raw.githubusercontent.com/hyzaw/scripts/main/ddo_pk.js, cronexpr="15 0,6,13,19,21 * * *", timeout=3600, enable=true
*/
const $ = new Env('京享值PK');
$.toObj = (t, e = null) => {
	try {
		return JSON.parse(t)
	} catch {
		return e
	}
}
$.toStr = (t, e = null) => {
	try {
		return JSON.stringify(t)
	} catch {
		return e
	}
}
const notify = $.isNode() ? require("./sendNotify") : "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const sck = $.isNode() ? "set-cookie" : "Set-Cookie";
let cookiesArr = [],
	cookie = "",
	message;
let minPrize = 1;
let bcomplate = false;

if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) => {
		cookiesArr.push(jdCookieNode[item]);
	});
	if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") console.log = () => {};
} else {
	cookiesArr = [
		$.getdata("CookieJD"),
		$.getdata("CookieJD2"),
		...jsonParse($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
	].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
let authorPin='';
$.helpAuthor=false;
!(async () => {
	if (!cookiesArr[0]) {
		$.msg(
			$.name,
			"【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
			"https://bean.m.jd.com/", {
				"open-url": "https://bean.m.jd.com/"
			}
		);
		return;
	}
	for (let i = 0; i < cookiesArr.length; i++) {
		if (cookiesArr[i]) {
			cookie = cookiesArr[i];
			$.UserName = decodeURIComponent(
				cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
			);
			$.index = i + 1;
			message = "";
			console.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
			await main()
		}
	}
})()
.catch((e) => {
		$.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
	})
	.finally(() => {
		$.done();
	});

function showMsg() {
	return new Promise(resolve => {
		$.log($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
		resolve()
	})
}

async function main() {
	await getToken();
	console.log("当前token：" + $.token);
	if ($.token) {
		await getPin();
		if ($.pin) {
			console.log("当前pin（pk码）：" + $.pin);
		}
		await getPinList(30); // 获取的pin列表
		let myScore=await getScore($.pin);
		//await submitPKCode($.pin)
		console.log("我的京享值:"+myScore);
		if($.pinList){
			console.log($.pinList)
			for(let i = 0; i < $.pinList.length ; i++){
				if(bcomplate){
					break;
				}
				else{
					let pin = $.pinList[i];
					console.log('别人的的pin：' + pin)
					let fscore=await getScore(pin);
					console.log("别人的京享值:"+fscore);
					if(fscore<myScore){
						await launchBattle(pin);
						await receiveBattle(pin);
					}					
					
				}
		
			}
			bcomplate =false;
		}

		await getBoxRewardInfo();
		console.log("去开宝箱");
		if($.awards){
		    for(let index=0;index<$.awards.length;index++){
		        let item=$.awards[index];
		        if(item.received==0){
		            if($.totalWins>=item.wins){
		                await sendBoxReward(item.id);
		            }
		        }
		    }
		}
	}
}

function submitPKCode (pin) {
	console.log(`上传pk码: ${pin}`);
	return new Promise((resolve) => {
		let options = {
			"url": `https://pool.nz.lu/api/v2/upload?name=PK&code=${pin}`,
			"headers": {
				"Host": "pool.nz.lu",
				"Connection": "keep-alive",
				"Accept": " */*",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4433.0 Safari/537.36",
				"Accept-Language": "zh-cn",
			}
		}

		$.get(options, (err, resp, res) => {
			try {
				if (res) {
					console.log(`${pin}上传成功`)
				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(res);
			}
		})
	})
}

function getPinList(num = 20){
	console.log("获取Pk列表");
	$.pinList = [
		'7b289f81cdaff544aebb738028e5156d0f296a206a12473f57d63d95f3be0534',
		'81786d4f5585de3dd3b5067ae3383f7d',
		'd56e56493294aea844374d951771fb2f0f296a206a12473f57d63d95f3be0534',
		'4cb937b61c85ae05473ef428c53e50740f296a206a12473f57d63d95f3be0534',
		'1e19cc8b805e384bd20d0a41aece23b7',
		'be14fbf7aa2f6037a079de577bf2fa7f',
		'b6aa8ced25f4c66d0aa2238bc3767e540f296a206a12473f57d63d95f3be0534',
		'1e6a808d10a40f65baf42719daec82720f296a206a12473f57d63d95f3be0534',
		'24c9c4ba63249791c19279556d899f9d',
		'a89662e114d08d872f9958619f57b71c',
		'493baccfa14fdd9026d4b8529fe1b3f70f296a206a12473f57d63d95f3be0534',
		'bacf49deabf237c0e17f7482d521f56c',
		'e0cde915ac74d35992b7af9ddf6095ae',
		'7699683946d8d01a898813309b74aaa0',
		'7957b947efdf490c7e278beca60a41fb0f296a206a12473f57d63d95f3be0534',
		'5a88a877ee765ed5a95f1c7d0f3e55f90f296a206a12473f57d63d95f3be0534',
		'b12f7df2eed88805c3ebf5c3fea44de30f296a206a12473f57d63d95f3be0534',
		'8125989616ad19dbd504fee9d87efd570f296a206a12473f57d63d95f3be0534',
		'02e5a83ec654352e8e05d029a8102bc30f296a206a12473f57d63d95f3be0534',
		'a4259fe6d9ade7f3e4c9501cbe46578d',
		'c9244b41f976ab2f3d392fb4e7af05bb',
		'9c1f85f26f6f25425b7e6e31e4692c7a',
		'a2de9eed544cc3a74f1ca1459083d2c4',
		'088a3b4681ef93174119adbd5e6db3d0',
		'bfc447fa451aafac57bed2ac147525ff',
		'118043f42e7813ebdf73b7f5cb5f9923',
		'3e8ce8ee96d87bb3ff0a5badd71b1cc3',
		'1cd7801acee0013b3b2f595f7c327c440f296a206a12473f57d63d95f3be0534',
		'5fdfa59a70d07f740f51c7ecdc4bb5cd',
		'77aec4d3a8296208f827778c6184585c',
		'810716372d6753254ae841aad43b4e56',
		'dfd9b395c58d7cc3b2e5b21fa78e663d',
		'f702cf7bcfb9780f202df76d0b569ca4',
		'73b0f38bc4ce40908df09d1ba5f0297e0f296a206a12473f57d63d95f3be0534',
		'07b805aa119974c229c2b8d3a36d0c3b0f296a206a12473f57d63d95f3be0534',
		'5c33b80fb74eee1d2be1fbe7697c5ce40f296a206a12473f57d63d95f3be0534',
		'57f7894bdc8d5f1b518df30c97c0380d0f296a206a12473f57d63d95f3be0534',
		'25ea8e68b820892babaaf2c5d26a281b0f296a206a12473f57d63d95f3be0534',
		'cd25cafa4daa8b9b761eb162a86a177c',
		'13be837532512709c45bd240be75f587',
		'1e26e16ea12e634240d5d564d063c339',
	  ]
	  return;
	// return new Promise((resolve) => {
	// 	let options = {
	// 		"url": `https://pool.nz.lu/api/v2/get?name=PK&count=${num}`,
	// 		"headers": {
	// 			"Host": "pool.nz.lu",
	// 			"Connection": "keep-alive",
	// 			"Accept": " */*",
	// 			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4433.0 Safari/537.36",
	// 			"Accept-Language": "zh-cn",
	// 		}
	// 	}

	// 	$.get(options, (err, resp, res) => {
	// 		try {
	// 			if (res) {
	// 				let data = $.toObj(res);
	// 				$.pinList = data.data;
	// 			}
	// 		} catch (e) {
	// 			console.log(e);
	// 		} finally {
	// 			resolve(res);
	// 		}
	// 	})
	// });
}


function launchBattle(fpin) {
	console.log("发起挑战");
	return new Promise((resolve) => {
		let options = {
			"url": `https://jd.moxigame.cn/likejxz/launchBattle?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin=${$.pin}&recipient=${fpin}&relation=1`,
			"headers": {
				"Host": "jd.moxigame.cn",
				"Content-Type": "application/json",
				"Origin": "https://game-cdn.moxigame.cn",
				"Connection": "keep-alive",
				"Accept": " */*",
				"User-Agent": "",
				"Accept-Language": "zh-cn",
			}
		}


		$.get(options, (err, resp, res) => {
			try {
				if (res) {
					let data = $.toObj(res);
					console.log(data);
					if (data) {
						data=data.data;
						if(data.msg){
						    console.log(data.msg);
							if(data.msg =="今日次数已耗尽"){
							bcomplate=true;
							}
						}else{
						     console.log($.toStr(data));
						}
					}

				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(res);
			}
		})
	});
}

function getScore(fpin){
    console.log("查询"+fpin+"分数");
	return new Promise((resolve) => {
		let options = {
        	"url": "https://jd.moxigame.cn/likejxz/getScore?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin="+fpin,
        	"headers": {
        		"Host": "jd.moxigame.cn",
        		"Content-Type": "application/json",
        		"Origin": "https://game-cdn.moxigame.cn",
        		"Connection": "keep-alive",
        		"Accept": " */*",
        		"User-Agent": "",
        		"Accept-Language": "zh-cn",
        		"Accept-Encoding": "gzip, deflate, br"
        	}
        }

		$.get(options, (err, resp, res) => {
		    let score=0;
			try {
				if (res) {
					let data = $.toObj(res);
					if (data) {
					    score = data.data;
					}
				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(score);
			}
		})
	});
}

function receiveBattle(fpin) {
	return new Promise((resolve) => {
		let options = {
			"url": `https://jd.moxigame.cn/likejxz/receiveBattle?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin=${$.pin}&recipient=${fpin}`,
			"headers": {
				"Host": "jd.moxigame.cn",
				"Content-Type": "application/json",
				"Origin": "https://game-cdn.moxigame.cn",
				"Connection": "keep-alive",
				"Accept": " */*",
				"User-Agent": "",
				"Accept-Language": "zh-cn",
				"Accept-Encoding": "gzip, deflate, br"
			}
		}
		$.get(options, (err, resp, res) => {
			try {
				if (res) {
					let data = $.toObj(res);
					console.log(data);
					if (data) {
						data=data.data;
							console.log("挑战成功");
						if(data.state==1){
						    if(data.pkResult){
						        console.log("当前胜场:"+data.pkResult.fromWinNum);
						    }
						}else{
						    console.log($.toStr(data));
						}
					}

				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(res);
			}
		})
	});
}

function getBoxRewardInfo() {
	return new Promise((resolve) => {
		let options = {
			"url": "https://pengyougou.m.jd.com/like/jxz/getBoxRewardInfo?actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin="+$.pin,
			"headers": {
				"Host": "jdjoy.jd.com",
				"Origin": "https://prodev.m.jd.com",
				"Cookie": cookie,
				"Connection": "keep-alive",
				"Accept": "application/json, text/plain, */*",
				"User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
				"Accept-Language": "zh-cn",
				"Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
			}
		}

		$.get(options, (err, resp, res) => {
			try {
				console.log(res);
				if (res) {
					let data = $.toObj(res);
					if (data.success) {
						$.awards = data.data.awards;
						$.totalWins=data.data.totalWins;
						console.log("总胜场:"+data.data.totalWins);
					}

				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(res);
			}
		})
	});
}


function sendBoxReward(rewardConfigId) {
	return new Promise((resolve) => {
		let options = {
			"url": "https://pengyougou.m.jd.com/like/jxz/sendBoxReward?rewardConfigId="+rewardConfigId+"&actId=8&appId=dafbe42d5bff9d82298e5230eb8c3f79&lkEPin="+$.pin,
			"headers": {
				"Host": "jdjoy.jd.com",
				"Origin": "https://prodev.m.jd.com",
				"Cookie": cookie,
				"Connection": "keep-alive",
				"Accept": "application/json, text/plain, */*",
				"User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
				"Accept-Language": "zh-cn",
				"Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
			}
		}

		$.get(options, (err, resp, res) => {
			try {
				console.log(res);
				if (res) {
					let data = $.toObj(res);
					if (data.success) {
						$.openAwards = data.datas;
						if($.openAwards){
						    $.openAwards.forEach(item=>{
						        console.log('获得奖励:'+$.toStr(item));
						    });
						}
					}

				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(res);
			}
		})
	});
}

function getPin() {
	return new Promise((resolve) => {
		let options = {
			"url": "https://jdjoy.jd.com/saas/framework/encrypt/pin?appId=dafbe42d5bff9d82298e5230eb8c3f79",
			"headers": {
				"Host": "jdjoy.jd.com",
				"Origin": "https://prodev.m.jd.com",
				"Cookie": cookie,
				"Connection": "keep-alive",
				"Accept": "application/json, text/plain, */*",
				"User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
				"Accept-Language": "zh-cn",
				"Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
			}
		}

		$.post(options, (err, resp, res) => {
			try {
				console.log(res);
				if (res) {
					let data = $.toObj(res);
					if (data) {
						$.pin = data.data
					}

				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(res);
			}
		})
	});
}

function getToken() {
	return new Promise((resolve) => {
		let options = {
			"url": "https://jdjoy.jd.com/saas/framework/user/token?appId=dafbe42d5bff9d82298e5230eb8c3f79&client=m&url=pengyougou.m.jd.com",
			"headers": {
				"Host": "jdjoy.jd.com",
				"Origin": "https://prodev.m.jd.com",
				"Cookie": cookie,
				"Connection": "keep-alive",
				"Accept": "application/json, text/plain, */*",
				"User-Agent": "jdapp;iPhone;9.5.4;13.6;db48e750b34fe9cd5254d970a409af316d8b5cf3;network/wifi;ADID/38EE562E-B8B2-7B58-DFF3-D5A3CED0683A;model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
				"Accept-Language": "zh-cn",
				"Referer": "https://prodev.m.jd.com/mall/active/4HTqMAvser7ctEBEdhK4yA7fXpPi/index.html?babelChannel=ttt9&tttparams=AeOIMwdeyJnTG5nIjoiMTE3LjAyOTE1NyIsImdMYXQiOiIyNS4wOTUyMDcifQ7%3D%3D&lng=00.000000&lat=00.000000&sid=&un_area="
			}
		}
		$.post(options, (err, resp, res) => {
			try {
				if (res) {
					let data = $.toObj(res);
					if (data) {
						$.token = data.data
					}

				}
			} catch (e) {
				console.log(e);
			} finally {
				resolve(res);
			}
		})
	});
}


function safeGet(data) {
	try {
		if (typeof JSON.parse(data) == "object") {
			return true;
		}
	} catch (e) {
		console.log(e);
		console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
		return false;
	}
}

function jsonParse(str) {
	if (typeof str == "string") {
		try {
			return JSON.parse(str);
		} catch (e) {
			console.log(e);
			$.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie");
			return [];
		}
	}
}

function Env(t, e) {
  class s {
      constructor(t) {
          this.env = t
      }
      send(t, e = "GET") {
          t = "string" == typeof t ? {
              url: t
          } : t;
          let s = this.get;
          return "POST" === e && (s = this.post), new Promise((e, i) => {
              s.call(this, t, (t, s, r) => {
                  t ? i(t) : e(s)
              })
          })
      }
      get(t) {
          return this.send.call(this.env, t)
      }
      post(t) {
          return this.send.call(this.env, t, "POST")
      }
  }
  return new class {
      constructor(t, e) {
          this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
      }
      isNode() {
          return "undefined" != typeof module && !!module.exports
      }
      isQuanX() {
          return "undefined" != typeof $task
      }
      isSurge() {
          return "undefined" != typeof $httpClient && "undefined" == typeof $loon
      }
      isLoon() {
          return "undefined" != typeof $loon
      }
      toObj(t, e = null) {
          try {
              return JSON.parse(t)
          } catch {
              return e
          }
      }
      toStr(t, e = null) {
          try {
              return JSON.stringify(t)
          } catch {
              return e
          }
      }
      getjson(t, e) {
          let s = e;
          const i = this.getdata(t);
          if (i) try {
              s = JSON.parse(this.getdata(t))
          } catch {}
          return s
      }
      setjson(t, e) {
          try {
              return this.setdata(JSON.stringify(t), e)
          } catch {
              return !1
          }
      }
      getScript(t) {
          return new Promise(e => {
              this.get({
                  url: t
              }, (t, s, i) => e(i))
          })
      }
      runScript(t, e) {
          return new Promise(s => {
              let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
              i = i ? i.replace(/\n/g, "").trim() : i;
              let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
              r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
              const [o, h] = i.split("@"), a = {
                  url: `http://${h}/v1/scripting/evaluate`,
                  body: {
                      script_text: t,
                      mock_type: "cron",
                      timeout: r
                  },
                  headers: {
                      "X-Key": o,
                      Accept: "*/*"
                  }
              };
              this.post(a, (t, e, i) => s(i))
          }).catch(t => this.logErr(t))
      }
      loaddata() {
          if (!this.isNode()) return {}; {
              this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
              const t = this.path.resolve(this.dataFile),
                  e = this.path.resolve(process.cwd(), this.dataFile),
                  s = this.fs.existsSync(t),
                  i = !s && this.fs.existsSync(e);
              if (!s && !i) return {}; {
                  const i = s ? t : e;
                  try {
                      return JSON.parse(this.fs.readFileSync(i))
                  } catch (t) {
                      return {}
                  }
              }
          }
      }
      writedata() {
          if (this.isNode()) {
              this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
              const t = this.path.resolve(this.dataFile),
                  e = this.path.resolve(process.cwd(), this.dataFile),
                  s = this.fs.existsSync(t),
                  i = !s && this.fs.existsSync(e),
                  r = JSON.stringify(this.data);
              s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
          }
      }
      lodash_get(t, e, s) {
          const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
          let r = t;
          for (const t of i)
              if (r = Object(r)[t], void 0 === r) return s;
          return r
      }
      lodash_set(t, e, s) {
          return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
      }
      getdata(t) {
          let e = this.getval(t);
          if (/^@/.test(t)) {
              const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
              if (r) try {
                  const t = JSON.parse(r);
                  e = t ? this.lodash_get(t, i, "") : e
              } catch (t) {
                  e = ""
              }
          }
          return e
      }
      setdata(t, e) {
          let s = !1;
          if (/^@/.test(e)) {
              const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
              try {
                  const e = JSON.parse(h);
                  this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
              } catch (e) {
                  const o = {};
                  this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
              }
          } else s = this.setval(t, e);
          return s
      }
      getval(t) {
          return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
      }
      setval(t, e) {
          return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
      }
      initGotEnv(t) {
          this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
      }
      get(t, e = (() => {})) {
          t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
              "X-Surge-Skip-Scripting": !1
          })), $httpClient.get(t, (t, s, i) => {
              !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
          })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
              hints: !1
          })), $task.fetch(t).then(t => {
              const {
                  statusCode: s,
                  statusCode: i,
                  headers: r,
                  body: o
              } = t;
              e(null, {
                  status: s,
                  statusCode: i,
                  headers: r,
                  body: o
              }, o)
          }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
              try {
                  if (t.headers["set-cookie"]) {
                      const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                      this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                  }
              } catch (t) {
                  this.logErr(t)
              }
          }).then(t => {
              const {
                  statusCode: s,
                  statusCode: i,
                  headers: r,
                  body: o
              } = t;
              e(null, {
                  status: s,
                  statusCode: i,
                  headers: r,
                  body: o
              }, o)
          }, t => {
              const {
                  message: s,
                  response: i
              } = t;
              e(s, i, i && i.body)
          }))
      }
      post(t, e = (() => {})) {
          if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
              "X-Surge-Skip-Scripting": !1
          })), $httpClient.post(t, (t, s, i) => {
              !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
          });
          else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
              hints: !1
          })), $task.fetch(t).then(t => {
              const {
                  statusCode: s,
                  statusCode: i,
                  headers: r,
                  body: o
              } = t;
              e(null, {
                  status: s,
                  statusCode: i,
                  headers: r,
                  body: o
              }, o)
          }, t => e(t));
          else if (this.isNode()) {
              this.initGotEnv(t);
              const {
                  url: s,
                  ...i
              } = t;
              this.got.post(s, i).then(t => {
                  const {
                      statusCode: s,
                      statusCode: i,
                      headers: r,
                      body: o
                  } = t;
                  e(null, {
                      status: s,
                      statusCode: i,
                      headers: r,
                      body: o
                  }, o)
              }, t => {
                  const {
                      message: s,
                      response: i
                  } = t;
                  e(s, i, i && i.body)
              })
          }
      }
      time(t) {
          let e = {
              "M+": (new Date).getMonth() + 1,
              "d+": (new Date).getDate(),
              "H+": (new Date).getHours(),
              "m+": (new Date).getMinutes(),
              "s+": (new Date).getSeconds(),
              "q+": Math.floor(((new Date).getMonth() + 3) / 3),
              S: (new Date).getMilliseconds()
          };
          /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
          for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
          return t
      }
      msg(e = t, s = "", i = "", r) {
          const o = t => {
              if (!t) return t;
              if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                  "open-url": t
              } : this.isSurge() ? {
                  url: t
              } : void 0;
              if ("object" == typeof t) {
                  if (this.isLoon()) {
                      let e = t.openUrl || t.url || t["open-url"],
                          s = t.mediaUrl || t["media-url"];
                      return {
                          openUrl: e,
                          mediaUrl: s
                      }
                  }
                  if (this.isQuanX()) {
                      let e = t["open-url"] || t.url || t.openUrl,
                          s = t["media-url"] || t.mediaUrl;
                      return {
                          "open-url": e,
                          "media-url": s
                      }
                  }
                  if (this.isSurge()) {
                      let e = t.url || t.openUrl || t["open-url"];
                      return {
                          url: e
                      }
                  }
              }
          };
          this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
          let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
          h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
      }
      log(...t) {
          t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
      }
      logErr(t, e) {
          const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
          s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
      }
      wait(t) {
          return new Promise(e => setTimeout(e, t))
      }
      done(t = {}) {
          const e = (new Date).getTime(),
              s = (e - this.startTime) / 1e3;
          this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
      }
  }(t, e)
}
