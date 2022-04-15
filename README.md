# TB Extension: Custom UI CSS

An extension for loading custom CSS rules into thunderbirds appearance.

## What is it?
This extension allows applying custom CSS rules to the UI of Thunderbird via an application-internal settings page from the extension.  
Effectively, this avoids the need for creating/importing a custom `userChrome.css` file in your profile folder to apply minor CSS rules.  
It can also act as independent addition to an already existing userChrome file while keeping the changes contained in the extension.

## How to install it

At the moment, you can only install the extension manually.

### Manual
1. Download the XPI file under "Releases".
2. Go to the extension manager via Tools -> Add-ons and Themes
3. Under the gear icon, select "Install Add-on From File.." and choose the XPI file

## How to use it
Since this plugin is foremost intended to provide you an interface, *what* CSS you apply is your choice.  
You can try out changes and look for what to change beforehand by using Thunderbirds Developer Toolbox (see "Tools" menu).

An example, however, would be to fade-out past days in the calendar:
1. Go to the plugin's option page via the extension manager (click the tool icon next to the extension or "Manage" via its menu)
2. Enter the following code:
  ```css
  calendar-month-day-box[relation="past"] > * { opacity: 0.3; } 
  ```
3. Click "Save" and enjoy:
<img src="https://github.com/Nockiro/tbcustomuicss/raw/master/readme-img/calendar-tweak.png" height="256">    
(Click to view full-size image)
  
Note that in some cases, in order for the changes to take effect, the tab or window has to be manually closed and reopened.

## Technical notes
1. In theory, this extension could be based on Thunderbirds WebExtension APIs for [Tabs](https://webextension-api.thunderbird.net/en/91/tabs.html#tabs-tab).  
   In practice, this doesn't work at the moment since especially tabs like calendar or the task list throw an exception if you try to apply CSS there.  
   Thus, this extension works with the [WebExtension Experiments API](https://webextension-api.thunderbird.net/en/91/how-to/experiments.html) to directly access the underlying services for applying stylesheets to the complete window.
2. Since the API used for applying themes (to my knowledge) is only designed to handle files, the extension currently uses a temporary file for loading the stylesheet.
   The stylesheet itself however is stored and loaded from the local storage and the temporary file is deleted upon deactivation or removal of the extension.
3. Since the WebExtension Experimental API is used, the extension potentially has no limits in accessing the file system. This is also the reason Thunderbird asks for a privilege to access the whole system, which the extension does not do.
4. This is my first thunderbird extension (or browser extension in general), so code might be unoptimized and functions might be missing.  
   If you notice something problematic or improvable, don't hesitate to write me a mail or open an issue!