### Table of contents

- [Features](#features)
- [Comparison to other extensions](#comparison-to-other-extensions)
- [Installation](#installation)
  - [Firefox](#firefox)
  - [Chromium](#chromium)
  - [Building from the source code](#building-from-the-source-code)

# Features

- Redirects shorts to the regular video player.
  The shorts player has basically no video controls and is vastly inferior to the regular one.
- Removes the "Shorts" section from the homepage.
  This doesn't remove other links to shorts, such as the channel "Shorts" tab or the shorts button in the sidebar.
  I don't think these are very intrusive and don't need to be removed.

By default, both of these are enabled, but you can turn either one off in the options page.
To open it, go to:

1. `about:addons`
2. "No YouTube Shorts"
3. "Options" (next to the "Details" and "Permissions" tabs).

# Comparison to other extensions

There are some extensions that do this out there (e.g. [YouTube Shorts Redirect](https://github.com/huantianad/youtube-shorts-redirect)), but they use unreliable methods of redirecting.
The example I mentioned inserts a script into YouTube, checks if the URL is a short, and redirects if it is.
It also subscribes to a YouTube navigation event. This has several issues:

- It's very inefficient because the script is inserted relatively late into loading, which means
that you will see and your computer will load the shorts page, but before the video is played, the script redirects it.
- It inserts a script to YouTube regardless of whether it's a short.
- The name of the event it subscribes to may change, thus breaking it.

No YouTube Shorts works in the browser, where it intercepts all `youtube.com/shorts` URLs before *anything* is loaded,
rather than inserting a script into the page. This is the best way to do it.

# Installation

## Firefox

Get it from the [add-on store](https://addons.mozilla.org/en-US/firefox/addon/no-youtube-shorts/).

## Chromium

Not yet ported.

## Building from the source code

Clone the repo and run the [`build.sh`](https://github.com/tigerros/no-youtube-shorts/blob/master/build.sh) file.
However, it uses binaries which it doesn't install automatically, so you need to install them yourself.
They are listed in the file. You will also need to install the NPM packages listed in [`package.json`](https://github.com/tigerros/no-youtube-shorts/blob/master/package.json).