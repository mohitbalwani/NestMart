import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName?: string;

  @Column({ nullable: false })
  lastName?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  mobile: string;

  @Column({ default: 'customer' })
  role: string;

  @Column('int', { array: true, default: [] })
  orderIds: number[];
}
