# Thomann → Slovenia

Chrome extension that forces every Thomann link to open in the **Slovenia (en-si)** shop.

## How it works

Thomann encodes the country in the URL: `https://www.thomannmusic.com/en-si/<page>` is the Slovenia shop,
the same page without the prefix is the US shop, and other countries live on their own domains (thomann.de, thomann.co.uk, ...).

- **thomannmusic.com** (US or any other `xx-yy` prefix): a `declarativeNetRequest` rule rewrites the URL to `/en-si/...`
  at the network level, before the page loads. No flash of the US page.
- **Other Thomann domains** (thomann.de, thomann.co.uk, ...): a content script reads the page's `en-US` hreflang link
  (or the product path, which is identical on every country site) and jumps to its `/en-si/` version.

## Install (unpacked)

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `extension/` folder

Chrome keeps it installed across restarts. If you edit files, click the reload icon on the extension card.

## Change the country

Edit `en-si` in `extension/rules.json` (two places) and `extension/redirect.js` (`TARGET`). Reload the extension.

## Caveats

- Thomann's own country selector will be overridden: if you pick another country, the extension sends you back to Slovenia.
  Disable the extension temporarily if you ever need another shop.
- The content script redirect on non-US domains has a loop guard of 3 redirects per tab.
