
import fs from 'fs'
import readline from 'readline'


function readlines(filePath, lineFunc, finishFunc) {
    let input = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: input
    });

    rl.on('line', (line) => {
        if (lineFunc) {
            lineFunc(line);
        } else {
            console.log(`read line: ${line}`);
        }
    });
    rl.on('close', () => {
        if (finishFunc) {
            finishFunc();
        } else {
            console.log("read finished");
        }
    });
}

function process(filePath) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        if (data.length > 0) {
            let newLines = [];
            let content = data.toString().replace(/\x08/g, '');// remove special char \x08
            let
                lines = content.split('\n'),
                line = null,
                x = null,
                lang = null,
                comment = null;
            for (let i = 0; i < lines.length; i++) {
                line = lines[i];

                if (line && line.length > 0) {
                    x = parseLine(line);
                    if (x.length > 0) {
                        [comment, lang] = x;
                        if (comment === 'Command Line') {
                            lang = 'bash';
                        }

                        newLines.push(`\`\`\`${lang}`);
                        // different comment
                        if (lang === 'javascript') {
                            newLines.push(`// ${comment}`);
                        } else {
                            newLines.push(`# ${comment}`)
                        }
                        // special process
                        if (i < lines.length && lines[i + 1] === '') {
                            console.log(`remove wrong blank line line [${i+2}] @${filePath}`);
                            i++;
                        }
                        i++;
                    } else {
                        if (line === '~~~~~~~~') {
                            newLines.push('```');
                        } else if (line === '{pagebreak}') {
                            newLines.push('');
                            i++;
                        } else if (line === '# leanpub-start-insert' || line === '# leanpub-end-insert') {
                            // do nothing
                        } else {
                            newLines.push(line);
                        }
                    }
                } else {
                    newLines.push(line);
                }
            }

            save(filePath, newLines);
        }
    });
}

const reg = /{title="(.+)",lang="?(\w+)"?}/g;
function parseLine(input) {
    var result = [],
        m;
    while ((m = reg.exec(input))) {
        if (m.index === m.lastIndex) {
            m.lastIndex++;
        }
        result.push(m[1]);
        result.push(m[2])
    }
    return result;
}

function save(filePath, lines) {
    fs.writeFile(filePath, lines.join('\n'), (err) => {
        if (err) throw err;
        console.log(`${filePath} saved!`);
    });
}


// process('./manuscript/foreword-cn.md');
process('./manuscript/chapter4-cn.md');

// readlines('./pages', function (line) {
//     if (line && line.length > 0) {
//         process(line);
//     }
// }, function () {
//     console.log('------------------------');
//     console.log('done');
// });
