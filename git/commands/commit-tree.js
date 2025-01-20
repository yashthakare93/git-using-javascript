const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

class CommitTreeCommand {
    constructor(tree, parent, commitMessage) {
        this.treeSHA = tree;
        this.parentSHA = parent;
        this.message = commitMessage;
    }

    execute() {
        const commitContent = [
            `tree ${this.treeSHA}`,
            this.parentSHA ? `parent ${this.parentSHA}` : '',
            `author Yash Thakare <thakareyash74@gmail.com> ${Date.now()} +0000`,
            `committer Yash Thakare <thakareyash74@gmail.com> ${Date.now()} +0000`,
            '',
            this.message
        ].filter(Boolean).join('\n');

        const commitContentBuffer = Buffer.from(commitContent);
        const commitSize = commitContentBuffer.length;

        const header = `commit ${commitSize}\n`;
        const data = Buffer.concat([Buffer.from(header), commitContentBuffer]);

        const hash = crypto.createHash('sha1').update(data).digest('hex');

        const folder = hash.slice(0, 2);
        const file = hash.slice(2);

        const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);
        if (!fs.existsSync(completeFolderPath)) {
            fs.mkdirSync(completeFolderPath);
        }

        const compressedData = zlib.deflateSync(data);

        const filePath = path.join(completeFolderPath, file);
        fs.writeFileSync(filePath, compressedData);

        process.stdout.write(hash); 
    }
}

module.exports = CommitTreeCommand;
