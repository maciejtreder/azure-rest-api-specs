"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simple_git_1 = require("simple-git");
const child_process_1 = require("child_process");
async function runCmd(cmd) {
    console.log(`run command:${cmd}`);
    const { err, stdout, stderr } = await new Promise((res) => (0, child_process_1.exec)(cmd, { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 }, (err, stdout, stderr) => res({ err: err, stdout: stdout, stderr: stderr })));
    let resultString = stderr + stdout;
    console.log("Stdout output:");
    console.log(stdout);
    if (stderr) {
        console.log("Stderr output:");
        console.log(stderr);
    }
    if (stderr || err) {
        throw new Error(err);
    }
    return resultString;
}
async function main() {
    const args = process.argv.slice(2);
    const folder = args[0];
    console.log("Running TypeSpecValidation on folder:", folder);
    const output = await runCmd(`npx tsp compile ${folder}`);
    const git = (0, simple_git_1.simpleGit)();
    let gitStatusIsClean = await (await git.status(['--porcelain'])).isClean();
    if (!gitStatusIsClean) {
        let gitStatus = await git.status();
        let gitDiff = await git.diff();
        console.log("git status");
        console.log(gitStatus);
        console.log("git diff");
        console.log(gitDiff);
        throw new Error("Generated swagger file does not match swagger file on disk");
    }
}
main();
