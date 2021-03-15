let isMasterThread = false;

// First example function
exports.startInitialize = async (isMaster, callback, ...next) => {
    isMasterThread = isMaster; // Set master thread option for cluster mode
    console.log(`[${new Date().toLocaleString()}] Starting the server...`);
    if (next.length) next[0](callback, ...next.slice(1));
    else callback((null, 'Nothing to initialize'));
}

// Empty initializer for non-master threads
exports.skipInitialize = async (callback, ...next) => {
    if (next.length) next[0](callback, ...next.slice(1));
    else callback(null, 'Step skipped');
}

// Init Database [All threads]
exports.initSequelize = (sequelizeInstance) => async (callback, ...next) => {
    try {
        await sequelizeInstance.authenticate();
        if (next.length) next[0](callback, ...next.slice(1));
        else callback((null, 'Connection with DB has been established successfully.'));
    } catch (error) {
        console.log('\x1b[1m\x1b[41m [InitScript]\x1b[0m\x1b[41m Unable to connect DB \x1b[0m');
        callback(error, null);
    }
}

// Sync all DB tables [Master only]
exports.syncDBTables = (modelsPath, syncParams) => async (callback, ...next) => {
    if (!isMasterThread) return exports.skipInitialize(callback, ...next);
    try {
        let BaseModel = require(`${modelsPath}/BaseModel`);
        // Find all files in dir
        for (let fileName of require('fs').readdirSync(modelsPath)) {
            try {
                // Try to check instanceof
                let thisModule = require(`${modelsPath}/${fileName}`);
                if (new thisModule() instanceof BaseModel.BaseModel) {
                    // Sync if instance is needed model
                    await thisModule.sync(syncParams);
                }
            }
            catch (ex) { }
        }
        // Go to next init functions
        if (next.length) next[0](callback, ...next.slice(1));
        else callback((null, 'All DB tables were sync successfully.'));
    } catch (error) {
        console.log('\x1b[1m\x1b[41m [InitScript]\x1b[0m\x1b[41m Sequelize DB syncronization failes \x1b[0m');
        callback(error, null);
    }
}

// Init nodemailer [Master only]
exports.initMailer = (mailerInstance) => async (callback, ...next) => {
    if (!isMasterThread) return exports.skipInitialize(callback, ...next);
    try {
        await mailerInstance.verify();
        if (next.length) next[0](callback, ...next.slice(1));
        else callback(null, 'NodeMailer has been started.');
    } catch (error) {
        console.log('\x1b[1m\x1b[41m [InitScript]\x1b[0m\x1b[41m NodeMailer initialization error \x1b[0m');
        callback(error, null);
    }
}

// Check if .env is correctly set up
// exports.initEnvironment = async (callback, ...next) => {
//     if (next.length) next[0](callback, ...next.slice(1));
//     else callback(null, 'Environment initialized successfully.');
// }