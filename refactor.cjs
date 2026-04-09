const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules') return;
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Background color swaps
    content = content.replace(/bg-dark-900/g, 'bg-light-100');
    content = content.replace(/bg-dark-800/g, 'bg-light-200');
    content = content.replace(/bg-dark-700/g, 'bg-light-300');

    // Border swaps
    content = content.replace(/border-white\/([0-9]+)/g, 'border-dark-900/$1');
    content = content.replace(/border-white/g, 'border-dark-900/20');

    // Text swaps
    content = content.replace(/text-white\/([0-9]+)/g, 'text-dark-900/$1');
    content = content.replace(/text-white/g, 'text-dark-900');

    // Specific hover/bg swaps
    content = content.replace(/bg-white\/([0-9]+)/g, 'bg-dark-900/$1');
    content = content.replace(/white\/([0-9]+)/g, 'dark-900/$1');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Refactored: ${file}`);
    }
});
