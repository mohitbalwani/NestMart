import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  productName: string

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: false })
  category: string;

  @Column('int', { array: true, default: [] })
  ratings: number[];

  @Column('text', { array: true, default: [] })
  comments: string[];

  @Column('int', { array: true, default: [] })
  userIds: number[];
}
