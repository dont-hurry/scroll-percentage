chrome.storage.sync.get(
  ["enabled", "appearance", "defaultAppearance"],
  ({ enabled, appearance, defaultAppearance }) => {
    updateInputElements({ enabled, appearance });
    injectDefaultValues(defaultAppearance);
  }
);

document.querySelector("input#enabled").onchange = async (e) => {
  let enabled = e.target.checked;
  chrome.storage.sync.set({ enabled });
  sendMessageToAllTabs({ action: "UPDATE_VISIBILITY", data: enabled });
};

broadcastValueOnChange("select#position", "position");
broadcastValueOnChange("input#font-size", "fontSize");
broadcastValueOnChange("input#font-color", "fontColor");
broadcastValueOnChange("input#background-color", "backgroundColor");
broadcastValueOnChange("input#background-color-hover", "backgroundColorHover");
broadcastValueOnChange("input#border-radius", "borderRadius");

document.querySelectorAll(".show-color-tooltip").forEach((element) => {
  let colorTooltip = document.querySelector("#color-tooltip");
  element.onmouseover = (e) => {
    colorTooltip.style.setProperty("left", `${e.clientX + 10}px`);
    colorTooltip.style.setProperty("top", `${e.clientY + 7.5}px`);
    colorTooltip.classList.add("visible");
  };
  element.onmouseout = () => {
    colorTooltip.classList.remove("visible");
  };
});

function updateInputElements({ enabled, appearance }) {
  function setValue(selector, value) {
    let element = document.querySelector(selector);
    element.value = value;
  }

  let {
    position,
    fontSize,
    fontColor,
    backgroundColor,
    backgroundColorHover,
    borderRadius,
  } = appearance;

  document.querySelector("input#enabled").checked = enabled;
  setValue("#position", position);
  setValue("#font-size", fontSize);
  setValue("#font-color", fontColor);
  setValue("#background-color", backgroundColor);
  setValue("#background-color-hover", backgroundColorHover);
  setValue("#border-radius", borderRadius);
}

function injectDefaultValues({
  position,
  fontSize,
  fontColor,
  backgroundColor,
  backgroundColorHover,
  borderRadius,
}) {
  function setTextContent(selector, content) {
    let element = document.querySelector(selector);
    element.textContent = content;
  }

  function upperCaseFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  let upperCasedPosition = upperCaseFirstLetter(position);
  setTextContent("#default-position", upperCasedPosition);
  setTextContent("#default-font-size", fontSize);
  setTextContent("#default-font-color", fontColor);
  setTextContent("#default-background-color", backgroundColor);
  setTextContent("#default-background-color-hover", backgroundColorHover);
  setTextContent("#default-border-radius", borderRadius);
}

async function sendMessageToAllTabs(message) {
  let tabs = await chrome.tabs.query({});
  tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, message));
}

function broadcastValueOnChange(selector, storageKey) {
  document.querySelector(selector).onchange = async (e) => {
    // Retrieve the whole appearance object, modify it, and then sync to storage
    chrome.storage.sync.get("appearance", ({ appearance }) => {
      let value = e.target.value;
      appearance[storageKey] = value;
      chrome.storage.sync.set({ appearance });

      sendMessageToAllTabs({ action: "UPDATE_STYLE", data: appearance });
    });
  };
}
