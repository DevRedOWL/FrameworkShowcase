exports.shutdown = (http, https, sequelize) => function () {
    console.log(`[${new Date().toLocaleString()}] Shutting down server...`);
    // Close listening 80 port
    http.close((HTTPerr) => {
        if (HTTPerr) console.error('[HTTP] ' + HTTPerr.message);
        // Close listening 443 port
        https.close((HTTPSerr) => {
            if (HTTPSerr) console.error('[HTTPS] ' + HTTPSerr.message);
            // Close connection with DB
            sequelize.close().then((DBerr) => {
                if (DBerr) console.error('[DB] ' + DBerr.message);
                // Finally exit from app
                process.exit(0);
            });
        })
    })
};

exports.startup = function () {
    
}