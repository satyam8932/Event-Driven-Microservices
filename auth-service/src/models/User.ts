import { DataTypes, Model, Association, BelongsToGetAssociationMixin } from "sequelize";
import { sequelize } from "../config/database";
import Role from "./Role";

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
}

class User extends Model<IUser> implements IUser {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public roleId!: number;
    // Role Association
    public role?: Role;
    public getRole!: BelongsToGetAssociationMixin<Role>;
    public static associations: {
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

// Relationship
User.belongsTo(Role, { foreignKey: "roleId", targetKey: "id", as: "role" });

export default User;