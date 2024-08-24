import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
