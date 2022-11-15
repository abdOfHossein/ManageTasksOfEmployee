import { BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateDepartmentRlDto } from '../dtos/create.department-rl.dto';
import { UpdateDepartmentRlDto } from '../dtos/update.department-rl.dto';
import { DepartmentRlEnt } from '../entities/department-rl.entity';
import { DepartmentRlMapperPagination } from '../mapper/department-rl.mapper.pagination';
import { DepartmentRlPageDto } from '../paginations/department-rl.page.dto';

export class DepartmentRlRepo {
  constructor(
    @InjectRepository(DepartmentRlEnt)
    private dataSource: DataSource,
  ) {}

  //create
  async _createEntity(
    createDto: CreateDepartmentRlDto,
    query: QueryRunner | undefined,
  ): Promise<DepartmentRlEnt> {
    const departmentRlEnt = new DepartmentRlEnt();
    departmentRlEnt.req = createDto.reqEnt;
    departmentRlEnt.department = createDto.departmentEnt;
    if (query) return await query.manager.save(departmentRlEnt);
    return await this.dataSource.manager.save(departmentRlEnt);
  }

  //readOne
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<Object> {
    const DepartmentRl = await this.dataSource.manager.findOne(
      DepartmentRlEnt,
      {
        where: { id: searchDto },
      },
    );
    if (!DepartmentRl) {
      throw new BadGatewayException({ message: 'DepartmentRl does not exits' });
    }
    return DepartmentRl;
  }

  //update
  async _updateEntity(
    entity: DepartmentRlEnt,
    updateDto: UpdateDepartmentRlDto,
    query?: QueryRunner,
  ): Promise<DepartmentRlEnt> {
    entity.req = updateDto.reqEnt;
    entity.department = updateDto.departmentEnt;
    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  //delete
  async _deleteEntity(
    entity: DepartmentRlEnt,
    query?: QueryRunner,
  ): Promise<DepartmentRlEnt> {
    if (query) return await query.manager.remove(entity);
    return await this.dataSource.manager.remove(entity);
  }

  //pagination
  async _paginationEntity(
    pageDto: DepartmentRlPageDto,
  ): Promise<PageDto<DepartmentRlEnt>> {
    console.log(11111);
    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(DepartmentRlEnt, 'department_rl')
      .select(['department_rl.id']);
    console.log(22222222);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    // if (pageDto.filter) {
    //   if (pageDto.filter.department_rl_name) {
    //     queryBuilder.andWhere(
    //       'department_rl.department_rl_name LIKE :department_rl_name',
    //       {
    //         department_rl_name: `%${pageDto.filter.department_rl_name}%`,
    //       },
    //     );
    //   }
    // }
    console.log(333333333);
    if (pageDto.field) {
      const mapper = DepartmentRlMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${DepartmentRlMapperPagination[pageDto.field]}`,
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
