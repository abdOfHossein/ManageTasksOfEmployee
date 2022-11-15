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
import { CreateProjectDto } from '../../modules/dtos/create.project.dto';
import { UpdateProjectDto } from '../../modules/dtos/update.project.dto';
import { ProjectEnt } from '../../modules/entities/project.entity';
import { ProjectPageDto } from '../../modules/paginations/project.page.dto';
import { ProjectService } from '../../modules/services/project.service';

@ApiTags('Project')
@ApiHeader({
  name: 'language-code',
  description: 'language code',
  schema: {
    default: 'FA',
  },
})
@Controller('Project')
export class ProjectController {
  constructor(private project: ProjectService) {}

  //create
  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto): Promise<Object> {
    return this.project._create(createProjectDto);
  }

  //readOne
  @Get('/')
  getOneProject(@Query('id_project') id_project: string): Promise<Object> {
    return this.project._getOne(id_project);
  }

  //update
  @Put()
  updateArch(
    @Query('id_project') id_project: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEnt> {
    return this.project._update(id_project, updateProjectDto);
  }

  //delete
  @Delete()
  deleteArch(@Query('id_project') id_project: string): Promise<SuccessDto> {
    return this.project._delete(id_project);
  }

  //pagination
  @ApiOperation({ summary: 'pagination for Project' })
  @Post('page')
  getPaginationArch(
    @Body() pageDto: ProjectPageDto,
  ): Promise<PageDto<ProjectEnt>> {
    return this.project._pagination(pageDto);
  }
}
