import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Source {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;
}
