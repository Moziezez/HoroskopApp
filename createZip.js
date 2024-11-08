const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

function zipFolder(sourceFolder, outputZipPath) {
    const zip = new AdmZip();
    const files = fs.readdirSync(sourceFolder);

    files.forEach((file) => {
        const filePath = path.join(sourceFolder, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            zip.addLocalFile(filePath);
        } else if (stat.isDirectory()) {
            zip.addLocalFolder(filePath, file); // Adds folder recursively
        }
    });

    zip.writeZip(outputZipPath);
    console.log(`Folder ${sourceFolder} has been zipped as ${outputZipPath}`);
}

const sourceFolder = "./wp-horoskop-plugin";
const outputZipPath = "wp-horoskop-plugin.zip";
zipFolder(sourceFolder, outputZipPath);
