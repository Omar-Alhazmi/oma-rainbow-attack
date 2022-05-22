const express = require('express');
const router = express.Router();
const { fileUpload } = require('../helpers/helper');
const fs = require('fs')
var { Md5 } = require("../helpers/md5");
var result = {}
router.get('/', async (req, res) => {
    res.render('index', { Result: result })
})
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
        const passwordHashesFile = fs.readFileSync(savedFiles.hashFile, 'UTF-8');
        // split the contents by new line 
        const hashes = passwordHashesFile.toString().split(/\r?\n/);
        // read the file containing the list of passwords passed in by user
        const passwordsFile = fs.readFileSync(savedFiles.passwordFile, 'UTF-8')
        const passwords = passwordsFile.toString().split(/\r?\n/);
        let hashSampleArray = []
        hashSampleArray.push(hashes)
        let passwordSampleArray = []
        passwordSampleArray.push(passwords)
        let passHashesDictionary = {}
        passwordSampleArray[0].forEach(element => passHashesDictionary[Md5(element)] = element)
        let notMatch = []
        const keys = Object.keys(passHashesDictionary);
        hashSampleArray[0].forEach(matches => {
            if (keys.includes(matches)) {
                result[passHashesDictionary[matches]] = matches
            } else {
                notMatch.push(matches)
            }
        });
        result['Sorry there is no match for this hashes'] = notMatch
        return res.redirect('back')
    }
    catch (error) {
        res.status(404).json(error);
    }
});
module.exports = router;