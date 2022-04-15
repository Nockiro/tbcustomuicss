function saveOptions(e) {
    e.preventDefault();
    let uiCss = document.querySelector("#global_css_override").value;

    // note: inside the experimental implementation, browser storage is not accessable this way.
    browser.storage.sync.set({ tbcustomuicss: uiCss });
    browser.tbcustomuicss.update(uiCss);

    document.querySelector("#txt-saveStatus").textContent = "> CSS stored. Don't forget to reopen tabs if you don't see changes applied."
  }
  
  function resetOptions() {
      browser.storage.sync.set({ tbcustomuicss: '' });
      document.querySelector("#global_css_override").value = "";
      browser.tbcustomuicss.reset();  

      document.querySelector("#txt-saveStatus").textContent = "> CSS reset."
  }
  
  function restoreOptions() {
    var storageItem = browser.storage.sync.get('tbcustomuicss');
    storageItem.then((res) => {
      document.querySelector("#global_css_override").value = res.tbcustomuicss || '';

      if (res.custom_css !== undefined) {
        browser.tbcustomuicss.update(res.tbcustomuicss);
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);
  document.querySelector("#btn-reset").addEventListener("click", resetOptions);