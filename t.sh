#!/bin/bash

# Search in the Documents directory of the current user's home directory
search_dir="${HOME}/Documents"

# Find all .git directories and print the path
find "$search_dir" -name ".git" -type d -prune | while read git_dir; do
    repo_dir=$(dirname "$git_dir")
    echo "Repository found: $repo_dir"
done
