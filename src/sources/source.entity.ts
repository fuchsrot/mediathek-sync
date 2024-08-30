import { Media } from '../media/media.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Source {
  
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @OneToMany(() => Media, (media) => media.source)
  media: Media[];
}
