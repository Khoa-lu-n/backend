module.exports = function(sequelize, DataTypes) {
    const Instance = sequelize.define('Instance', {
        id_instance: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_memory: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        total_cpu: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        total_disk: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_project: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
      tableName: 'Instance',
      timestamps: false
    })
      
    Instance.associate = function(models) {
        Instance.belongsTo(models.Project, {
            foreignKey: "id_project",
            targetKey: "id_project"
        })
    }
    return Instance;
  }