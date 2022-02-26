/*
================================================================================
魔改自 https://github.com/shufflewzc/faker2/blob/main/jdCookie.js
修改内容：与task_before.sh配合，由task_before.sh设置要设置要做互助的活动的 ShareCodeConfigName 和 ShareCodeEnvName 环境变量，
        然后在这里实际解析/ql/log/.ShareCode中该活动对应的配置信息（由code.sh生成和维护），注入到nodejs的环境变量中
修改原因：原先的task_before.sh直接将互助信息注入到shell的env中，在ck超过45以上时，互助码环境变量过大会导致调用一些系统命令
        （如date/cat）时报 Argument list too long，而在node中修改环境变量不会受这个限制，也不会影响外部shell环境，确保脚本可以正常运行
魔改作者：风之凌殇
================================================================================

此文件为Node.js专用。其他用户请忽略
 */
//此处填写京东账号cookie。
let CookieJDs = [
  'shshshfpa=b4d2d2a5-0c58-4370-a724-fd40d0f96f55-1619076212; shshshfpb=zvigyzJuPxWvK2MXZeck9WQ%3D%3D; __jdu=1619076212644387191215; whwswswws=; unpl=JF8EAKtuNSttW0oGUhwLSUdEG19WW18JQh5TPG8HXFxQTQACHApPFBN7XlVdXhRKFx9sYhRUVFNKUw4aBisSEXtdVV9cDEkRBGpmNWRtW0tkBCsCHBIYSltTXV0LTBIGbW4DVFVYSFQBKzIbGhR7bWReWQhMFANoZgNVbVl7VgQaBxsSGExYUG4LZksWAm5mBFdfXEoZBRwCExMWTF5UXVoNThUKaWcNVF5YT2QEKwE; pinId=oCBb5bgqQ0M_oQZ5YEsrYbV9-x-f3wj7; pin=jd_745404471bfff; unick=jd_157670vdt; _tp=7%2Fk762Dg%2BWViubXbil1FWzdHqlFf9Uv%2FUhax%2BE6OBIA%3D; _pst=jd_745404471bfff; ipLoc-djd=19-1607-4773-62121; user-key=d0147ee8-2d0b-452a-a824-907f6ed0ab6c; mba_muid=1619076212644387191215; __jdv=122270672%7Cdirect%7C-%7Cnone%7C-%7C1645250190105; __jda=122270672.1619076212644387191215.1619076213.1643262635.1645250190.17; __jdc=122270672; shshshfp=97c31f7c6ee9ee1fef4ffc3a2107ea5d; shshshsID=f8ed595ee71e948eacc2658676ec07d3_1_1645250202477; 3AB9D23F7A4B3C9B=HTGRALPK4GBGQTHV3UEH6HTFMNFM2QHWBJNWVL73D4EF7VAMDNC3IPPVCX3Q5L2TQNMXIABCDQWEBWNPEUWQLMQ7ZM; jcap_dvzw_fp=MyHAf9NgSMrYMqdoyCchRGSaIzPn9f6hsw1o5Q834NJDKsdD2hqa3ptdUke74CjR40S3bA==; TrackerID=Gmr43oD66aPpm7ADrWPXEQsByUopdpjI3kYwRL7OOPf0klynF-DiNKcsk5LzY1_EXq5DDurThBbrAe9p0WW5DGpdUgJwMfqsknMlHp84HtKJ2vIg601awGcqdvOQkC04vogQrTdRb_Lb7lzOuQQBPw; pt_key=AAJiEIb8ADAE-HXIVVfNNq5Rkivmpjwg6_u7UAUCoTjWCufsReDRI8rdWgANCWw0RscRqWMDWaY; pt_pin=jd_62087b8b0251f; pt_token=91cr4ktb; pwdt_id=jd_62087b8b0251f; sfstoken=tk01m6a1c19eda8sMngzSUg4MjZn5abOuNP7TKC3+55U+RK/a/+tBY2/gh3X86p9QSGmfcNSn+EDJhZ84JAW86ONjHvA; __jd_ref_cls=JingDou_NewHome_Sign; mobilev=html5; __jdb=122270672.5.1619076212644387191215|17.1645250190; mba_sid=16452501901078129039925641079.5',
  '__jdu=1423933257; shshshfpa=b8bc04de-07cc-ff8a-24f7-62aacac8ddd2-1635692894; shshshfpb=xAfu9fMcDDpW9a56KThsBfw%3D%3D; __jdc=122270672; ipLoc-djd=19-1607-4773-62121; wlfstk_smdl=bkuvrd9ul5tebe0x4s7cp4x8na5m1hed; __jda=122270672.1423933257.1633677054.1644766710.1645802696.7; __jdv=122270672%7Cdirect%7C-%7Cnone%7C-%7C1645802696021; mba_muid=1423933257; shshshfp=aad01df6dcae97e1a6a8451518585bae; shshshsID=d7cad8b6817cbd5b44ab84b5f40318e8_1_1645802712554; 3AB9D23F7A4B3C9B=IUCCFNPKQRPE2VJSPRBOPQS3DZHIR4E4GRYAO6L7RKAFY7OMYJOJ3APRPOVNO5HW3FH6QRNJQYHYQMXMWDA7GEJ434; jcap_dvzw_fp=B4aJ8EmbJyfTzAT8byRfFUS9Fqkb9NIlaLstoKs5CdkFcmzk_0YJO8YsbpP91wp8Cr1cmw==; TrackerID=6bJ8Uq9TsT_I92Fob_huLheYLtLYFAMm0psodddwzxhtVWHK7nbxHBxkS0bPnWXfLke2mGXxDVWyjbhNVcI0eFTTDyT1VsPu8m43i-0ydKBvHqhnzwRKcijOoIMgcecK; pt_key=AAJiGPU-ADC_Az5vQap7_ZykkiDhxM64DxieBARjMG2wtzcQtO_QS9tgY-GJABmry-fReVuFXFs; pt_pin=jd_KagzyvvqtYHi; pt_token=aigm20p5; pwdt_id=jd_KagzyvvqtYHi; sfstoken=tk01m98921b71a8sMSszTWp4V3Q3Q5dAUCH8yOwiqG8gB/sEpDJ6ygnKgCR7i4MjtLYm0gb7FFMqOx9v2eByN2U80GWl; whwswswws=; __jd_ref_cls=JingDou_NewHome_Sign; mobilev=html5; __jdb=122270672.5.1423933257|7.1645802696; mba_sid=1645802696026362535118992561.5',
  '__jda=122270672.16458039358011656777781.1645803935.1645803935.1645803935.1; __jdb=122270672.2.16458039358011656777781|1.1645803935; __jdv=122270672%7Cdirect%7C-%7Cnone%7C-%7C1645803935802; __jdc=122270672; mba_muid=16458039358011656777781; mba_sid=16458039358032204446728092726.2; shshshfp=d8fa892a2d66263be01da683b0137dc8; shshshfpa=b8a14458-bf1b-4bb9-491b-2e016c11212a-1645803936; shshshsID=c15b46d0e68933e6b7cecc1846fa16ec_1_1645803936045; shshshfpb=fVozi_uNTRF9FOemZPdLUZw; 3AB9D23F7A4B3C9B=PAI76GWLCUEMFMRRCBLJ5OXV26GJMRW4EERTCTXH34FE3SZEQCGTINQRCPIPO775JLRURZZZJWLC6N6ZU4QP4SD6BI; jcap_dvzw_fp=TjO-KfJ5guZyCCILGq9TL6d-XNjWTW6yTMelTasSNGclXUNU13CtTfwJ6IFklfpCQgfFvg==; TrackerID=4sSE9iIUSzpC-9eo_sUQ3rYj87pcdlv3eDYwvHtFeoVH5rP4M4Pe-A5IUaSwUWTbjSB-W5cqoCJYaAjgit0G4pTOzcw-YQ_2P5s2vAUFqlS1veiZZqa-53gOR02tHukV; pt_key=AAJiGPm9ADDtxzt4qtcjnCkPZwU2bq_daH6WVK3jxGzPj_YW5V3EryOSB7Ze-GoKMDd4G6125xo; pt_pin=jd_745404471bfff; pt_token=co5vd5b5; pwdt_id=jd_745404471bfff; sfstoken=tk01md7231c86a8sMSsxWEVlejdt4lroKxZCzmFtHm78Hi4NMG7/DXAWFIuaidvx4zUZElnaB3ZD4VfMy1KpeR8OrDGH; whwswswws=; mobilev=html5; __jd_ref_cls=Mnpm_ComponentApplied'
  // '',//账号二ck,如有更多,依次类推
  ]
// 判断环境变量里面是否有京东ck
if (process.env.JD_COOKIE) {
  if (process.env.JD_COOKIE.indexOf('&') > -1) {
    CookieJDs = process.env.JD_COOKIE.split('&');
  } else if (process.env.JD_COOKIE.indexOf('\n') > -1) {
    CookieJDs = process.env.JD_COOKIE.split('\n');
  } else {
    CookieJDs = [process.env.JD_COOKIE];
  }
}
if (JSON.stringify(process.env).indexOf('GITHUB')>-1) {
  console.log(`请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n`);
  !(async () => {
    await require('./sendNotify').sendNotify('提醒', `请勿使用github action、滥用github资源会封我仓库以及账号`)
    await process.exit(0);
  })()
}
CookieJDs = [...new Set(CookieJDs.filter(item => !!item))]
console.log(`\n====================共${CookieJDs.length}个京东账号Cookie=========\n`);
console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString('zh', {hour12: false}).replace(' 24:',' 00:')}=====================\n`)
if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
for (let i = 0; i < CookieJDs.length; i++) {
  if (!CookieJDs[i].match(/pt_pin=(.+?);/) || !CookieJDs[i].match(/pt_key=(.+?);/)) console.log(`\n提示:京东cookie 【${CookieJDs[i]}】填写不规范,可能会影响部分脚本正常使用。正确格式为: pt_key=xxx;pt_pin=xxx;（分号;不可少）\n`);
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieJD' + index] = CookieJDs[i].trim();
}

// 以下为注入互助码环境变量（仅nodejs内起效）的代码
function SetShareCodesEnv(nameChinese = "", nameConfig = "", envName = "") {
  let rawCodeConfig = {}

  // 读取互助码
  shareCodeLogPath = `${process.env.QL_DIR}/log/.ShareCode/${nameConfig}.log`
  let fs = require('fs')
  if (fs.existsSync(shareCodeLogPath)) {
    // 因为faker2目前没有自带ini，改用已有的dotenv来解析
    // // 利用ini模块读取原始互助码和互助组信息
    // let ini = require('ini')
    // rawCodeConfig = ini.parse(fs.readFileSync(shareCodeLogPath, 'utf-8'))

    // 使用env模块
    require('dotenv').config({path: shareCodeLogPath})
    rawCodeConfig = process.env
  }

  // 解析每个用户的互助码
  codes = {}
  Object.keys(rawCodeConfig).forEach(function (key) {
    if (key.startsWith(`My${nameConfig}`)) {
      codes[key] = rawCodeConfig[key]
    }
  });

  // 解析每个用户要帮助的互助码组，将用户实际的互助码填充进去
  let helpOtherCodes = {}
  Object.keys(rawCodeConfig).forEach(function (key) {
    if (key.startsWith(`ForOther${nameConfig}`)) {
      helpCode = rawCodeConfig[key]
      for (const [codeEnv, codeVal] of Object.entries(codes)) {
        helpCode = helpCode.replace("${" + codeEnv + "}", codeVal)
      }

      helpOtherCodes[key] = helpCode
    }
  });

  // 按顺序用&拼凑到一起，并放入环境变量，供目标脚本使用
  let shareCodes = []
  let totalCodeCount = Object.keys(helpOtherCodes).length
  for (let idx = 1; idx <= totalCodeCount; idx++) {
    shareCodes.push(helpOtherCodes[`ForOther${nameConfig}${idx}`])
  }
  let shareCodesStr = shareCodes.join('&')
  process.env[envName] = shareCodesStr

  console.info(`${nameChinese} 的 互助码环境变量 ${envName}，共计 ${totalCodeCount} 组互助码，总大小为 ${shareCodesStr.length} 字节`)
}

// 若在task_before.sh 中设置了要设置互助码环境变量的活动名称和环境变量名称信息，则在nodejs中处理，供活动使用
let nameChinese = process.env.ShareCodeConfigChineseName
let nameConfig = process.env.ShareCodeConfigName
let envName = process.env.ShareCodeEnvName
if (nameChinese && nameConfig && envName) {
  SetShareCodesEnv(nameChinese, nameConfig, envName)
}
