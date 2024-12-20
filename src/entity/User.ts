import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Roles {
    CUSTOMER = "CUSTOMER",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: Roles,
        default: Roles.CUSTOMER,
    })
    role: Roles; // Correct type for the enum
}
