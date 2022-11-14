import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateDepartmentDto } from '../dtos/create.department.dto';
import { UpdateDepartmentDto } from '../dtos/update.department.dto';
import { DepartmentEnt } from '../entities/department.entity';
import { DepartmentMapperPagination } from '../mapper/department.mapper.pagination';
import { DepartmentPageDto } from '../paginations/department.page.dto';

export class DepartmentRepo {
  constructor(
    @InjectRepository(DepartmentEnt)
    private dataSource: DataSource,
  ) {}

  //create
  async _createEntity(
    createDto: CreateDepartmentDto,
    query: QueryRunner | undefined,
  ): Promise<DepartmentEnt> {
    const departmentEnt = new DepartmentEnt();
    departmentEnt.header_id = createDto.header_id;
    if (query) return await query.manager.save(departmentEnt);
    return await this.dataSource.manager.save(departmentEnt);
  }

  //readOne
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<Object> {
    const department = await this.dataSource.manager.findOne(DepartmentEnt, {
      where: { id: searchDto },
    });
    if (!department) {
      throw new BadGatewayException({message:"department does not exits"});
    }
    return department;
  }

  //update
  async _updateEntity(
    entity: DepartmentEnt,
    updateDto: UpdateDepartmentDto,
    query?: QueryRunner,
  ): Promise<DepartmentEnt> {
    entity.header_id = updateDto.header_id;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  //delete
  async _deleteEntity(
    entity: DepartmentEnt,
    query?: QueryRunner,
  ): Promise<DepartmentEnt> {
    if (query) return await query.manager.remove(entity);
    return await this.dataSource.manager.remove(entity);
  }

  //pagination
  async _paginationEntity(
    pageDto: DepartmentPageDto,
  ): Promise<PageDto<DepartmentEnt>> {
    console.log(11111);
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(DepartmentEnt, 'department')
      .select(['department.id', 'department.header_id']);
    console.log(22222222);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.header_id) {
        queryBuilder.andWhere('department.header_id LIKE :header_id', {
          header_id: `%${pageDto.filter.header_id}%`,
        });
      }
    }
    console.log(333333333);
    if (pageDto.field) {
      const mapper = DepartmentMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${DepartmentMapperPagination[pageDto.field]}`,
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
