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
import { CreateTaskDto } from '../../modules/dtos/create.task.dto';
import { UpdateTaskDto } from '../../modules/dtos/update.task.dto';
import { TaskEnt } from '../../modules/entities/task.entity';
import { TaskPageDto } from '../../modules/paginations/task.page.dto';
import { TaskService } from '../../modules/services/task.service';

@ApiTags('Task')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('Task')
export class TaskController {
  constructor(private task: TaskService) {}

  //create
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Object> {
    return this.task._create(createTaskDto);
  }

  //readOne
  @Get('/')
  getOneTask(@Query('id_task') id_task: string): Promise<Object> {
    return this.task._getOne(id_task);
  }

  //update
  @Put()
  updateArch(
    @Query('id_task') id_task: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEnt> {
    return this.task._update(id_task, updateTaskDto);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_task') id_task: string): Promise<SuccessDto> {
    return this.task._delete(id_task);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for Task' })
  @Post('page')
  getPaginationArch(@Body() pageDto: TaskPageDto): Promise<PageDto<TaskEnt>> {
    return this.task._pagination(pageDto);
  }
}
