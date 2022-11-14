import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageDto } from 'src/common/dtos/page.dto';
import { SuccessDto } from 'src/common/result/success.dto';
import { CreateTaskBlockOperationDto } from '../../modules/dtos/create.task-block-operation.dto';
import { UpdateTaskBlockOperationDto } from '../../modules/dtos/update.task-block-operation.dto';
import { TaskBlockOperationEnt } from '../../modules/entities/task-block-operation.entity';
import { TaskBlockOperationPageDto } from '../../modules/paginations/task-block-operation.page.dto';
import { TaskBlockOperationService } from '../../modules/services/task-block-operation.service';


@ApiTags('TaskBlockOperation')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('TaskBlockOperation')
export class TaskBlockOperationController {
  constructor(private taskBlockOperation: TaskBlockOperationService) {}

  //create
  @Post()
  createTaskBlockOperation(@Query('id_task') id_task:string,@Body() createTaskBlockOperationDto: CreateTaskBlockOperationDto): Promise<Object> {
    createTaskBlockOperationDto.id_task=id_task
    return this.taskBlockOperation._create(createTaskBlockOperationDto);
  }

  //readOne
  @Get('/')
  getOneTaskBlockOperation(@Query('id_task_block_operation') id_task_block_operation: string): Promise<Object> {
    return this.taskBlockOperation._getOne(id_task_block_operation);
  }

  //update
  @Put()
  updateArch(
    @Query('id_task_block_operation') id_task_block_operation: string,
    @Query('id_task') id_task:string,
    @Body() updateTaskBlockOperationDto: UpdateTaskBlockOperationDto,
  ): Promise<TaskBlockOperationEnt> {
    updateTaskBlockOperationDto.id_task=id_task
    return this.taskBlockOperation._update(id_task_block_operation, updateTaskBlockOperationDto);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_task_block_operation') id_task_block_operation: string): Promise<SuccessDto> {
    return this.taskBlockOperation._delete(id_task_block_operation);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for TaskBlockOperation' })
  @Post('page')
  getPaginationArch(@Body() pageDto: TaskBlockOperationPageDto): Promise<PageDto<TaskBlockOperationEnt>> {
    return this.taskBlockOperation._pagination(pageDto);
  }
}
