import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';

export class CreateUserDto {
  @ApiHideProperty()
  departmentEnt : DepartmentEnt;

  @ApiHideProperty()
  id_department: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phonenumber: string;
}
