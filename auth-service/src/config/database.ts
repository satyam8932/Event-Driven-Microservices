import { Sequelize } from'sequelize';
import dotenv from 'dotenv';


dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'root',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: true,
        define: {
            timestamps: true,
        }
    }
)

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Auth Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}