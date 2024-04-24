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
              var startWorkTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), workTime[0].split(":")[0], workTime[0].split(":")[1], 0);
              var endWorkTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), workTime[1].split(":")[0], workTime[1].split(":")[1], 0);
              return Math.floor((endWorkTime.getTime() - startWorkTime.getTime()) / 1000 / 60);
            }
            function convertTime(min) {
              return {
                hours: String(Math.floor(min / 60)),
                min: String(min % 60).padEnd(2, "0"),
              };
            }

            const workTimeData = calcWorkTime(document.querySelector('[aria-labelledby="i6"]').value); // フォームから稼働時間を取得
            const subworkTimeData = calcWorkTime(document.querySelector('[aria-labelledby="i14"]').value); // フォームから稼働時間を取得(勤務時間帯②)

            const sumWorkTime = convertTime(workTimeData + subworkTimeData);
            const convertedWorkTime = convertTime(workTimeData);
            const convertedSubWorkTime = convertTime(subworkTimeData);

            alert("稼働時間は" + sumWorkTime.hours + ":" + sumWorkTime.min + "です。");

            // 稼働時間を出力
            document.querySelector('[aria-labelledby="i10"]').value = convertedWorkTime.hours + ":" + convertedWorkTime.min;
            document.querySelector('[aria-labelledby="i18"]').value = convertedSubWorkTime.hours + ":" + convertedSubWorkTime.min;
            document.querySelector('[aria-labelledby="i22"]').value = sumWorkTime.hours + ":" + sumWorkTime.min;

            // フォームのバリデーションをトリガーするため、イベントを作成して送信する
            const event = new Event('input', { bubbles: true });
            const targetInput = [document.querySelector('[aria-labelledby="i10"]'), document.querySelector('[aria-labelledby="i18"]'), document.querySelector('[aria-labelledby="i22"]')];
            targetInput.forEach((element) => {
              element.dispatchEvent(event);
            });
          },
        });
      });
      break;
  }
});
