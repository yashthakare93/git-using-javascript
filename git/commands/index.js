const CatFileCommand = require('./cat-file');
const HashObjectCommand = require('./hash-object');
const LsTreeCommand = require('./ls-tree');
const WriteTreeCommand = require('./write-tree');
const CommitTreeCommand = require('./commit-tree');
const CloneCommand = require('./clone');

module.exports = {
    CatFileCommand,
    HashObjectCommand,
    LsTreeCommand,
    WriteTreeCommand,
    CommitTreeCommand,
    CloneCommand,
}