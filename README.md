#Minify-Project

[![NPM version (1.0.0)](https://img.shields.io/npm/v/minify-project?style=for-the-badge)](https://www.npmjs.com/package/minify-project)

_minify css with autoprefixing and js of whole project tree_

## Installation

To install `minify-project`, you need [node.js](http://nodejs.org/) and [npm](https://github.com/npm/npm#super-easy-install). :rocket:

Once you have that set-up, just run `npm install --save minify-project` in your project directory. :ship:

You're now ready to use minify your whole project! Awesome! :metal:

## Usage

```javascript
var minify = require("minify-project");
```

#### minify css of certain folder

```
minify.minifier({ cssSource: "./css" });
```

#### minify and autoprefix css of certain folder

```
minify.minifier({ cssSource: "./css" , prefixEnabled: true });
```

#### minify js of certain folder along with css

```
minify.minifier({cssSource : "/css" ,jsSource: "/js" });
```

#### minify and store at your desire location

```
minify.minifier({cssSource : "/css" ,jsSource: "/js" , destination:"myDestination" });
```
