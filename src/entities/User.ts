import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  age!: number;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  email!: string;

  @Index({ unique: true })
  @Column({ unique: true })
  phone!: string;

  @Column({ nullable: true })
  event!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
