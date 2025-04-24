import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';


@Entity('Admin_logs')
export class Log {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()

    @Column()
    action: string

    @Column({ nullable: true })
    description: string

    @CreateDateColumn()
    createdAT: Date

    @ManyToOne(() => User, (user) => user.logs, { eager: true, nullable: false })
    admin: User;

}
