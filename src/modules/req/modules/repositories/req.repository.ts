import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateReqDto } from '../dtos/create.req.dto';
import { UpdateReqDto } from '../dtos/update.req.dto';
import { ReqEnt } from '../entities/req.entity';
import { ReqMapperPagination } from '../mapper/req.mapper.pagination';
import { ReqPageDto } from '../paginations/req.page.dto';

export class ReqRepo {
  constructor(
    @InjectRepository(ReqEnt)
    private dataSource: DataSource,
  ) {}

  //create
  async _createEntity(
    createDto: CreateReqDto,
    query: QueryRunner | undefined,
  ): Promise<ReqEnt> {
    const reqEnt = new ReqEnt();
    reqEnt.status = createDto.status;
    reqEnt.project = createDto.projectEnt;
    if (query) return await query.manager.save(reqEnt);
    return await this.dataSource.manager.save(reqEnt);
  }

  //readOne
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<Object> {
    const req = await this.dataSource.manager.findOne(ReqEnt, {
      where: { id: searchDto },
      relations: {
        project: true,
      },
    });
    if (!req) {
      throw new BadGatewayException({ message: 'Req does not exits' });
    }
    return req;
  }

  //update
  async _updateEntity(
    entity: ReqEnt,
    updateDto: UpdateReqDto,
    query?: QueryRunner,
  ): Promise<ReqEnt> {
    entity.status = updateDto.status;
    entity.project = updateDto.projectEnt;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  //delete
  async _deleteEntity(entity: ReqEnt, query?: QueryRunner): Promise<ReqEnt> {
    if (query) return await query.manager.remove(entity);
    return await this.dataSource.manager.remove(entity);
  }

  //pagination
  async _paginationEntity(pageDto: ReqPageDto): Promise<PageDto<ReqEnt>> {
    console.log(11111);
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(ReqEnt, 'req')
      .select(['req.id', 'req.status']);
    console.log(22222222);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.status) {
        queryBuilder.andWhere('req.status LIKE :status', {
          status: `%${pageDto.filter.status}%`,
        });
      }
    }
    console.log(333333333);
    if (pageDto.field) {
      const mapper = ReqMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${ReqMapperPagination[pageDto.field]}`,
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
