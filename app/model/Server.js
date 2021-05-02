module.exports = function(sequelize, DataTypes) {
  const Server = sequelize.define('Server', {
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    total_memory: {
      type: DataTypes.STRING
    },
    usage_memory: {
      type: DataTypes.STRING
    },
    total_cpu: {
      type: DataTypes.INTEGER
    },
    usage_cpu_percentage: {
      type: DataTypes.STRING
    },
    total_disk: {
      type: DataTypes.STRING
    },
    usage_disk: {
      type: DataTypes.STRING
    },
    last_update: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'Server',
    timestamps: false
  })
    
  Server.associate = function(models) {
        
  }
  return Server
}