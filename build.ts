import chokidar from "chokidar";
import fs from "fs";
import esbuild from "esbuild";
import glob from "glob";

const log = console.log.bind(console);

// function walkDir(dir, callback) {
//   fs.readdirSync(dir).forEach((f) => {
//     let dirPath = path.join(dir, f);
//     let isDirectory = fs.statSync(dirPath).isDirectory();
//     isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
//   });
// }

function clean() {
  const start = Date.now();

  glob
    .sync("scripts/**/*.{js,js.map,jsx,jsx.map}")
    .forEach((filePath) => fs.rmSync(filePath));

  log(`[${Date.now() - start}ms] clear`);
}

function build(
  infile: string,
  outfile: string,
  bundle: boolean,
  sourcemap: boolean
) {
  const start = Date.now();

  try {
    esbuild.buildSync({
      entryPoints: [infile],
      outfile,
      target: "esnext",
      format: "esm",
      tsconfig: "tsconfig.json",
      sourcemap,
      bundle,
    });

    log(`[${Date.now() - start}ms] ${infile} ==(build)==> ${outfile}`);
  } catch (error) {
    log(error);
  }
}

function isBundle(path: string): boolean {
  return /^scripts\/bundles/.test(path);
}

function onAdded(path: string) {
  // log(`File ${path} has been added`);
  let infile = path;
  let outfile = path.replace(".ts", ".js");
  let bundle = isBundle(path);
  let sourcemap = !bundle;
  build(infile, outfile, bundle, sourcemap);
}

function onChanged(path: string) {
  // log(`File ${path} has been changed`);
  let infile = path;
  let outfile = path.replace(".ts", ".js");
  let bundle = isBundle(path);
  let sourcemap = !bundle;
  build(infile, outfile, bundle, sourcemap);
}

function onRemoved(path: string) {
  // log(`File ${path} has been removed`);
  let removeFile = path.replace(".ts", ".js");
  let removeMap = removeFile + ".map";

  const start = Date.now();

  try {
    fs.rmSync(removeFile);
    fs.rmSync(removeMap);

    log(`[${Date.now() - start}ms] ${path} ==(remove)==> X`);
  } catch (error) {
    log(error);
  }
}

function watch() {
  log(">> watching <<");
  const watcher = chokidar.watch("scripts", {
    ignored: /((^|[\/\\])\..)|(\.jsx?(.map)?$)|(\.d.ts$)/,
    persistent: true,
  });
  watcher.on("add", onAdded).on("change", onChanged).on("unlink", onRemoved);
}

clean();
watch();
