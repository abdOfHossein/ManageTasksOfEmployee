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
import { CreateRelTaskDto } from '../../modules/dtos/create.rel-task.dto';
import { UpdateRelTaskDto } from '../../modules/dtos/update.rel-task.dto';
import { RelTaskEnt } from '../../modules/entities/rel-task.entity';
import { RelTaskPageDto } from '../../modules/paginations/rel-task.page.dto';
import { RelTaskService } from '../../modules/services/rel-task.service';

@ApiTags('RelTask')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('RelTask')
export class RelTaskController {
  constructor(private relTask: RelTaskService) {}

  //create
  @Post()
  createRelTask(
    @Query('id_src') id_src: string,
    @Query('id_ref') id_ref: string,
    @Body() createRelTaskDto: CreateRelTaskDto,
  ): Promise<Object> {
    createRelTaskDto.id_ref = id_ref;
    createRelTaskDto.id_src = id_src;
    return this.relTask._create(createRelTaskDto);
  }

  //readOne
  @Get('/')
  getOneRelTask(@Query('id_rel_task') id_rel_task: string): Promise<Object> {
    return this.relTask._getOne(id_rel_task);
  }

  //update
  @Put()
  updateArch(
    @Query('id_rel_task') id_rel_task: string,
    @Query('id_src') id_src: string,
    @Query('id_ref') id_ref: string,
    @Body() updateRelTaskDto: UpdateRelTaskDto,
  ): Promise<RelTaskEnt> {
    updateRelTaskDto.id_ref = id_ref;
    updateRelTaskDto.id_src = id_src;
    return this.relTask._update(id_rel_task, updateRelTaskDto);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_rel_task') id_rel_task: string): Promise<SuccessDto> {
    return this.relTask._delete(id_rel_task);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for RelTask' })
  @Post('page')
  getPaginationArch(
    @Body() pageDto: RelTaskPageDto,
  ): Promise<PageDto<RelTaskEnt>> {
    return this.relTask._pagination(pageDto);
  }
}
