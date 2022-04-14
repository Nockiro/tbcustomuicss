console.log("Applying global custom CSS..");
browser.storage.sync.get("TbUiCss").then((r) => updateGlobalCss(r.TbUiCss));

if (messenger.windows){
  console.log("Applying global custom CSS window listener..");
  messenger.windows.onCreated.addListener(
    () => { browser.storage.sync.get("TbUiCss").then((r) => updateGlobalCss(r.TbUiCss)); });
}

function updateGlobalCss(css){
  if (css !== undefined) {
    browser.tbuicss.updateCss(css);
  }
}