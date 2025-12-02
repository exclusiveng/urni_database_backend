import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, Index } from 'typeorm';

@Entity('duplicate_logs')
export class DuplicateLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ unique: true })
  identifier!: string; 

  @Column({ default: 1 })
  count!: number;

  @Column('jsonb', { nullable: true })
  data: any; 
  @UpdateDateColumn()
  lastAttemptAt!: Date;
}
