const db = require("../models");
const User = db.user;
const userServices = require("../service/user.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const projectService = require("../service/project.service");
const { where } = require("sequelize");

const signUp =  catchAsync(async (req, res) => {
    const user = await userServices.createUser(req.body, req.user);
    if (user) {
        res.send({user});
        return;
    }
    res.status(httpStatus.CONFLICT).send({
        "message": "User already exists",
    })
});

const getUserById = catchAsync( async (req, res) => {
    const user = await userServices.getUserById(req.params.id);
    if (!user) {
        res.send({
            "message": "User not found",
        })
        return;
    }
    res.send({user});
});
const updateUser =  catchAsync(async (req, res) => {
    const row = await userServices.updateUserById(req.params.id, req.body);
    if (!row) {
        res.send({
            "message": "User not found",
        })
        return;
    }

    res.send(await userServices.getUserById(req.params.id));
});
const deleteUser = catchAsync( async (req, res) => {
    const deleted = await userServices.deleteUserById(req.params.id);
    if (!deleted) {
        res.send({
            "message": "User not found",
        })
    }
    res.status(httpStatus.NO_CONTENT).send();
});

const getAllUsers =  catchAsync(async (req, res) => {
    const users = await User.findAll({
        // where: { isDeleted: false },
        raw: true
    });
    const allusers = addLineManagerName(users, users);
    res.send({ users: allusers });
});

const getSubordinates = catchAsync(async (req, res) => {
    const users = await getAllSubordinates(req.user.id.toString());
    const allUsersList = await User.findAll({raw : true});
    const allUsers = addLineManagerName(users, allUsersList);
    res.send({ users: allUsers.map(user => userServices.getUserInfo(user)) })
})

const getSubordinatesForDirector = catchAsync(async (req, res) => {
    const users = await getAllSubordinatesForDirector(req.user.id.toString());
    // const allUsersList = await User.findAll({raw : true});
    // const allUsers = addLineManagerName(users, allUsersList);
    res.send({ users: users, });
})

const getAvailableSubordinates = catchAsync(async (req, res) => {
    const users = await getAllSubordinates(req.user.id.toString());
    const members = await projectService.getProjectMembers(req.params.id)
    const availableUsers = users.filter(
      (u) => !members.some((m) => m.memberId === u.id)
    );
    res.send({
      users: availableUsers.map((user) => ({ id: user.id, name: user.name })),
    });
})

const addLineManagerName = (users, allUsersList) => {
  return users.map((user) => {
    return {
      ...user,
      lineManagerName:
      allUsersList.find((u) => u.id === +user.lineManagers)?.name || "N/A",
    };
  });
};

const getAvailableUsers = catchAsync(async (req, res) => {
    const users = await User.findAll();
    const members = await projectService.getProjectMembers(req.params.id)
    const availableUsers = users.filter(
      (u) => !members.some((m) => m.memberId === u.id)
    );
    res.send({
      users: availableUsers.map((user) => ({ id: user.id, name: user.name })),
      members: members.map(mem => mem.user),
    });
})

const getAllSubordinates = async (managerId) =>
  await userServices.getLineManagerSubordinates(managerId);

const getAllSubordinatesForDirector = async (managerId) => {
    try {
        const usersArr = [];
        const allUsers = await User.findAll({ where: { lineManagers: managerId }, });

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i];
            if(user.access === 'Project Management'){
                const userOfManager = await User.findAll({ where: { lineManagers: `${user.id}` }, });
                if(userOfManager && userOfManager.length > 0){
                    usersArr.push(...userOfManager.map(userD => ({ ...userD.dataValues, lineManagerName: user.name || "N/A", })));
                }
                usersArr.push(user);
            }
            else {
                usersArr.push(user);
            }
        }
        
        return usersArr;
    } catch (error) {
        return [];
    }
}

module.exports = {
    signUp,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    getSubordinates,
    getAvailableSubordinates,
    getAvailableUsers,
    getSubordinatesForDirector,
}
