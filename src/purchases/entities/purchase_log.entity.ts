import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

export enum PaymentMethod {
    CARD = "card",
    BANK_TRANSFERS = "bank_transfers",
    DIGITAL_WALLETS = "digital_wallets"
}

export enum PaymentStatus {
    COMPLETED = "completed",
    FAILED = "failed",
    PENDING = "pending"
}

@Entity({ name: 'purchase_log' })
export class Purchase_Log {
    @PrimaryGeneratedColumn('uuid')
    purchase_id: string = uuid();

    @ManyToOne(() => User, (user) => user.purchases, {
        onDelete: 'CASCADE'
    })
    user: User;

    @CreateDateColumn()
    purchase_date: Date;

    @CreateDateColumn()
    expiration_date: Date;

    @Column('numeric', {
        nullable: false,
        precision: 10,
        scale: 2
    })
    amount: number;

    @Column({
        type: "enum",
        enum: PaymentMethod,
        nullable: false
    })
    payment_method: PaymentMethod;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        nullable: false
    })
    status: PaymentStatus;

    @Column({ nullable: true })
    stripe_session_id: string;
}
