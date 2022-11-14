import { ApiProperty } from '@nestjs/swagger';
import { StatusTaskEnum } from '../enums/status-task.enum';
import { TypeTaskEnum } from '../enums/type-task.enum';

export class UpdateTaskDto {
  @ApiProperty()
  priority: string;

  @ApiProperty()
  tittle: string;

  @ApiProperty()
  head_id: string;

  @ApiProperty()
  type: TypeTaskEnum;

  @ApiProperty()
  status: StatusTaskEnum;
}
