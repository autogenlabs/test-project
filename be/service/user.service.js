const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.user;
const emailService = require("../service/email.service");
const notificationService = require('../service/notification.service');
const ExpenseSheet = db.expenseSheets;
// const WeeklyExpenseSheet = db.weeklyExpenseSheet;
const Notfication = db.notification;
const Project = db.project;
const Timesheet = db.timesheet;
const ProjectMembers = db.projectMembers;

const createUser = async (params, userData) => {
    const { name, userId, email, password, team, access, lineManagers, blendedRate, company_role, company_name } = params;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = {
        name,
        userId,
        email,
        team,
        access,
        lineManagers,
        blendedRate,
        password: hash,
        active: 0,
        deleted: 0,
        company_role,
        company_name,
    }

    const [row, created] = await User.findOrCreate({
        where: { email: user.email },
        defaults: user,
    });
    if (created) {
        console.log("created", created);
        console.log("row", row);

        await notificationService.createNotification({
            userId: userData.id,
            "message": `New user ${name} has been created`,
            link: `/users`,
          });
        await notificationService.createNotification({
            userId: row.id,
            "message": `${userData.name} has created an account for you at FMS system`,
            link: `/dashboard`,
        });
        const message = `${userData.name} has created an account for you at FMS system`
        await emailService.sendEmail(user.email, `New user creation successful`, message);
        return row;
    }
    return null;
};

const getAllAdmins = async () => {
    const users = await User.findAll({ where: { access: "Admin" }, raw: true });
    return users;
};

const getAllUsers = async (filter, options) => {
    const users = await User.findAll();
    return users;
};

const getUserById = async (id) => {
    return User.findOne({ where: { id } });
};

const getUserByEmail = async (email) => {
    return User.findOne({ where: { email } });
};


const updateUserById = async (userId, updateBody) => {
    const {
        email,
        name,
        team,
        lineManagers,
        blendedRate,
        access,
        company_role,
        company_name,
    } = updateBody;
    const user = {
        email,
        name,
        team,
        lineManagers,
        blendedRate,
        access,
        company_role,
        company_name,
    }
    if (updateBody?.password) {
        const { password } = updateBody;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.password = hash;
    }

    const row = await User.update(user, {
        where: { id: userId },
    });
    return row;
};


const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) return null;

    await ExpenseSheet.destroy({ where: { userId } });

    await Timesheet.destroy({ where: { userId } });

    await ProjectMembers.destroy({ where: { memberId: userId } });

    await Notfication.destroy({ where: { userId } });

    await User.destroy({ where: { id: userId } });

    return true; // Successfully deleted
};
  
// const deleteUserById = async (userId) => {
//     const user = await getUserById(userId);
//     if (!user) return null
//     await user.update({ isDeleted: true, });
//     return user
// };

const getLineManagerSubordinates = async (userId) => {
    return await User.findAll({ where: { lineManagers: userId }, raw: true });
}

const getUsers = async (userIds) => {
    const users = await User.findAll({ where: { id: userIds } })
    return users.map(user => getUserInfo(user))
}

const getUserInfo = (user) => {
    const { id, name,
        userId,
        email: emailId,
        team,
        access: roleAccess,
        lineManagers,
        blendedRate,
        company_role,
        company_name,
        lineManagerName,
    } = user;
    return {
        id, name,
        userId,
        emailId,
        team,
        roleAccess,
        lineManagers,
        blendedRate,
        company_role,
        company_name,
        lineManagerName,
    }
}

const storeOtp = async (userId, otp) => {
    await User.update(
      { otp, }, // Update OTP and expiration
      { where: { id: userId } }
    );
};

const clearOtp = async (userId) => {
    await User.update(
      { otp: null, token_expire: null }, // Clear OTP and expiration time
      { where: { id: userId } }
    );
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
    getLineManagerSubordinates,
    getUserInfo,
    getUsers,
    getAllAdmins,
    storeOtp,
    clearOtp,
};
