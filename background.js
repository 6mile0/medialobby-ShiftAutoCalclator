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
                    
                },
              });
        });
      break;
  }
});
