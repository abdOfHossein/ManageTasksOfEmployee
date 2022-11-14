import { BasicEnt } from 'src/common/entities/basic.entity';
import { TaskBlockOperationEnt } from 'src/modules/task-cblock-operation/modules/entities/task-block-operation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';

@Entity({ name: 'task' })
export class TaskEnt extends BasicEnt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  priority: string;

  @Column({ nullable: true })
  tittle: string;

  @Column({ nullable: true })
  head_id: string;

  @Column({ nullable: true })
  type: TypeTaskEnum;

  @Column({ nullable: true })
  status: StatusTaskEnum;

  @OneToMany(()=>TaskBlockOperationEnt,task_block_operations=>task_block_operations.task)
  task_block_operations:TaskBlockOperationEnt[]
}
