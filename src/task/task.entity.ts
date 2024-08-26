import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Type {
  DOWNLOAD_MEDIA = 'DOWNLOAD_MEDIA',
  REFRESH_RSS = 'REFRESH_RSS',
}

export enum Status {
  NEW = 'SCHEDULED',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Task {

  constructor(type: Type) {
    this.type = type;
    this.status = Status.NEW;
  }

  @PrimaryGeneratedColumn({})
  id: string;

  @Column()
  targetId: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Type,
  })
  type: Type;

  @CreateDateColumn()
  createDate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
