import { Contains, IsEmail, Min } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from "typeorm";





enum UserRole {
    ADMIN = "admin",
    USER = "users"
}
@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, })
    name: string;

    @Column({ nullable: false, unique: true, })
    @Contains("@")
    @IsEmail()
    email: string;

    @Column({ nullable: false })
    @Min(8)
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    role: UserRole

    @Column({ nullable: true })
    passwordChangeAt: Date

    @Column({ nullable: true })
    passwordResetToken: string

    @Column({ nullable: true })
    passwordResetExpires: Date
}
