const options = require('../options');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelize');

let User = require('../Models/User');
const contentNavigation = {
    name: 'content',
    icon: 'Accessibility',
}

AdminBro.registerAdapter(AdminBroSequelize)
const adminBro = new AdminBro({
    databases: [options.db.sequelize],
    resources: [
        { resource: User, options: { navigation: contentNavigation } }
    ],
    rootPath: '/admin/bro',
    branding: {
        logo: '/assets/images/logo-a.png',
        companyName: 'RedFramework',
        softwareBrothers: false   // if Software Brothers logos should be shown in the sidebar footer
    }
})

module.exports = AdminBroExpress.buildRouter(adminBro);