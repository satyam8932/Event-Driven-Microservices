import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface IRole {
    id: number;
    name: string;
}

class Role extends Model<IRole> implements IRole {
    public id!: number;
    public name!: string;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: true,
    }
)

export default Role;