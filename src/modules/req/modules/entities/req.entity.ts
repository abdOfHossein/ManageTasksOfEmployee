import { BasicEnt } from 'src/common/entities/basic.entity';
import { ProjectEnt } from 'src/modules/project/modules/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StatusReqEnum } from '../enums/req.enum';

@Entity({ name: 'Req' })
export class ReqEnt extends BasicEnt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: StatusReqEnum;

  @ManyToOne(()=>ProjectEnt,project=>project.reqs)
  project:ProjectEnt
}
