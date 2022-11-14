import { BasicEnt } from 'src/common/entities/basic.entity';
import { RelTaskEnt } from 'src/modules/rel-task/modules/entities/rel-task.entity';
import { TaskBlockOperationEnt } from 'src/modules/task-cblock-operation/modules/entities/task-block-operation.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  
  @OneToOne(()=>RelTaskEnt,last_rel_task=>last_rel_task.src)
  last_rel_task:RelTaskEnt

  @OneToOne(()=>RelTaskEnt,new_rel_task=>new_rel_task.ref)
  new_rel_task:RelTaskEnt
}
