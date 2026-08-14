const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const excludeDirs = ['.git', 'node_modules', 'target', '.gemini', 'dist', 'data'];

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (excludeDirs.includes(file)) continue;

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            replaceInFiles(fullPath);
        } else {
            // Exclude binaries like images
            if (fullPath.endsWith('.png') || fullPath.endsWith('.jpg') || fullPath.endsWith('.jar') || fullPath.endsWith('.db') || fullPath.endsWith('.ico')) continue;

            const content = fs.readFileSync(fullPath, 'utf8');
            const newContent = content
                .replace(/loopdeck/g, 'loopdeck')
                .replace(/LoopDeck/g, 'LoopDeck');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated content: ${fullPath}`);
            }
        }
    }
}

replaceInFiles(rootDir);

// Rename directories
const mainJavaDir = path.join(rootDir, 'backend', 'src', 'main', 'java', 'com');
if (fs.existsSync(path.join(mainJavaDir, 'loopdeck'))) {
    fs.renameSync(path.join(mainJavaDir, 'loopdeck'), path.join(mainJavaDir, 'loopdeck'));
    console.log('Renamed main/java/com/loopdeck -> loopdeck');
}

const testJavaDir = path.join(rootDir, 'backend', 'src', 'test', 'java', 'com');
if (fs.existsSync(path.join(testJavaDir, 'loopdeck'))) {
    fs.renameSync(path.join(testJavaDir, 'loopdeck'), path.join(testJavaDir, 'loopdeck'));
    console.log('Renamed test/java/com/loopdeck -> loopdeck');
}

// Rename files
const publicDir = path.join(rootDir, 'public');
if (fs.existsSync(publicDir)) {
    ['loopdeck-icon-192.png', 'loopdeck-icon-512.png'].forEach(icon => {
        const oldPath = path.join(publicDir, icon);
        if (fs.existsSync(oldPath)) {
            const newPath = path.join(publicDir, icon.replace('loopdeck', 'loopdeck'));
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed icon: ${icon} -> ${path.basename(newPath)}`);
        }
    });
}
