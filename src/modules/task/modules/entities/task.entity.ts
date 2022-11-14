import { BasicEnt } from 'src/common/entities/basic.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
}
