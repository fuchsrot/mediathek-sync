import { Source } from 'src/sources/source.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export type Status = 'NEW' | 'SCHEDULED' | 'RUNNING' | 'DOWNLOADED' | 'DELETED';

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
  status: Status;

  @ManyToOne(() => Source, (source) => source.media, { eager: true })
  source: Source;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
