// Default settings
const POSITION = "top-right";
const FONT_SIZE = 16; // px
const FONT_COLOR = "#ffffff";
const BACKGROUND_COLOR = "rgba(0, 0, 0, 0.2)";
const BACKGROUND_COLOR_HOVER = "rgba(0, 0, 0, 0.7)";
const BORDER_RADIUS = 5; //px

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    appearance: {
      position: POSITION,
      fontSize: FONT_SIZE,
      fontColor: FONT_COLOR,
      backgroundColor: BACKGROUND_COLOR,
      backgroundColorHover: BACKGROUND_COLOR_HOVER,
      borderRadius: BORDER_RADIUS,
    },
    defaultAppearance: {
      position: POSITION,
      fontSize: FONT_SIZE,
      fontColor: FONT_COLOR,
      backgroundColor: BACKGROUND_COLOR,
      backgroundColorHover: BACKGROUND_COLOR_HOVER,
      borderRadius: BORDER_RADIUS,
    },
  });
});
