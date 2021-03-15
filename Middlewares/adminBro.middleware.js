const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelize');

AdminBro.registerAdapter(AdminBroSequelize)
const adminBro = new AdminBro({
    databases: [options.db.sequelize],
    rootPath: '/admin',
    branding: {
        logo: '/assets/images/logo-w.png',
        companyName: 'RedFramework',
        softwareBrothers: false   // if Software Brothers logos should be shown in the sidebar footer
    },
})

module.exports = AdminBroExpress.buildRouter(adminBro);