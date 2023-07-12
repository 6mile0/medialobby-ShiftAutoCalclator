async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "calcWorkTime":
        getCurrentTab().then((tab) => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                  function calcWorkTime(valueData) {
                    const nowDate = new Date(); // 今日の日付を取得
                    var workTime = valueData.split("-"); // 稼働時間を分割
                    // スタートの稼働時間を取得
                    var startWorkTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), workTime[0].split(":")[0], workTime[0].split(":")[1], 0);
                    console.log(startWorkTime.toLocaleString());
                    // 終了の稼働時間を取得
                    var endWorkTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), workTime[1].split(":")[0], workTime[1].split(":")[1], 0);
                    console.log(endWorkTime.toLocaleString());

                    // 稼働時間を計算
                    var resultWorkTime = new Date(endWorkTime.getTime() - startWorkTime.getTime());
                    var min = ("0" + Math.floor(resultWorkTime / 1000 / 60) % 60).slice(-2);
                    var hours = Math.floor(resultWorkTime / 1000 / 60 / 60) % 24;
                    return {
                      hours: hours,
                      min: min
                    };
                  }
                  // const nowDate = new Date(); // 今日の日付を取得
                  let workTimeData = calcWorkTime(document.querySelector('[aria-labelledby="i6"]').value); // フォームから稼働時間を取得
                  let subworkTimeData = document.querySelector('[aria-labelledby="i14"]').value; // フォームから稼働時間を取得(勤務時間帯②)
                  var sumHour = 0;
                  var sumMin = 0;
                  if (subworkTimeData) {
                    subworkTimeData = calcWorkTime(subworkTimeData);
                    document.querySelector('[aria-labelledby="i18"]').value = subworkTimeData.hours + ":" + subworkTimeData.min;
                    sumHour = parseInt(workTimeData.hours) + parseInt(subworkTimeData.hours);
                    sumMin = parseInt(workTimeData.min) + parseInt(subworkTimeData.min);
                    sumMin = ("0" + sumMin).slice(-2);
                  } else {
                    sumHour = workTimeData.hours;
                    sumMin = workTimeData.min;
                    sumMin = ("0" + sumMin).slice(-2);
                  }
                  alert("稼働時間は" + sumHour + ":" + sumMin + "です。");
                  // 稼働時間を出力
                  document.querySelector('[aria-labelledby="i10"]').value = workTimeData.hours + ":" + workTimeData.min;
                  document.querySelector('[aria-labelledby="i22"]').value = sumHour + ":" + sumMin;
                  // フォームのバリデーションをトリガーするため、イベントを作成して送信する
                  const event = new Event('input', { bubbles: true });
                  const exp10 = document.querySelector('[aria-labelledby="i10"]');
                  const exp22 = document.querySelector('[aria-labelledby="i22"]');
                  exp10.dispatchEvent(event);
                  exp22.dispatchEvent(event);
                },
              });
        });
      break;
  }
});