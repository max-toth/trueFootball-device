#!/usr/bin/env node

/**
 * Based on 020_replace_text.js http://devgirl.org/2013/11/12/three-hooks-your-cordovaphonegap-project-needs/
 * @type {exports}
 */

var fs = require('fs'),
    path = require('path');

function setConfigProperty(filename, propertyName, value) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(propertyName +  ": +'[^']*'", 'g'), propertyName + ": '" + value + "'");

    fs.writeFileSync(filename, result, 'utf8');
}

var root = process.argv[2];

if (root) {
    var filesToReplace = [
        // android
        "platforms/android/assets/www/js/services.js",
        // ios
        "platforms/ios/www/js/services.js"
    ];

    filesToReplace.forEach(function(filename) {
        var fullFilename = path.join(root, filename);

        if (fs.existsSync(fullFilename)) {
            // setConfigProperty(fullFilename, 'apiUrl', 'http://truefootbal.ngrok.com');
            setConfigProperty(fullFilename, 'apiUrl', 'http://sport-seeker.herokuapp.com/');
        } else {
            console.log("missing: " + fullFilename);
        }
    });
}
