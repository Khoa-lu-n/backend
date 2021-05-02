module.exports = function(sequelize, DataTypes) {
    const Account = sequelize.define('Account', {
      id_user: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.STRING
      },
      admin_project_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING
      },
      min_cpu: {
        type: DataTypes.STRING
      },
      min_memory: {
        type: DataTypes.STRING
      },
      min_disk: {
        type: DataTypes.STRING
      }
    }, {
      tableName: 'Account',
      timestamps: false
    })
      
    Account.associate = function(models) {
          
    }
    return Account;
  }