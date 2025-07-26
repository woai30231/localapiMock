const {Sequelize,DataTypes} = require("sequelize");

const sequelize = new Sequelize("filedb",'root','12345678',{
    host:"127.0.0.1",
    dialect:'mysql',
    logging:false
})

const File = sequelize.define("File",{
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    originalName: { type: DataTypes.STRING, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    mimetype: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    uploadDate: { type: DataTypes.STRING, allowNull: true }
},{
    tableName:'files'
})

module.exports = {File,sequelize};