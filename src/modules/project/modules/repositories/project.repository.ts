import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateProjectDto } from '../dtos/create.project.dto';
import { UpdateProjectDto } from '../dtos/update.project.dto';
import { ProjectEnt } from '../entities/project.entity';
import { ProjectMapperPagination } from '../mapper/project.mapper.pagination';
import { ProjectPageDto } from '../paginations/project.page.dto';

export class ProjectRepo {
  constructor(
    @InjectRepository(ProjectEnt)
    private dataSource: DataSource,
  ) {}

  //create
  async _createEntity(
    createDto: CreateProjectDto,
    query: QueryRunner | undefined,
  ): Promise<ProjectEnt> {
    const projectEnt = new ProjectEnt();
    projectEnt.project_name = createDto.project_name;
    if (query) return await query.manager.save(projectEnt);
    return await this.dataSource.manager.save(projectEnt);
  }

  //readOne
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<Object> {
    const project = await this.dataSource.manager.findOne(ProjectEnt, {
      where: { id: searchDto },
    });
    if (!project) {
      throw new BadGatewayException({ message: 'Project does not exits' });
    }
    return project;
  }

  //update
  async _updateEntity(
    entity: ProjectEnt,
    updateDto: UpdateProjectDto,
    query?: QueryRunner,
  ): Promise<ProjectEnt> {
    entity.project_name = updateDto.project_name;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  //delete
  async _deleteEntity(
    entity: ProjectEnt,
    query?: QueryRunner,
  ): Promise<ProjectEnt> {
    if (query) return await query.manager.remove(entity);
    return await this.dataSource.manager.remove(entity);
  }

  //pagination
  async _paginationEntity(
    pageDto: ProjectPageDto,
  ): Promise<PageDto<ProjectEnt>> {
    console.log(11111);
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(ProjectEnt, 'project')
      .select(['Project.id', 'project.project_name']);
    console.log(22222222);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.project_name) {
        queryBuilder.andWhere('project.project_name LIKE :project_name', {
          project_name: `%${pageDto.filter.project_name}%`,
        });
      }
    }
    console.log(333333333);
    if (pageDto.field) {
      const mapper = ProjectMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${ProjectMapperPagination[pageDto.field]}`,
        pageDto.base.order,
      );
    }
    console.log(444444444);

    const result = await queryBuilder.getManyAndCount();
    console.log('result', result);

    const pageMetaDto = new PageMetaDto({
      baseOptionsDto: pageDto.base,
      itemCount: result[1],
    });

    console.log('pageMetaDto', pageMetaDto);
    console.log(555555555);
    const a = new PageDto(result[0], pageMetaDto);
    console.log('result[0]', result[0]);
    console.log(a);
    console.log(66666666666);
    return a;
  }
}
