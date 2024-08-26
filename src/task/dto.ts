import { Status, Type } from "./task.entity";

export interface TargetDto {
    id: string;
    title: string;
}

export interface TaskDto {

    id: string;

    target: TargetDto;
      
    status: Status;

    type: Type;
  
    createDate: Date;
  
    updateDate: Date;

}
