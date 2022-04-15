browser.storage.sync.get("tbcustomuicss").then((r) => updateApplicationCss(r.tbcustomuicss));

if (messenger.windows){
  console.log("Applying custom CSS window listener..");
  messenger.windows.onCreated.addListener(
    () => { browser.storage.sync.get("tbcustomuicss").then((r) => updateApplicationCss(r.tbcustomuicss)); });
}

function updateApplicationCss(css){
  if (css !== undefined) {
    console.log("Applying custom CSS..");
    browser.tbcustomuicss.update(css);
  }
}