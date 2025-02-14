import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
}

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public roleId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        },
    },
    {
        sequelize,
        tableName: 'auth_users',
        timestamps: true,
    }
)