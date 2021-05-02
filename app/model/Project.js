module.exports = function(sequelize, DataTypes) {
    const Project = sequelize.define('Project', {
      id_project: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      total_instance: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      usage_instance: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total_memory: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      usage_memory: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total_cpu: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      usage_cpu: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      total_disk: {
        type: DataTypes.INTEGER,
      },
      usage_disk: {
        type: DataTypes.INTEGER
      }
    }, {
      tableName: 'Project',
      timestamps: false
    })
      
    Project.associate = function(models) {
        Project.hasMany(models.Instance, {
            foreignKey: "id_project",
            sourceKey: "id_project"
        })
    }
    return Project;
  }