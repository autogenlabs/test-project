const userRoute = require('./v1/user.route');
const authRoute = require('./v1/auth.route');
const helloRoute = require('./v1/hello.route');
const projectRoute = require('./v1/project.route');
const timesheetRoute = require('./v1/timesheet.route');
const notificationRoute = require('./v1/notification.route');
const expenseSheetRoute = require('./v1/expenseSheet.route');
const clientRoute = require('./v1/client.route');


const routeManager = (app) => {

    // API V1 Routes
    app.use('/', helloRoute);
    app.use('/auth', authRoute);
    app.use('/user', userRoute);
    app.use('/project', projectRoute);
    app.use('/timesheet', timesheetRoute);
    app.use('/notifications', notificationRoute);
    app.use('/expensesheet', expenseSheetRoute);
    app.use('/clients', clientRoute);

}

module.exports = routeManager;