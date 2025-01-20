const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');

function writeFileBlob(currentPath) {
    try {
        // Read file content and determine its length
        const contents = fs.readFileSync(currentPath);
        const length = contents.length;

        // Create blob header and combine with file content
        const header = `blob ${length}\0`;
        const blob = Buffer.concat([Buffer.from(header), contents]);

        const hash = crypto.createHash('sha1').update(blob).digest('hex');

        const folder = hash.slice(0, 2);
        const file = hash.slice(2);

        const completeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);
        if (!fs.existsSync(completeFolderPath)) {
            fs.mkdirSync(completeFolderPath, { recursive: true });
        }

        // Compress and write the blob to the objects directory
        const compressedData = zlib.deflateSync(blob);

        const filePath = path.join(completeFolderPath, file);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, compressedData);
        }

        return hash;
    } catch (error) {
        console.error(`Error writing blob for ${currentPath}:`, error.message);
        throw error;
    }
}

class WriteTreeCommand {
    constructor() { }

    //Traverses directories, creates blobs for files, and trees for directories.

    execute() {
        const recursiveCreateTree = (basePath) => {
            try {
                // Read the contents of the directory
                const dirContents = fs.readdirSync(basePath);
                const result = [];

                for (const dirContent of dirContents) {
                    if (dirContent === '.git') continue;

                    const currentPath = path.join(basePath, dirContent);
                    const stat = fs.statSync(currentPath);

                    if (stat.isDirectory()) {
                        // Recurse into subdirectories and create a tree
                        const sha = recursiveCreateTree(currentPath);
                        if (sha) {
                            result.push({
                                mode: '40000', // Mode for directories
                                basename: path.basename(currentPath),
                                sha,
                            });
                        }
                    } else if (stat.isFile()) {
                        // Create a blob for the file
                        const sha = writeFileBlob(currentPath);
                        result.push({
                            mode: '100644', // Mode for files
                            basename: path.basename(currentPath),
                            sha,
                        });
                    }
                }

                if (result.length === 0) return null;

                // Create the tree object content
                const treeContent = result.reduce((acc, { mode, basename, sha }) => {
                    return Buffer.concat([
                        acc,
                        Buffer.from(`${mode} ${basename}\0`), // Metadata
                        Buffer.from(sha, 'hex'), // Hash
                    ]);
                }, Buffer.alloc(0));

                const tree = Buffer.concat([
                    Buffer.from(`tree ${treeContent.length}\0`),
                    treeContent,
                ]);

                const hash = crypto.createHash('sha1').update(tree).digest('hex');
                const folder = hash.slice(0, 2);
                const file = hash.slice(2);

                // Save the tree object in .git/objects
                const treeFolderPath = path.join(process.cwd(), '.git', 'objects', folder);
                if (!fs.existsSync(treeFolderPath)) {
                    fs.mkdirSync(treeFolderPath, { recursive: true });
                }

                const compressed = zlib.deflateSync(tree);
                const treeFilePath = path.join(treeFolderPath, file);

                if (!fs.existsSync(treeFilePath)) {
                    fs.writeFileSync(treeFilePath, compressed);
                }

                return hash;
            } catch (error) {
                console.error(`Error creating tree for ${basePath}:`, error.message);
                throw error;
            }
        };

        // Start tree creation from the current working directory
        const sha = recursiveCreateTree(process.cwd());
        if (sha) {
            process.stdout.write(`${sha}\n`);
        } else {
            console.error('No valid tree could be created.');
        }
    }
}

module.exports = WriteTreeCommand;
