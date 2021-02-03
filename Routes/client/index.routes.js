'use strict';

const router = require('express').Router();
const options = require('../../options');

/* Load routes from this directory */
const directoryPath = require('path').join(options.root, 'Routes', 'client');
for (let fileName of require('fs').readdirSync(directoryPath)) {
    if (fileName.indexOf('.routes.js') !== -1 && fileName != 'index.routes.js') {
        try {
            let routeName = `/${fileName.split('.').slice(0, -2).join('/')}`;
            router.use(routeName, require(`./${fileName}`));
            // console.log(`${fileName} loaded as endpont '${routeName}'`);
        }
        catch (ex) {
            console.error(`Unable to load route: ${fileName}\n${ex}`);
        }
    }
    else {
        if (fileName != 'index.routes.js') console.error(`${fileName} is not a .routes file`);
    }
}

/* Main page */
router.get('/', (req, res, next) => {
    res.sendFile('/Views/splashScreen.html', { "root": options.root });
});

module.exports = router;