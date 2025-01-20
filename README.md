## Implemented Git Functionality Using JavaScript
This project is a custom implementation of Git functionality, providing a set of core Git operations using Node.js. It enables performing essential Git operations such as initializing a Git repository, managing Git objects (commit, tree, blob), staging and committing files, and cloning remote repositories directly from the command line.


## Features

- **Git Directory Initialization** (`init`): Creates a basic `.git` directory structure with necessary subdirectories and a default `HEAD` file pointing to the `main` branch.
  
- **Cat File** (`cat-file`): Retrieve information about objects (like commits) stored in the Git repository using their SHA hash.
  
- **Hash Object** (`hash-object`): Hash files and store them as Git objects.
  
- **List Tree** (`ls-tree`): List the contents of a commit or tree object, showing files and directories.
  
- **Write Tree** (`write-tree`): Write the current state of the staged files to a new tree object.
  
- **Commit Tree** (`commit-tree`): Create a new commit object from a tree object, parent commit SHA, and a commit message.

- **Clone Repository** (`clone`): Clone a repository from a remote URL to a local directory.

## Usage
After installation, you can use the various Git functionalities by running commands in your terminal. Here are some examples:

## Usage

After installation, you can use the various Git functionalities by running commands in your terminal. Here are some examples:

- **Initialize a Git Repository**:

    ```bash
    gitjs init
    ```

- **Hash a File**:

    ```bash
    gitjs hash-object <file-path>
    ```

- **Clone a Remote Repository**:

    ```bash
    gitjs clone <repository-url> <directory>
    ```

- **Commit a Tree**:

    ```bash
    gitjs commit-tree <tree_sha> -p <commit_sha> -m "<message>"
    ```

- **Write a Tree**:

    ```bash
    gitjs write-tree <sha>
    ```

- **List Tree with `--name-only`**:

    ```bash
    gitjs ls-tree --name-only <sha>
    ```

- **Hash a File and Store It**:

    ```bash
    gitjs hash-object -w <filepath>
    ```

- **View Git Object Information**:

    ```bash
    gitjs cat-file -p <commitSHA>
    ```

  
