const db = require("../models");
const ExpenseSheet = db.expenseSheets;
// const WeeklyExpenseSheet = db.weeklyExpenseSheet;
const Notfication = db.notification;
const Project = db.project;
const User = db.user;
const userServices = require("../service/user.service");
const projectServices = require("../service/project.service");
const Expensesheetervices = require("../service/timesheet.service");
const projectController = require("../controller/project.controller");
const emailService = require('../service/email.service');
const { Op, where } = require("sequelize");

const updateExpenseSheetList = async (data) => {
  const { expenseSheet, user } = data;
  console.log("data", data);

  const { id: userId } = user

  let date = new Date(expenseSheet?.[0]?.month);

  let start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    1);
  let selectedMonth = new Date(start_utc);

  console.log("selectedMonth", selectedMonth);
  const expenseSheets = await ExpenseSheet.bulkCreate(
    expenseSheet.map((sheet) => ({
      projectId: sheet.projectId,
      month: selectedMonth,
      expense: +sheet.expense,
      userId: userId,
      approvalStatus: sheet.approvalStatus,
      category: sheet.category,
      imageUrls: sheet.imageUrls,
      id: sheet.id > 0 ? sheet.id : null,
    })),
    { updateOnDuplicate: ["projectId", "month", "expense", "userId", "approvalStatus", "category", "imageUrls"] }
  );

  console.log("expenseSheets", expenseSheets);
  return expenseSheets
}

const updateExpenseSheetReceipt = async (data) => {
  const { id, imageUrls, user } = data;
  // console.log("data", data);

  const { id: userId } = user

  const expenseSheets = await ExpenseSheet.findOne({
    where: {
      userId,
      id,
    }
  });

  if(!expenseSheets) return null;

  await expenseSheets.update({
    imageUrls
  });

  console.log("expenseSheets", expenseSheets);
  return expenseSheets
}

const getExpenseSheetList = async (data) => {
  const { user, month } = data;
  const { id: userId } = user;

  const date = new Date(month);
  const year = date.getFullYear();
  const monthNumber = date.getMonth();

  try {
    const expenseSheetList = await ExpenseSheet.findAll({
      where: {
        userId,
        month: {
          [Op.and]: [
            db.Sequelize.where(db.Sequelize.fn('EXTRACT', db.Sequelize.literal('YEAR FROM "month"')), year),
            db.Sequelize.where(db.Sequelize.fn('EXTRACT', db.Sequelize.literal('MONTH FROM "month"')), monthNumber + 1), // Add 1 because month is 0-indexed
          ],
        },
      },
      include: [
        {
          model: db.project, // Include the project model
          as: 'project',
          include: [
            {
              model: db.user, // Include the user model through project_manager
              as: 'manager',
            },
          ],
        },
      ],
    });

    return expenseSheetList;
  } catch (error) {
    console.error('Error fetching expense sheets:', error);
    throw error;
  }
};


// const getExpenseSheetList = async (data) => {
//   const { user, month } = data;
//   const { id: userId } = user;

//   const date = new Date(month);
//   const year = date.getFullYear();
//   const monthNumber = date.getMonth();

//   try {
//     const expenseSheetList = await ExpenseSheet.findAll({
//       where: {
//         userId,
//         month: {
//           [Op.and]: [
//             db.Sequelize.where(db.Sequelize.fn('EXTRACT', db.Sequelize.literal('YEAR FROM "month"')), year),
//             db.Sequelize.where(db.Sequelize.fn('EXTRACT', db.Sequelize.literal('MONTH FROM "month"')), monthNumber + 1), // Add 1 because month is 0-indexed
//           ],
//         },
//       },
//     });

//     return expenseSheetList;
//   } catch (error) {
//     console.error('Error fetching expense sheets:', error);
//     throw error;
//   }
// };

const getExpenseSheetList1 = async (data) => {

  const { user, month } = data;

  const { id: userId } = user
  const status = "inprogress"
  const allProjectsList = await projectController.getAllProjectswithMembers(userId, status)
  console.log("allProjectsList", allProjectsList);
  console.log("month", month);

  let date = new Date(month);
  var start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    1);
  var end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
  let startOfTheMonth = new Date(start_utc);
  let endOfTheMonth = new Date(end_utc);

  console.log("startOfTheMonth", startOfTheMonth);
  console.log("endOfTheMonth", endOfTheMonth);

  const expenseSheets = await ExpenseSheet.findAll({
    where: {
      userId,
      projectId: allProjectsList.map((p) => p.id),
      month: {
        [db.Sequelize.Op.between]: [startOfTheMonth, endOfTheMonth],
      },
    },
    raw: true,
  });

  console.log("expenseSheets2", expenseSheets);

  const expenseSheetMap = new Map();
  expenseSheets.forEach((expenseSheet) => {
    expenseSheetMap.set(expenseSheet.projectId, expenseSheet);
  });

  // Iterate over all projects and create an empty expenseSheet if it doesn't exist
  allProjectsList.forEach((project) => {
    if (!expenseSheetMap.has(project.id)) {
      // Create an empty expenseSheet for the project
      expenseSheetMap.set(project.id, {
        projectId: project.id,
        month: new Date(date).toISOString().split('T')[0],
        expense: 0,
        approvalStatus: 'notsubmitted',
        category: "Mileage",
      });
    }
  });

  const expenseSheetArray = Array.from(expenseSheetMap.values());
  // Convert the map values to an array and return

  console.log("expenseSheetArray", expenseSheetArray);


  // console.log("weeklyExpenseSheet", weeklyExpenseSheet);
  const allProjects = await Project.findAll({
    where: { id: expenseSheetArray.map((t) => t.projectId) },
    raw: true,
  });
  const allUsers = await userServices.getAllUsers()
  const expenseSheetsWithData = expenseSheetArray.map((wt) => ({
    ...wt,
    projectName: allProjects.find((p) => p.id === wt.projectId)?.projectname || 'N/A',
    projectManager: Expensesheetervices.getProjectManager(wt, allProjects, allUsers),
  }));

  console.log("expenseSheetsWithData", expenseSheetsWithData);

  return expenseSheetsWithData;
};

async function addExpenseSheet({ access, ...expenseData }) {
  try {
    // const isSuperiorAuthority = (access === 'Admin' || access === 'Directors' || access === 'Operational Director')
    const status = "notsubmitted"
    // isSuperiorAuthority ? 'approved' : 
    const newExpense = await ExpenseSheet.create({ 
      expense: expenseData.expense,
      projectId: expenseData.projectId,
      userId: expenseData.userId,
      approvalStatus: status , // default status to 'Pending' if not provided
      month: expenseData.month,
      category: expenseData.category,
      imageUrls: expenseData.imageUrls || [], // default to an empty array if not provided
      approvedBy: '',
      // isSuperiorAuthority ? expenseData.userId : ""
    });

    // if (isSuperiorAuthority) {
    //   await projectServices.calculateProjectValuesForExpenseSheet(
    //     +expenseData.projectId, 
    //     { ...expenseData, id: newExpense.id, }, 
    //     true,
    //   );
    // }
    return newExpense;
  } catch (error) {
    console.error('Error adding expense sheet:', error);
    throw new Error('Unable to add expense sheet');
  }
}

// const getAdminExpenseSheetList = async (data) => {
//   try {
//     const { user, month } = data;
//     const { id: userId } = user;
  
//     console.log("month", month);
  
//     // Parse the month to get the start and end dates of the month
//     let date = new Date(month);
//     const start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
//     const end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
//     const startOfTheMonth = new Date(start_utc);
//     const endOfTheMonth = new Date(end_utc);
  
//     console.log("startOfTheMonth", startOfTheMonth);
//     console.log("endOfTheMonth", endOfTheMonth);
  
//     // Fetch expense sheets for the month and include the project details
//     const expenseSheets = await ExpenseSheet.findAll({
//       where: {
//         month: {
//           [db.Sequelize.Op.between]: [startOfTheMonth, endOfTheMonth], // Filter by month
//         },
//       },
//       include: [
//         {
//           model: Project,  // Include project details
//           as: 'project',   // Make sure this alias matches the one used in the model association
//           attributes: ['id', 'projectname', 'project_manager', 'client_name'],  // Select specific fields
//         }
//       ],
//       raw: true,
//     });
  
//     console.log("expenseSheets", expenseSheets);
//     return expenseSheets;
//   } catch (error) {
//     console.log(error.message);
    
//     return [];
//   }
// }

const getAdminExpenseSheetList = async (data) => {
  try {
    const { user, month } = data;
    const { id: userId } = user;

    console.log("month", month);

    // Parse the month to get the start and end dates of the month
    let date = new Date(month);
    const start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
    const end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    const startOfTheMonth = new Date(start_utc);
    const endOfTheMonth = new Date(end_utc);

    console.log("startOfTheMonth", startOfTheMonth);
    console.log("endOfTheMonth", endOfTheMonth);

    // Fetch expense sheets for the month and include project and project manager details
    const expenseSheets = await ExpenseSheet.findAll({
      where: {
        month: {
          [db.Sequelize.Op.between]: [startOfTheMonth, endOfTheMonth], // Filter by month
        },
      },
      include: [
        {
          model: Project,  // Include project details
          as: 'project',   // Make sure this alias matches the one used in the model association
          attributes: ['id', 'projectname', 'project_manager', 'client_name'],  // Select specific fields
          include: [
            {
              model: User,  // Include user (project manager) details
              as: 'manager',  // Alias used in the Project-User association
              attributes: ['id', 'name', 'email'],  // Specify which user fields you want to include
            },
          ],
        }
      ],
      // raw: true,
    });
   
    console.log("expenseSheets", expenseSheets);
    return expenseSheets;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

// const getAdminExpenseSheetList = async (data) => {
//   try {
//     const { user, month } = data;
//     const { id: userId } = user;

//     console.log("month", month);

//     // Fetch all projects (adjust query conditions as needed)
//     const allProjectsList = await Project.findAll({
//       raw: true,
//     });

//     // Parse the month to get the start and end dates of the month
//     let date = new Date(month);
//     const start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
//     const end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
//     const startOfTheMonth = new Date(start_utc);
//     const endOfTheMonth = new Date(end_utc);

//     console.log("startOfTheMonth", startOfTheMonth);
//     console.log("endOfTheMonth", endOfTheMonth);

//     // Fetch expense sheets for the month and projects
//     const expenseSheets = await ExpenseSheet.findAll({
//       where: {
//         projectId: allProjectsList.map((p) => p.id), // Get the list of project IDs
//         month: {
//           [db.Sequelize.Op.between]: [startOfTheMonth, endOfTheMonth], // Filter by month
//         },
//       },
//       raw: true,
//     });

//     console.log("expenseSheets", expenseSheets);
//     return expenseSheets;
//     // Create a map of projectId to expenseSheet for easy lookup
//     // const expenseSheetMap = new Map();
//     // expenseSheets.forEach((expenseSheet) => {
//     //   expenseSheetMap.set(expenseSheet.projectId, expenseSheet);
//     // });

//     // // Iterate over all projects and create an empty expenseSheet if it doesn't exist
//     // allProjectsList.forEach((project) => {
//     //   if (!expenseSheetMap.has(project.id)) {
//     //     // Create an empty expenseSheet for projects without an entry
//     //     expenseSheetMap.set(project.id, {
//     //       projectId: project.id,
//     //       month: new Date(date).toISOString().split('T')[0], // Set current month
//     //       expense: 0,
//     //       approvalStatus: 'notsubmitted',
//     //       category: "Mileage",
//     //     });
//     //   }
//     // });

//     // // Convert the map of expense sheets to an array
//     // const expenseSheetArray = Array.from(expenseSheetMap.values());

//     // console.log("expenseSheetArray", expenseSheetArray);

//     // // Fetch project details for the corresponding project IDs
//     // const allProjects = await Project.findAll({
//     //   where: { id: expenseSheetArray.map((t) => t.projectId) },
//     //   raw: true,
//     // });

//     // // Fetch all users to get project manager details
//     // const allUsers = await userServices.getAllUsers();

//     // // Add project name and manager to the expense sheets
//     // const expenseSheetsWithData = expenseSheetArray.map((sheet) => {
//     //   const project = allProjects.find((p) => p.id === sheet.projectId);
//     //   return {
//     //     ...sheet,
//     //     projectName: project?.projectname || 'N/A', // Default to 'N/A' if not found
//     //     projectManager: Expensesheetervices.getProjectManager(sheet, allProjects, allUsers), // Ensure this function exists and works
//     //   };
//     // });

//     // console.log("expenseSheetsWithData", expenseSheetsWithData);

//     // return expenseSheetsWithData; // Return the final result

//   } catch (error) {
//     console.error("Error fetching admin expense sheet list:", error);
//     throw new Error("Unable to fetch admin expense sheet list");
//   }
// };

// 
const test = () => {} 

// const getAdminExpenseSheetList = async (data) => {
//   const { user, month } = data;
//   const { id: userId } = user
//   console.log("month", month);
//   const allProjectsList = await Project.findAll({
//     // where: {
//       // status: "inprogress",
//     // },
//     raw: true,
//   });

//   let date = new Date(month);
//   var start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
//     1);
//   var end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
//   let startOfTheMonth = new Date(start_utc);
//   let endOfTheMonth = new Date(end_utc);

//   console.log("startOfTheMonth", startOfTheMonth);
//   console.log("endOfTheMonth", endOfTheMonth);

//   const expenseSheets = await ExpenseSheet.findAll({
//     where: {
//       projectId: allProjectsList.map((p) => p.id),
//       month: {
//         [db.Sequelize.Op.between]: [startOfTheMonth, endOfTheMonth],
//       },
//     },
//     raw: true,
//   });

//   console.log("expenseSheets2", expenseSheets);

//   // Create a map of project id to weekly expenseSheet
//   const expenseSheetMap = new Map();
//   expenseSheets.forEach((expenseSheet) => {
//     expenseSheetMap.set(expenseSheet.projectId, expenseSheet);
//   });

//   // Iterate over all projects and create an empty expenseSheet if it doesn't exist
//   allProjectsList.forEach((project) => {
//     if (!expenseSheetMap.has(project.id)) {
//       // Create an empty expenseSheet for the project
//       expenseSheetMap.set(project.id, {
//         projectId: project.id,
//         month: new Date(date).toISOString().split('T')[0],
//         expense: 0,
//         approvalStatus: 'notsubmitted',
//         category: "Mileage",
//       });
//     }
//   });

//   const expenseSheetArray = Array.from(expenseSheetMap.values());

//   console.log("expenseSheetArray", expenseSheetArray);

//   // Convert the map values to an array and return

//   // console.log("weeklyExpenseSheet", weeklyExpenseSheet);
//   const allProjects = await Project.findAll({
//     where: { id: expenseSheetArray.map((t) => t.projectId) },
//     raw: true,
//   });
//   const allUsers = await userServices.getAllUsers()
//   const expenseSheetsWithData = expenseSheetArray.map((wt) => ({
//     ...wt,
//     projectName: allProjects.find((p) => p.id === wt.projectId)?.projectname || 'N/A',
//     projectManager: Expensesheetervices.getProjectManager(wt, allProjects, allUsers),
//   }));

//   // const finalExpenseSheets = mergeExpenseSheets(expenseSheetsWithData, expenseSheets);

//   console.log("expenseSheetsWithData", expenseSheetsWithData);

//   return expenseSheetsWithData;
// };

const updateAllExpenseSheetStatus = async (data) => {
  const { expenseSheets, user, id, approvalStatus, link, } = data

  const { id: userId, name, lineManagers, access, email } = user;
  try {
    // Find the existing expense sheet by its ID
    const expenseSheet = await ExpenseSheet.findByPk(id);

    if (!expenseSheet) {
      throw new Error(`Expense sheet with ID ${id} not found`);
    }
 
    if (access === 'Admin' || access === 'Directors' || access === 'Operational Director') {
      // await projectServices.calculateExpenseSheetValues(expenseSheet.projectId, id)
      const { project, sheet, } = await projectServices.calculateProjectValuesForExpenseSheet(
        expenseSheet.projectId,
        expenseSheet.dataValues,
        false,
      );
      // const projectName = await projectServices.getProjectNameById(expenseSheet.projectId);
      const message = `Expense sheet has been approved for project "${project.projectname}" automatically`;
      await Notfication.create({
        userId,
        message,
        link,
      });
      await emailService.sendEmail(email, `Expense sheet approved`, message);  
    }
    else {
      await expenseSheet.update({
        approvalStatus: 'submitted'
      });
    }

    return expenseSheet;
  } catch (error) {
    console.error('Error updating expense sheet:', error);
    throw error;
  }
};


const updateAllExpenseSheetStatus1 = async (data) => {
  const { expenseSheets, user, approvalStatus, link, } = data
  console.log("expenseSheets2", expenseSheets);

  // const { projectId, date } = data;
  const { id: userId, name, lineManagers, access, email } = user
  console.log("link", link);


  if (access === 'Admin' || access === 'Directors' || access === 'Operational Director') {
    const updatedExpenseSheet = await updateAllWeeklyExpenseSheetStatus({
      userId,
      expenseSheets,
      month: new Date(expenseSheets?.[0]?.month),
      approvalStatus: "approved",
      approvedBy: userId,
    });
    expenseSheets.forEach(async (item) => {
      await projectServices.calculateProjectValues(item.projectId)
    })
    const projectName = await projectServices.getProjectNameById(expenseSheets[0].projectId)
    const message = `Expense sheet has been approved for project "${projectName}" automatically`;

    await Notfication.create({
      userId,
      message,
      link,
    });
    await emailService.sendEmail(email, `Expense sheet approved`, message);

    return updatedExpenseSheet
  } else {
    const updatedExpenseSheet = updateAllWeeklyExpenseSheetStatus({
      userId,
      expenseSheets,
      month: new Date(expenseSheets?.[0]?.month),
      approvalStatus,
    });
    if (updatedExpenseSheet) {
      await Notfication.create({
        userId: lineManagers,
        message: `New expense sheet submitted by ${name}`,
        link: "/requestexpenseSheet",
      });
      await Notfication.create({
        userId: userId,
        message: `Expense sheet submitted to manager`,
        link,
      });
    }
    return updatedExpenseSheet
  }
}

const updateAllWeeklyExpenseSheetStatus = async ({ userId, expenseSheets, month, approvalStatus }) => {
  // console.log("approvalStatus", approvalStatus);
  // console.log("userId", userId);

  let date = new Date(month);

  var start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
    1);
  var end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
  let startOfTheMonth = new Date(start_utc);
  let endOfTheMonth = new Date(end_utc);
  console.log("startOfTheMonth", startOfTheMonth);
  console.log("endOfTheMonth", endOfTheMonth);

  const updatedExpenseSheet = await ExpenseSheet.update(
    { approvalStatus },
    {
      where: {
        userId,
        projectId: expenseSheets.map(t => t.projectId),
        month: {
          [db.Sequelize.Op.between]: [startOfTheMonth, endOfTheMonth],
        },
      },
    }
  );
  console.log("updatedExpenseSheet", updatedExpenseSheet);

  return updatedExpenseSheet[0];
}


const getAllPendingExpenseSheets = async (data) => {
  const { userId } = data

  const allUsers = await userServices.getLineManagerSubordinates(userId.toString())
  const expenseSheet = await ExpenseSheet.findAll({
    where: {
      approvalStatus: "submitted",
      userId: allUsers.map(u => u.id)
    },
    raw: true
  });

  console.log("expenseSheet", expenseSheet);
  const allProjects = await Project.findAll({ raw: true })

  const updatedExpenseSheet = expenseSheet.map(t => {
    return {
      ...t,
      userName: allUsers.find(u => u.id === t.userId).name || "N/A",
      projectName: allProjects.find(p => p.id === t.projectId).projectname || "N/A",
    }
  })
  console.log("updatedExpenseSheet", updatedExpenseSheet);
  // console.log("allUsers", allUsers);
  return updatedExpenseSheet
}

const getAllPendingExpenseSheetsForAdmin = async () => {
  const allUsers = await userServices.getAllUsers()

  const expenseSheet = await ExpenseSheet.findAll({
    where: {
      approvalStatus: "submitted",
    },
    raw: true
  });

  console.log("expenseSheet", expenseSheet);

  const allProjects = await Project.findAll({ raw: true })

  const updatedExpenseSheet = expenseSheet.map(t => {
    return {
      ...t,
      userName: allUsers.find(u => u.id === t.userId).name || "N/A",
      projectName: allProjects.find(p => p.id === t.projectId).projectname || "N/A",
    }
  })
  console.log("updatedExpenseSheet", updatedExpenseSheet);
  console.log("allUsers", allUsers);

  return updatedExpenseSheet
}

const getAllPendingExpenseSheetsForDirector = async (data) => {
  try {
    const { directorId, month } = data;

    // Fetch all users and filter the ones managed by the director
    const allUsers = await userServices.getAllUsers();
    const userIdsOfCurrDirector = allUsers
      .filter(user => user.lineManagers == directorId)
      .map(user => user.id);

    // Parse the month to get the start and end dates of the month
    // let date = new Date(month); 
    // const start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
    // const end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    // const startOfTheMonth = new Date(start_utc);
    // const endOfTheMonth = new Date(end_utc);

    // console.log("startOfTheMonth", startOfTheMonth);
    // console.log("endOfTheMonth", endOfTheMonth);

    // Fetch all pending expense sheets for users managed by the director and for the given month
    const expenseSheets = await ExpenseSheet.findAll({
      where: {
        approvalStatus: "notsubmitted",
        //
        userId: {
          [Op.in]: [...userIdsOfCurrDirector, directorId], // Only fetch sheets for users under this director
        },
        // month: {
        //   [Op.between]: [startOfTheMonth, endOfTheMonth], // Filter by month
        // },
      },
      include: [
        {
          model: Project,  // Include project details
          as: 'project',   // Ensure this alias matches the one used in the model association
          attributes: ['id', 'projectname', 'project_manager', 'client_name'],  // Select project fields
          include: [
            {
              model: User,  // Include project manager details
              as: 'manager',  // Alias used for the User-Project association
              attributes: ['id', 'name', 'email'],  // Select specific user fields
            },
          ],
        }
      ],
      raw: false,  // Keep this false to get Sequelize instances for easier association access
    });

    // Format the expense sheet data to include user and project info
    const formattedExpenseSheets = expenseSheets.map(sheet => {
      const user = allUsers.find(u => u.id === sheet.userId) || {};
      const project = sheet.project || {};

      return {
        ...sheet.get(), // Get raw data from the Sequelize instance
        userName: user.name || "N/A",
        projectName: project.projectname || "N/A",
        projectManager: project.manager ? project.manager.name : "N/A",
      };
    });

    console.log("formattedExpenseSheets", formattedExpenseSheets);
    return formattedExpenseSheets;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const getAllExpenseSheetsForDirector = async (data) => {
  try {
    const { directorId, month } = data;

    // Fetch all users and filter the ones managed by the director
    const allUsers = await userServices.getAllUsers();
    const userIdsOfCurrDirector = allUsers
      .filter(user => user.lineManagers == directorId)
      .map(user => user.id);

    // Parse the month to get the start and end dates of the month
    // let date = new Date(month); 
    // const start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
    // const end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    // const startOfTheMonth = new Date(start_utc);
    // const endOfTheMonth = new Date(end_utc);

    // console.log("startOfTheMonth", startOfTheMonth);
    // console.log("endOfTheMonth", endOfTheMonth);

    // Fetch all pending expense sheets for users managed by the director and for the given month
    const expenseSheets = await ExpenseSheet.findAll({
      where: {
        // approvalStatus: "notsubmitted",
        //
        userId: {
          [Op.in]: [...userIdsOfCurrDirector, directorId], // Only fetch sheets for users under this director
        },
        // month: {
        //   [Op.between]: [startOfTheMonth, endOfTheMonth], // Filter by month
        // },
      },
      include: [
        {
          model: Project,  // Include project details
          as: 'project',   // Ensure this alias matches the one used in the model association
          attributes: ['id', 'projectname', 'project_manager', 'client_name'],  // Select project fields
          include: [
            {
              model: User,  // Include project manager details
              as: 'manager',  // Alias used for the User-Project association
              attributes: ['id', 'name', 'email'],  // Select specific user fields
            },
          ],
        }
      ],
      raw: false,  // Keep this false to get Sequelize instances for easier association access
    });

    // Format the expense sheet data to include user and project info
    const formattedExpenseSheets = expenseSheets.map(sheet => {
      const user = allUsers.find(u => u.id === sheet.userId) || {};
      const project = sheet.project || {};

      return {
        ...sheet.get(), // Get raw data from the Sequelize instance
        userName: user.name || "N/A",
        projectName: project.projectname || "N/A",
        projectManager: project.manager ? project.manager.name : "N/A",
      };
    });

    console.log("formattedExpenseSheets", formattedExpenseSheets);
    return formattedExpenseSheets;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

const getAllPendingExpenseSheetsForDirectorOfUser = async (data) => {
  try {
    const { directorId, month } = data;

    // Fetch all users and filter the ones managed by the director
    const allUsers = await userServices.getAllUsers();
    const userIdsOfCurrDirector = allUsers
      .filter(user => user.lineManagers == directorId)
      .map(user => user.id);

    // const projectOfCurrUser = await projectServices.getAllProjects()

    // Parse the month to get the start and end dates of the month
    // let date = new Date(month); 
    // const start_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
    // const end_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    // const startOfTheMonth = new Date(start_utc);
    // const endOfTheMonth = new Date(end_utc);

    // console.log("startOfTheMonth", startOfTheMonth);
    // console.log("endOfTheMonth", endOfTheMonth);

    // Fetch all pending expense sheets for users managed by the director and for the given month
    const expenseSheets = await ExpenseSheet.findAll({
      where: {
        approvalStatus: "submitted",
        //
        userId: {
          [Op.in]: [...userIdsOfCurrDirector, directorId], // Only fetch sheets for users under this director
        },
        // month: {
        //   [Op.between]: [startOfTheMonth, endOfTheMonth], // Filter by month
        // },
      },
      include: [
        {
          model: Project,  // Include project details
          as: 'project',   // Ensure this alias matches the one used in the model association
          attributes: ['id', 'projectname', 'project_manager', 'client_name'],  // Select project fields
          include: [
            {
              model: User,  // Include project manager details
              as: 'manager',  // Alias used for the User-Project association
              attributes: ['id', 'name', 'email'],  // Select specific user fields
            },
          ],
        }
      ],
      raw: false,  // Keep this false to get Sequelize instances for easier association access
    });

    // Format the expense sheet data to include user and project info
    const formattedExpenseSheets = expenseSheets.map(sheet => {
      const user = allUsers.find(u => u.id === sheet.userId) || {};
      const project = sheet.project || {};

      return {
        ...sheet.get(), // Get raw data from the Sequelize instance
        userName: user.name || "N/A",
        projectName: project.projectname || "N/A",
        projectManager: project.manager ? project.manager.name : "N/A",
      };
    });

    console.log("formattedExpenseSheets", formattedExpenseSheets);
    return formattedExpenseSheets;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};


// const getAllPendingExpenseSheetsForDirector = async ({ user, month }) => {
//   try {
//     // Fetch all users and filter the ones managed by the director
//     const allUsers = await userServices.getAllUsers();
//     const userIdsOfCurrDirector = allUsers
//       .filter(user => user.lineManagers == user.id)
//       .map(user => user.id);

//     // Fetch all pending expense sheets where approval status is 'submitted'
//     const expenseSheets = await ExpenseSheet.findAll({
//       where: {
//         approvalStatus: "submitted",
//         userId: {
//           [Op.in]: userIdsOfCurrDirector, // Only fetch sheets for users under this director
//         },
//       },
//       include: [
//         {
//           model: Project,  // Include project details
//           as: 'project',   // Ensure this alias matches the one used in the model association
//           attributes: ['id', 'projectname', 'project_manager', 'client_name'],  // Select project fields
//           include: [
//             {
//               model: User,  // Include project manager details
//               as: 'manager',  // Alias used for the User-Project association
//               attributes: ['id', 'name', 'email'],  // Select specific user fields
//             },
//           ],
//         }
//       ],
//       raw: false,  // Keep this false to get Sequelize instances for easier association access
//     });

//     // Format the expense sheet data to include user and project info
//     const formattedExpenseSheets = expenseSheets.map(sheet => {
//       const user = allUsers.find(u => u.id === sheet.userId) || {};
//       const project = sheet.project || {};

//       return {
//         ...sheet.get(), // Get raw data from the Sequelize instance
//         userName: user.name || "N/A",
//         projectName: project.projectname || "N/A",
//         projectManager: project.manager ? project.manager.name : "N/A",
//       };
//     });

//     console.log("formattedExpenseSheets", formattedExpenseSheets);
//     return formattedExpenseSheets;
//   } catch (error) {
//     console.log(error.message);
//     return [];
//   }
// };


// const getAllPendingExpenseSheetsForDirector = async (directorId) => {
//   const allUsers = await userServices.getAllUsers();

//   const userIdsOfCurrDirector = allUsers.filter(user => user.lineManagers == directorId).map(user => user.id);

//   const expenseSheet = await ExpenseSheet.findAll({
//     where: {
//       approvalStatus: "submitted",
//     },
//     raw: true
//   });

//   console.log("expenseSheet", expenseSheet);

//   const allProjects = await Project.findAll({ raw: true })

//   const sheet = []
//   expenseSheet.forEach(t => {
//     if(userIdsOfCurrDirector.includes(t.userId)){
//       sheet.push({
//         ...t,
//         userName: allUsers.find(u => u.id === t.userId).name || "N/A",
//         projectName: allProjects.find(p => p.id === t.projectId).projectname || "N/A",
//       });
//     }
//   })
//   console.log("updatedExpenseSheet", sheet);
//   console.log("allUsers", allUsers);

//   return sheet;
// }

const updateExpenseSheetStatusByManager = async (data) => {
  const { approvalStatus, expenseSheetId, comments } = data
  const updatedExpenseSheet = await ExpenseSheet.update(
    { approvalStatus, comments },
    {
      where: {
        id: expenseSheetId
      },
      raw: true
    }
  );
  // console.log("updatedExpenseSheet", updatedExpenseSheet);

  if (approvalStatus === "approved") {
    const expenseSheet = await ExpenseSheet.findByPk(expenseSheetId);
    // console.log("expenseSheet", expenseSheet);

    // await projectServices.calculateProjectValues(+expenseSheet.projectId)
    await projectServices.calculateProjectValuesForExpenseSheet(expenseSheet.projectId, expenseSheet.dataValues, true);
  }
  return updatedExpenseSheet;
}

const deleteExpenseSheet = async (data) => {
  console.log("data", data);
  const { expenseSheet } = data
  const deletedExpenseSheet = await ExpenseSheet.destroy({
    where: {
      id: expenseSheet.id
    }
  });

  await projectServices.calculateProjectValues(expenseSheet.projectId)

  return deletedExpenseSheet
}

module.exports = {
  updateExpenseSheetStatusByManager,
  getAllPendingExpenseSheets,
  getAllPendingExpenseSheetsForAdmin,
  getExpenseSheetList,
  updateExpenseSheetList,
  getAdminExpenseSheetList,
  updateAllExpenseSheetStatus,
  deleteExpenseSheet,
  addExpenseSheet,
  getAllPendingExpenseSheetsForDirector,
  updateExpenseSheetReceipt,
  getAllPendingExpenseSheetsForDirectorOfUser,
  getAllExpenseSheetsForDirector,
};
