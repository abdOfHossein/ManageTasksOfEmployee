import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateRelTaskDto } from '../dtos/create.rel-task.dto';
import { UpdateRelTaskDto } from '../dtos/update.rel-task.dto';
import { RelTaskEnt } from '../entities/rel-task.entity';
import { RelTaskMapperPagination } from '../mapper/rel-task.mapper.pagination';
import { RelTaskPageDto } from '../paginations/rel-task.page.dto';

export class RelTaskRepo {
  constructor(
    @InjectRepository(RelTaskEnt)
    private dataSource: DataSource,
  ) {}

  //create
  async _createEntity(
    createDto: CreateRelTaskDto,
    query: QueryRunner | undefined,
  ): Promise<RelTaskEnt> {
    const relTaskEnt = new RelTaskEnt();
    relTaskEnt.comment = createDto.comment;
    relTaskEnt.src = createDto.srcEnt;
    relTaskEnt.ref = createDto.refEnt;

    if (query) return await query.manager.save(relTaskEnt);
    return await this.dataSource.manager.save(relTaskEnt);
  }

  //readOne
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<Object> {
    const RelTask = await this.dataSource.manager.findOne(RelTaskEnt, {
      where: { id: searchDto },
    });
    if (!RelTask) {
      throw new BadGatewayException({ message: 'RelTask does not exits' });
    }
    return RelTask;
  }

  //update
  async _updateEntity(
    entity: RelTaskEnt,
    updateDto: UpdateRelTaskDto,
    query?: QueryRunner,
  ): Promise<RelTaskEnt> {
    entity.comment = updateDto.comment;
    entity.src = updateDto.srcEnt;
    entity.ref = updateDto.refEnt;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  //delete
  async _deleteEntity(
    entity: RelTaskEnt,
    query?: QueryRunner,
  ): Promise<RelTaskEnt> {
    if (query) return await query.manager.remove(entity);
    return await this.dataSource.manager.remove(entity);
  }

  //pagination
  async _paginationEntity(
    pageDto: RelTaskPageDto,
  ): Promise<PageDto<RelTaskEnt>> {
    console.log(11111);
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(RelTaskEnt, 'rel_task')
      .select(['rel_task.id', 'rel_task.comment']);
    console.log(22222222);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.comment) {
        queryBuilder.andWhere('RelTask.comment LIKE :comment', {
          comment: `%${pageDto.filter.comment}%`,
        });
      }
    }
    console.log(333333333);
    if (pageDto.field) {
      const mapper = RelTaskMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${RelTaskMapperPagination[pageDto.field]}`,
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
