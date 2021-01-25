'use strict';
const Excel = require('exceljs');
const { exec } = require('child_process');
var chokidar = require('chokidar');
const fse = require('fs-extra');
const http = require('http');
const paths = require('./paths');

const inputFolder = paths.inputDirectory
const outputFolder = paths.outputDirectory
const template = 'node_modules/jsonresume-theme-kendall'
let workbook = new Excel.Workbook()
let worksheet = workbook.addWorksheet('Debtors')

// Init excel file
initExcelFile();

// LISTENING to dir
chokidar.watch('.')
    .on('add', function (path) {
        if (path.startsWith(`${inputFolder}/`)) {
            let file = path.slice(inputFolder.length + 1)
            let fileName = file.slice(0, file.lastIndexOf('.'))

            exec(`hackmyresume build ./${inputFolder}/${file} TO ${outputFolder}/${fileName}.pdf -t ${template}`, (err, stdout, stderr) => {

                if (err) {
                    console.error(`An error occurred: ${err.message}`);
                    return;
                }
                else {
                    // Move PDF to out/pdf
                    fse.move(`${outputFolder}/${fileName}.pdf`, `${outputFolder}/pdf/${fileName}.pdf`, err => {
                        if (!err) {
                            writeInExcel(file, 'OK');
                        }
                        if (err) {
                            // IF error occured: MOVE TO duplicated/pdf
                            fse.move(`${outputFolder}/${fileName}.pdf`, `${outputFolder}/duplicated/pdf/${fileName}.pdf`, err => {
                                writeInExcel(file, 'DUPLICATED');
                            })
                            return console.error(err)
                        }
                    })
                    // Move PDF to out/html
                    fse.move(`${outputFolder}/${fileName}.pdf.html`, `${outputFolder}/html/${fileName}.pdf.html`, err => {
                        if (err) {
                            // IF error occured: MOVE TO duplicated/html
                            fse.move(`${outputFolder}/${fileName}.pdf.html`, `${outputFolder}/duplicated/html/${fileName}.pdf.html`, err => {
                            })
                            return console.error(err)
                        }
                    })
                    // Move PDF to out/treated_json
                    fse.move(`./${inputFolder}/${file}`, `${outputFolder}/treated_json/${file}`, err => {
                        if (err) {
                            // IF error occured: MOVE TO duplicated/json
                            fse.move(`./${inputFolder}/${file}`, `${outputFolder}/duplicated/json/${file}`, err => {
                            })
                            return console.error(err)
                        }
                    })
                    if (stderr) {
                        return console.error(stderr)
                    }
                }
            });
        }
    })

function initExcelFile() {
    worksheet.columns = [
        { header: 'Date', key: 'date' },
        { header: 'File', key: 'file' },
        { header: 'Status', key: 'status' },
    ];
    worksheet.columns.forEach(column => {
        column.width = column.header.length < 12 ? 12 : column.header.length
    })
    worksheet.getRow(1).font = { bold: true }
}

function writeInExcel(file, state) {
    worksheet.addRow({
        date: new Date().toISOString(),
        file: file,
        status: state
    });
    workbook.xlsx.writeFile('report.xlsx')
}

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello !\n');
})

app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');
