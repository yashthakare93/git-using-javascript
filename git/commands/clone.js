const simpleGit = require('simple-git');
const fs = require('fs');

class CloneCommand {
    constructor(remoteUrl, destinationDir) {
        this.remoteUrl = remoteUrl;
        this.destinationDir = destinationDir;
        this.git = simpleGit();
    }

    async execute() {
        console.log(`Cloning repository from ${this.remoteUrl} to ${this.destinationDir}`);

        // Step 1: Create the destination directory if it doesn't exist
        if (!fs.existsSync(this.destinationDir)) {
            fs.mkdirSync(this.destinationDir, { recursive: true });
            console.log(`Created repository directory at ${this.destinationDir}`);
        }

        try {
            // Step 2: Clone the repository using simple-git
            await this.git.clone(this.remoteUrl, this.destinationDir);
            console.log('Repository cloned successfully.');
        } catch (error) {
            console.error('Error cloning repository:', error);
        }
    }
}

module.exports = CloneCommand;
