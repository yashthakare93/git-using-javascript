const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

class LsTreeCommand {
    constructor(flag, sha) {
        this.flag = flag;
        this.sha = sha;
    }

    execute() {
        const flag = this.flag;
        const sha = this.sha;

        // Determine paths for the Git object
        const folder = sha.slice(0, 2);
        const file = sha.slice(2);
        const folderPath = path.join(process.cwd(), ".git", "objects", folder);
        const filePath = path.join(folderPath, file);

        // Validate existence of Git object
        if (!fs.existsSync(folderPath) || !fs.existsSync(filePath)) {
            throw new Error(`Not a valid object name ${sha}`);
        }

        // Read and decompress the object file
        const fileContent = fs.readFileSync(filePath);
        const outputBuffer = zlib.inflateSync(fileContent);
        const output = outputBuffer.toString("binary"); // Use binary string

        // Validate the object type
        const nullByteIndex = output.indexOf('\0');
        const header = output.slice(0, nullByteIndex);
        if (!header.startsWith("tree")) {
            throw new Error(`Object ${sha} is not a tree.`);
        }

        // Extract tree entries
        const treeContent = output.slice(nullByteIndex + 1);
        const entries = [];
        let offset = 0;

        while (offset < treeContent.length) {
            // Extract mode (space-separated)
            const modeEnd = treeContent.indexOf(' ', offset);
            const mode = treeContent.slice(offset, modeEnd);
            offset = modeEnd + 1;

            // Extract filename (null-terminated)
            const nameEnd = treeContent.indexOf('\0', offset);
            const name = treeContent.slice(offset, nameEnd);
            offset = nameEnd + 1;

            // Extract SHA (20 bytes)
            const shaBytes = treeContent.slice(offset, offset + 20);
            const objectSha = Buffer.from(shaBytes, "binary").toString("hex");
            offset += 20;

            // Determine type based on mode
            const type = mode === "40000" ? "tree" : "blob";
            entries.push({ mode, type, objectSha, name });
        }

        // Print output based on flag
        if (flag === '--name-only') {
            entries.forEach(({ name }) => process.stdout.write(`${name}\n`));
        } else {
            entries.forEach(({ mode, type, objectSha, name }) => {
                process.stdout.write(`${mode} ${type} ${objectSha}\t${name}\n`);
            });
        }
    }
}

module.exports = LsTreeCommand;
