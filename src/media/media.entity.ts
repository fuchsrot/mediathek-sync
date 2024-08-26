import { Source } from 'src/sources/source.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Media {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  link: string;

  @Column()
  creator: string;

  @Column()
  pubDate: string;

  @Column()
  websiteUrl: string;

  @Column()
  duration: number;

  @Column()
  status: string;

  @ManyToOne(() => Source, (source) => source.media, { eager: true })
  source: Source;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
