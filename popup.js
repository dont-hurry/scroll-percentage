let enabledCheckbox = document.querySelector("input#enabled");
let optionsButton = document.querySelector("button");

chrome.storage.sync.get("enabled", ({ enabled }) => {
  enabledCheckbox.checked = enabled;
});

enabledCheckbox.addEventListener("change", async () => {
  let enabled = enabledCheckbox.checked;
  chrome.storage.sync.set({ enabled });

  let tabs = await chrome.tabs.query({});
  let message = {
    action: "UPDATE_VISIBILITY",
    data: enabled,
  };
  tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, message));
});

optionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());
