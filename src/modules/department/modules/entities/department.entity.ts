import { BasicEnt } from 'src/common/entities/basic.entity';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'department' })
export class DepartmentEnt extends BasicEnt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  header_id: string;

  @Column({ nullable: true })
  name_department: string;

  @OneToMany(() => UserEnt, (users) => users.department)
  users: UserEnt[];
}
