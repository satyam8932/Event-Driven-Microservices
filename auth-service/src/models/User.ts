import { DataTypes, Model, Association, BelongsToGetAssociationMixin } from "sequelize";
import { sequelize } from "../config/database";
import Role, { IRole } from "./Role";

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
    role?: IRole;
}

class User extends Model<IUser> implements IUser {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare roleId: number;
    declare role?: Role;
    declare getRole: BelongsToGetAssociationMixin<IRole>;
    declare static associations: {
        role: Association<User, Role>;
    };
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
        roleId: {
            type: DataTypes.INTEGER,
            references: {
                model: Role,
                key: 'id'
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "auth_users",
        timestamps: true,
    }
);

User.belongsTo(Role, { foreignKey: "roleId", targetKey: "id", as: "role" });

export default User;