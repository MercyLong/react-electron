/*
 * @Author: Jacky.LiangXiang
 * @Date: 2019-01-24 20:26:58
 * @Last Modified by: Jacky.LiangXiang
 * @Last Modified time: 2019-01-24 22:21:18
 */

const { say } = require("cfonts");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const electron = require("electron");
const { spawn } = require("child_process");
const mainWebpackConfig = require("../config/webpack.main.config");
say("Hello World", {
  colors: ["yellow"],
  font: "simple",
  space: false
});

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;

function logStats(proc, data) {
  let log = "";

  log += chalk.yellow.bold(
    `┏ ${proc} Process ${new Array(19 - proc.length + 1).join("-")}`
  );
  log += "\n\n";

  if (typeof data === "object") {
    data
      .toString({
        colors: true,
        chunks: false
      })
      .split(/\r?\n/)
      .forEach(line => {
        log += "  " + line + "\n";
      });
  } else {
    log += `  ${data}\n`;
  }

  log += "\n" + chalk.yellow.bold(`┗ ${new Array(28 + 1).join("-")}`) + "\n";

  console.log(log);
}
// BootStrap The Main Process (Node Process)
function StartMainProcess() {
  return new Promise((resolve, reject) => {
    mainWebpackConfig.entry.main = [
      path.join(__dirname, "../src/main/index.dev.js")
    ].concat(mainWebpackConfig.entry.main);
    mainWebpackConfig.mode = "development";
    const compiler = webpack(mainWebpackConfig);
    compiler.hooks.watchRun.tapAsync("watch-run", (compilation, done) => {
      // hotMiddleware.publish({
      //   action: "compiling"
      // });
      done();
    });
    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }
      logStats("Main", stats);
      // reload the application when main process files changed
      if (electronProcess && electronProcess.kill) {
        manualRestart = true;
        process.kill(electronProcess.pid);
        electronProcess = null;
        // startElectron();
        setTimeout(() => {
          manualRestart = false;
        }, 5000);
      }
      resolve();
    });
  });
}

function StartElectron() {
  var args = [
    "--inspect=5858",
    path.join(__dirname, "../dist/electron/main.js")
  ];

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith("yarn.js")) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith("npm-cli.js")) {
    args = args.concat(process.argv.slice(2));
  }
  electronProcess = spawn(electron, args);

  electronProcess.stdout.on("data", data => {
    console.log(data);
  });
  electronProcess.stderr.on("data", data => {
    console.log(data);
  });

  electronProcess.on("close", () => {
    if (!manualRestart) process.exit();
  });
}

function BootStrap() {
  Promise.all([StartMainProcess()]).then(() => {
    // StartElectron();
    console.log("SUCCEDDD");
  });
}
try {
  BootStrap();
} catch (err) {
  console.log(err);
}
