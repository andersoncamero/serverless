const { ProjectSchema, Project } = require('./project.models');


function setupModels(sequelize) {
    Project.init(ProjectSchema, Project.config(sequelize));
}

module.exports = setupModels;
