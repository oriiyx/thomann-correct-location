# Thomann → Slovenia

Browser extension (Chrome and Firefox) that forces every Thomann link to open in the **Slovenia (en-si)** shop.

## How it works

Thomann encodes the country in the URL: `https://www.thomannmusic.com/en-si/<page>` is the Slovenia shop,
the same page without the prefix is the US shop, and other countries live on their own domains (thomann.de, thomann.co.uk, ...).

- **thomannmusic.com** (US or any other `xx-yy` prefix): a `declarativeNetRequest` rule rewrites the URL to `/en-si/...`
  at the network level, before the page loads. No flash of the US page.
- **Other Thomann domains** (thomann.de, thomann.co.uk, ...): a content script reads the page's `en-US` hreflang link
  (or the product path, which is identical on every country site) and jumps to its `/en-si/` version.

The same `extension/` folder and `manifest.json` (Manifest V3) work in both browsers.

## Install in Chrome (unpacked)

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `extension/` folder

Chrome keeps it installed across restarts. If you edit files, click the reload icon on the extension card.
Chrome may warn about an unrecognized `browser_specific_settings` key; that key is for Firefox and the warning is harmless.

## Install in Firefox

### Quick test (temporary, gone after Firefox restarts)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…** and select `extension/manifest.json`
3. Open `about:addons`, click the extension, open the **Permissions** tab and make sure access to the Thomann sites is **on**.
   Firefox treats site access as optional for Manifest V3 extensions, and the extension can't redirect anything without it.

Alternatively, with Node installed, run `npx web-ext run --source-dir extension` from the repo root; it launches a fresh
Firefox profile with the extension loaded and reloads it whenever you edit a file.

### Permanent install

Firefox only keeps extensions that are signed by Mozilla. Either:

- **Sign it (free, unlisted):** create an account at https://addons.mozilla.org, get API credentials under
  *Tools → Manage API Keys*, then run
  `npx web-ext sign --source-dir extension --channel unlisted --api-key <key> --api-secret <secret>`.
  Install the resulting `.xpi` from `web-ext-artifacts/` by opening it in Firefox (drag & drop onto a tab works).
  The install prompt asks for access to the Thomann sites; accept it.
- **Or use Firefox Developer Edition / Nightly:** set `xpinstall.signatures.required` to `false` in `about:config`,
  build an unsigned package with `npx web-ext build --source-dir extension` and install the `.zip` via
  `about:addons` → gear icon → **Install Add-on From File…**. Release Firefox ignores that preference.

Minimum Firefox version is 140.

## Change the country

Edit `en-si` in `extension/rules.json` (two places) and `extension/redirect.js` (`TARGET`). Reload the extension.

## Caveats

- Thomann's own country selector will be overridden: if you pick another country, the extension sends you back to Slovenia.
  Disable the extension temporarily if you ever need another shop.
- The content script redirect on non-US domains has a loop guard of 3 redirects per tab.
- In Firefox, if the extension suddenly stops redirecting, check the **Permissions** tab in `about:addons`: site access
  may have been revoked.
