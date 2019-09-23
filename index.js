const fs = require("fs-extra");
const globby = require("globby");
const concat = require("concat");
const CleanCSS = require("clean-css");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const UglifyJS = require("uglify-es");

module.exports.minifier = function(para) {
  let cssPath, jsPath, ignorePaths, prefixEnabled, destinationPath, inter;
  prefixEnabled = false;
  if (para.destination) {
    destinationPath = para.destination;
    console.log(
      "\x1b[32m%s\x1b[0m",
      "Creating your destination file " + destinationPath
    );
  } else {
    destinationPath = "minified";
  }
  const cssFile = destinationPath + "/css";
  const jsFile = destinationPath + "/js";
  //ignoring prettier to modify content of destination
  fs.outputFile(".prettierignore", "/" + destinationPath, function(err) {
    //  Catch
  });
  try {
    //Create new Src directory if not created
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath);
    }
    if (fs.existsSync(destinationPath)) {
      //Creating new css folder inside src directory
      fs.mkdirSync(cssFile, function(err) {
        console.log("\u001b[33m", err);
      });
      //Creating new js folder inside src directory
      fs.mkdirSync(jsFile, function(err) {
        console.log("\u001b[33m", err);
      });
    }
  } catch (e) {
    console.log("\u001b[33m", e.message);
  }
  if (para.cssSource) {
    cssPath = para.cssSource;
  }

  if (para.jsSource) {
    jsPath = para.jsSource;
  }
  if (para.ignorePath) {
    ignorePaths = ignorePath;
  }
  if (para.destination) {
    destinationPath = para.destination;
  }
  //Only css minification
  if (cssPath && !para.prefixEnabled && !jsPath) {
    console.log(
      "\u001b[34m",
      "Minifying your css in " + destinationPath + "with disbaled prefix" + ""
    );
    inter = setInterval(() => {
      console.log("\u001b[34m", "Minifying your css files....");
    }, 10);
    globby([cssPath + "/*.css", "!node_modules"]).then(paths => {
      concat(paths).then(result => {
        fs.outputFile(cssFile + "/style.css", result);
        new CleanCSS({ returnPromise: true, inline: ["remote"] })
          .minify(result)
          .then(function(output) {
            fs.outputFile(cssFile + "/style.min.css", output.styles);
            expect(output.styles).toEqual(output.styles);
          })
          .catch(function(error) {});
        // console.log("done");
        clearInterval(inter);
        console.log(
          "\x1b[32m%s\x1b[0m",
          "Your all files has been concatenated and minfied \nHappy Hacking"
        );
      });
    });
  }
  //Only js Minification
  if (jsPath && !cssPath) {
    console.log("\u001b[34m", "Minifying your js in " + destinationPath + "");
    inter = setInterval(() => {
      console.log("\u001b[34m", "Minifying your js files....");
    }, 10);
    globby([jsFile + "/*.js", "!node_modules"]).then(paths => {
      concat(paths).then(result => {
        fs.outputFile(jsFile + "/script.js", result);
        var minfifiedJs = UglifyJS.minify(result);
        fs.outputFile(jsFile + "/script.min.js", minfifiedJs.code);
      });
    });
    clearInterval(inter);
    console.log(
      "\x1b[32m%s\x1b[0m",
      "Your all files has been concatenated and minfied \nHappy Hacking"
    );
  }

  //CSS with Prefixed value
  if (cssPath && para.prefixEnabled) {
    console.log(
      "\u001b[34m",
      "Minifying your css in " + destinationPath + "with enabled prefix" + ""
    );
    inter = setInterval(() => {
      console.log("\u001b[34m", "Minifying your js files....");
    }, 10);
    globby([cssPath + "/*.css", "!node_modules"]).then(paths => {
      concat(paths)
        .then(results => {
          postcss([autoprefixer])
            .process(results)
            .then(result => {
              result.warnings().forEach(warn => {
                console.warn(warn.toString());
              });
              console.log(result);
              fs.outputFile(cssFile + "/style.css", result.css);
              var minifedCSS = new CleanCSS().minify(result.css);
              fs.outputFile(cssFile + "/style.min.css", minifedCSS.styles);
              clearInterval(inter);
              console.log(
                "\x1b[32m%s\x1b[0m",
                "Your all files has been concatenated , minified and added prefixes \nHappy Hacking "
              );
            });
        })
        .catch();
    });
  } else if (jsPath && cssPath && para.prefixEnabled) {
    console.log(
      "\u001b[34m",
      "Minifying your css and js in " +
        destinationPath +
        "with enabled prefix" +
        ""
    );
    globby([cssPath + "/*.css", "!node_modules"]).then(paths => {
      concat(paths).then(result => {
        postcss([autoprefixer])
          .process(result, { map: { inline: false } })
          .then(preFixed => {
            preFixed.warnings().forEach(warn => {
              console.warn(warn.toString());
            });
            fs.outputFile(cssFile + "/style.css", preFixed.css);
            var minifedCSS = new CleanCSS().minify(preFixed.css);
            fs.outputFile(cssFile + "/style.min.css", minifedCSS.styles);
          });
      });
    });
    globby([jsPath + "/*.js", "!node_modules"]).then(paths => {
      concat(paths).then(result => {
        fs.outputFile(jsFile + "/script.js", result);
        var minfifiedJs = UglifyJS.minify(result);
        fs.outputFile(jsFile + "/script.min.js", minfifiedJs.code);
      });
    });
  } else if (jsPath && cssPath && !para.prefixEnabled) {
    console.log(
      "\u001b[34m",
      "Minifying your css and js in " +
        destinationPath +
        "with  disabled prefix" +
        ""
    );
    globby([cssPath + "/*.css", "!node_modules"]).then(paths => {
      concat(paths).then(result => {
        fs.outputFile(cssFile + "/style.css", result);
        new CleanCSS({ returnPromise: true, inline: ["remote"] })
          .minify(result)
          .then(function(output) {
            fs.outputFile(cssFile + "/style.min.css", output.styles);
            expect(output.styles).toEqual(output.styles);
          });
      });
    });
  }
  globby([jsPath + "/*.js", "!node_modules"]).then(paths => {
    concat(paths).then(result => {
      fs.outputFile(jsFile + "/script.js", result);
      var minfifiedJs = UglifyJS.minify(result);
      fs.outputFile(jsFile + "/script.min.js", minfifiedJs.code);
    });
  });
  return 1;
};
