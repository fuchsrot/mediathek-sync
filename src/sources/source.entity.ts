import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;
}
