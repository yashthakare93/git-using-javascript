const fs = require('fs');
const path = require('path');
const GitClient = require('./git/client');

const gitClient = new GitClient();
const { CatFileCommand, HashObjectCommand, LsTreeCommand, WriteTreeCommand, CommitTreeCommand, CloneCommand } = require('./git/commands');

const command = process.argv[2];

switch (command) {
    case "init":
        createGitDirectory();
        break;
    case "cat-file":
        handleCatFileCommand();
        break;
    case "hash-object":
        handleHashObjectCommand();
        break;
    case "ls-tree":
        handleLsTreeCommand();
        break;
    case "write-tree":
        handleWriteTreeCommand();
        break;
    case "commit-tree":
        handleCommitTreeCommand();
        break;
    case "clone":
        handleCloneCommand();
        break;
    default:
        throw new Error(`Unknown command ${command}`);
}


function createGitDirectory(repoPath = process.cwd()) {
    const gitDir = path.join(repoPath, '.git');
    fs.mkdirSync(gitDir, { recursive: true });
    fs.mkdirSync(path.join(gitDir, 'objects'), { recursive: true });
    fs.mkdirSync(path.join(gitDir, 'refs'), { recursive: true });

    fs.writeFileSync(path.join(gitDir, 'HEAD'), 'ref: refs/heads/main\n');
    console.log(`Initialized git directory at ${gitDir}`);
}

function handleCatFileCommand() {
    const flag = process.argv[3];
    const commitSHA = process.argv[4];

    const command = new CatFileCommand(flag, commitSHA);
    gitClient.run(command);
}

function handleHashObjectCommand() {
    let flag = process.argv[3];
    let filepath = process.argv[4];

    if (!filepath) {
        filepath = flag;
        flag = null;
    }

    const command = new HashObjectCommand(flag, filepath);
    gitClient.run(command);
}

function handleLsTreeCommand() {
    let flag = process.argv[3];
    let sha = process.argv[4];

    if(!sha && flag === '--name-only') return;

    if(!sha) {
        sha = flag;
        flag = null;
    }

    const command = new LsTreeCommand(flag, sha);
    gitClient.run(command);
}

function handleWriteTreeCommand() {
    const command = new WriteTreeCommand();
    gitClient.run(command);
}

function handleCommitTreeCommand() {
    const tree = process.argv[3];
    const commitSHA = process.argv[5];
    const commitMessage = process.argv[7];

    const command = new CommitTreeCommand(tree, commitSHA, commitMessage);
    gitClient.run(command);
}

function handleCloneCommand() {
    const remoteUrl = process.argv[3];
    const destinationDir = process.argv[4];

    if (!remoteUrl || !destinationDir) {
        console.error("Usage: clone <remote-url> <destination-directory>");
        return;
    }

    const repoPath = path.join(process.cwd(), destinationDir); 

    if (!fs.existsSync(repoPath)) {
        fs.mkdirSync(repoPath, { recursive: true });
        console.log(`Created repository directory at ${repoPath}`);
    }


    // Clone the repository and fetch objects and refs
    const command = new CloneCommand(remoteUrl, repoPath);
    gitClient.run(command);
}
