import { Contains, IsEmail, Min } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from "typeorm";
import bcrypt from "bcrypt"
// import { Email, Min, Required } from "joi-typescript-validator"



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

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12)
    }



}
