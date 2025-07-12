import { Table, Column, Model, DataType, BeforeCreate } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

@Table({
    tableName: 'users',
    timestamps: true
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    })
    declare name: string;

    @Column({
        type: DataType.ENUM('admin', 'user'),
        defaultValue: 'user'
    })
    declare role: 'admin' | 'user';

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.password) {
            const salt = await bcrypt.genSalt(10);
            instance.password = await bcrypt.hash(instance.password, salt);
        }
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}

export default User; 