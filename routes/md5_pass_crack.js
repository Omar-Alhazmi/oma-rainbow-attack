const express = require('express');
const router = express.Router();
const { fileUpload } = require('../helpers/helper');
const fs = require('fs')
var { Md5 } = require("../helpers/md5");

router.post('/api/upload', fileUpload.fields([{ name: 'hashFile', maxCount: 1 }, { name: 'passwordFile', maxCount: 1 }]), (req, res) => {
    const file = {
    };
    if (req.files['hashFile']) {
        const hashFile = req.files['hashFile'][0].path
        file.hashFile = hashFile;
    }
    if (req.files['passwordFile']) {
        const passwordFile = req.files['passwordFile'][0].path
        file.passwordFile = passwordFile;
    }
    const savedFiles = file
    try {
        //read contents of the file containing the password hashes
        const passwordHashes = fs.readFileSync(savedFiles.hashFile, 'UTF-8');
        // split the contents by new line 
        const hashes = passwordHashes.toString().split(/\r?\n/);
        // read the file containing the list of passwords passed in by user
        const passwordsFile = fs.readFileSync(savedFiles.passwordFile, 'UTF-8')
        const passwords = passwordsFile.toString().split(/\r?\n/);
        let hashSample = []
        hashSample.push(hashes)
        let passwordSample = []
        passwordSample.push(passwords)
        let match = {}
        passwordSample[0].forEach(elm => match[Md5(elm)] = elm)
        let notMatch = []
        let result = {}
        const keys = Object.keys(match);
        hashSample[0].forEach(matches => {
            if (keys.includes(matches)) {
                result[match[matches]] = matches
            } else {
                notMatch.push(matches)
            }
        });
        result['Sorry there is no match for this hashes'] = notMatch
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
module.exports = router;