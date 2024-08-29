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
  SCHEDULED = 'SCHEDULED',
  RUNNING = 'RUNNING',
  ERROR = 'ERROR',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Task {
  constructor(type: Type) {
    this.type = type;
    this.status = Status.SCHEDULED;
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
