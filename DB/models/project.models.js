const { Model, DataTypes } = require('sequelize');

const PROJECT_TABLE = 'Projects';

const ProjectSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
  start_time: {
    type: DataTypes.STRING,
  },
  end_time: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  time_zone: {
    type: DataTypes.STRING,
  },
  img: {
    type: DataTypes.STRING,
  },
  currency: {
    type: DataTypes.STRING,
  },
  prefix_currency: {
    type: DataTypes.STRING,
  },
  kwh_cost: {
    type: DataTypes.STRING,
  },
  closing_hour: {
    type: DataTypes.STRING,
  }, 
};

class Project extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: PROJECT_TABLE,
      moduleName: 'Project',
      timestamps: false,
    };
  }
}

module.exports = { PROJECT_TABLE, ProjectSchema, Project };
