let container = document.createElement("div");
container.id = "scroll-percentage-container";

window.addEventListener("load", () => {
  chrome.storage.sync.get(["enabled", "appearance"], (result) => {
    let { enabled, appearance } = result;
    updateStyle(appearance);
    updateText();
    updateVisibility(enabled);
    document.body.append(container);
  });
});

window.addEventListener("scroll", updateText);

chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "UPDATE_STYLE":
      updateStyle(message.data);
      break;
    case "UPDATE_VISIBILITY":
      updateVisibility(message.data);
      break;
    default:
  }
});

// The `display` property is handled by the function `updateVisibility`
function updateStyle({
  position,
  fontSize,
  fontColor,
  backgroundColor,
  backgroundColorHover,
  borderRadius,
}) {
  let targetStyle = {
    bottom: "initial",
    left: "initial",
    right: "initial",
    top: "initial",
    "font-size": `${fontSize}px`,
    color: fontColor,
    background: backgroundColor,
    "border-radius": `${borderRadius}px`,
  };

  ["bottom", "left", "right", "top"].forEach((property) => {
    if (position.includes(property)) targetStyle[property] = "10px";
  });

  for (property in targetStyle) {
    let value = targetStyle[property];
    container.style.setProperty(property, value);
  }

  container.style.setProperty("--background-color-hover", backgroundColorHover);
}

function updateText() {
  let scrollY = window.scrollY;

  // Check this:
  // https://javascript.info/size-and-scroll-window
  let documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );

  let windowHeight = window.innerHeight;
  let heightToScroll = documentHeight - windowHeight;
  let percentage =
    heightToScroll === 0
      ? 100
      : (scrollY * 100) / (documentHeight - windowHeight);
  let roundedPercentage = Math.round(percentage * 100) / 100;

  container.textContent = `${roundedPercentage}%`;
}

function updateVisibility(enabled) {
  container.style.setProperty("display", enabled ? "block" : "none");
}
