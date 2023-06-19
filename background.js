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
                  const nowDate = new Date(); // 今日の日付を取得
                  var workTimeData = document.querySelector('[aria-labelledby="i6"]').value; // フォームから稼働時間を取得
                  var workTime = workTimeData.split("-"); // 稼働時間を分割

                  //スタートの稼働時間を取得
                  var startWorkTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), workTime[0].split(":")[0], workTime[0].split(":")[1], 0);
                  console.log(startWorkTime.toLocaleString());
                  //終了の稼働時間を取得
                  var endWorkTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), workTime[1].split(":")[0], workTime[1].split(":")[1], 0);
                  console.log(endWorkTime.toLocaleString());

                  //稼働時間を計算
                  var resultWorkTime = new Date(endWorkTime.getTime() - startWorkTime.getTime());

                  var min = ("0" + Math.floor(resultWorkTime / 1000 / 60) % 60).slice(-2);
                  var hours = Math.floor(resultWorkTime / 1000 / 60 / 60) % 24;

                  alert("稼働時間は" + hours + ":" + min + "です。");

                  // 稼働時間を出力
                  document.querySelector('[aria-labelledby="i10"]').value = hours + ":" + min;
                  document.querySelector('[aria-labelledby="i22"]').value = hours + ":" + min;
                },
              });
        });
      break;
  }
});
