const allRoles = {
  Admin: [
    "register",
    "getUsers",
    "manageUsers",
    "getProjects",
    "manageProjects",
    "deleteTimesheets",
    "deleteExpenses",
    "requests",
  ],
  "Operational Director": [
    "register",
    "getUsers",
    "manageUsers",
    "getProjects",
    "manageProjects",
    "deleteTimesheets",
    "deleteExpenses",
    "requests",
  ],
  Everything: [
    "register",
    "getUsers",
    "manageUsers",
    "getProjects",
    "manageProjects",
    "deleteTimesheets",
    "deleteExpenses",
    "requests",
  ],
  Directors: ["getSubordinates", "getProjects", "getUsers", "manageProjects",],
  // : ["getSubordinates", "getProjects", "getUsers", "manageProjects",],
  "Project Management": ["getSubordinates", "getProjects", "getUsers", "manageProjects"],
  General: ["getProjects"],
};

const roles = Object.keys(allRoles);
const roleRights = allRoles;
// new Map(Object.entries(allRoles));

exports.ADMIN = "Admin";
exports.PROJECT_MANAGER = "Project Management";
exports.OPERATIONAL_DIRECTOR = "Operational Director";
exports.DIRECTORS = "Directors";
exports.GENERAL = "General";

module.exports = {
  roles,
  roleRights,
};
