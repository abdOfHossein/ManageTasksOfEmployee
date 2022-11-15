import { BadGatewayException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateRoleDto } from '../dtos/create.role.dto';
import { UpdateRoleDto } from '../dtos/update.role.dto';
import { RoleEnt } from '../entities/role.entity';
import { RoleMapperPagination } from '../mapper/role.mapper.pagination';
import { RolePageDto } from '../paginations/role.page.dto';

export class RoleRepo {
  constructor(
    @InjectRepository(RoleEnt)
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  //create
  async _createEntity(
    createDto: CreateRoleDto,
    query: QueryRunner | undefined,
  ): Promise<RoleEnt> {
    const roleEnt = new RoleEnt();
    roleEnt.role_type = createDto.role_type;
    if (query) return await query.manager.save(roleEnt);
    return await this.dataSource.manager.save(roleEnt);
  }

  //readOne
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<Object> {
    const result = await this.dataSource.manager.findOne(RoleEnt, {
      where: { id: searchDto },
    });
    if (!result) {
      throw new BadGatewayException({ message: 'Role does not exits' });
    }
    return result;
  }

  //delete
  async _deleteEntity(entity: RoleEnt, query?: QueryRunner): Promise<RoleEnt> {
    if (query) return await query.manager.remove(entity);
    return await this.dataSource.manager.remove(entity);
  }

  //pagination
  async _paginationEntity(pageDto: RolePageDto): Promise<PageDto<RoleEnt>> {
    console.log(11111);

    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(RoleEnt, 'role')
      .select([
        'role.id',
        'role.role_type',
      ]);
    console.log(22222222);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.role_type) {
        queryBuilder.andWhere('role.role_type LIKE :role_type', {
          role_type: `%${pageDto.filter.role_type}%`,
        });
      }
    }
    console.log(333333333);
    if (pageDto.field) {
      const mapper = RoleMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${RoleMapperPagination[pageDto.field]}`,
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
