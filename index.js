const fs = require("fs-extra");
const globby = require("globby");
const concat = require("concat");
const CleanCSS = require("clean-css");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const UglifyJS = require("uglify-es");

const minifier = function(para) {
  let cssPath, jsPath, ignorePaths, prefixEnabled, destinationPath, inter;
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
  if (cssPath && !para.prefixEnabled) {
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

  if (jsPath) {
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
  if (cssPath && para.prefixEnabled) {
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
  }
};

minifier({
  cssSource: "css/",
  jsSource: "js/",
  destination: "myNew",
  prefixEnabled: true
});
