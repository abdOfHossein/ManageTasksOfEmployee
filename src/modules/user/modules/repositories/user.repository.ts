import { BadGatewayException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page.meta.dto';
import { PublicFunc } from 'src/common/function/public.func';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';
import { LoginUserDto } from '../dtos/login.user.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserEnt } from '../entities/user.entity';
import { UserMapperPagination } from '../mapper/user.mapper.pagination';
import { UserPageDto } from '../paginations/user.page.dto';

export class UserRepo {
  constructor(
    @InjectRepository(UserEnt)
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  //register
  async _createEntity(
    createDto: CreateUserDto,
    query: QueryRunner | undefined,
  ): Promise<UserEnt> {
    const userEnt = new UserEnt();
    userEnt.first_name = createDto.first_name;
    userEnt.role = createDto.roleEnt;
    userEnt.email = createDto.email;
    userEnt.last_name = createDto.last_name;
    userEnt.password = createDto.password;
    userEnt.phonenumber = createDto.phonenumber;
    userEnt.username = createDto.username;
    userEnt.department = createDto.departmentEnt;
    if (query) return await query.manager.save(userEnt);

    return await this.dataSource.manager.save(userEnt);
  }

  //validate User
  async __validateUserEntity(
    loginUserDto: LoginUserDto,
    options?: FindOneOptions,
  ): Promise<UserEnt> {
    const user = await this.dataSource.manager.findOne(UserEnt, {
      where: { username: loginUserDto.username },
    });
    if (user && loginUserDto.password == user.password) {
      return user;
    }
    return null;
  }

  // create Token => login
  async _loginEntity(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //readOne
  async _findOneEntity(
    searchDto: string,
    options?: FindOneOptions,
  ): Promise<Object> {
    const result = await this.dataSource.manager.findOne(UserEnt, {
      where: { id: searchDto },
    });
    if (!result) {
      throw new BadGatewayException({ message: 'user does not exits' });
    }
    return result;
  }

  //update
  async _updateEntity(
    entity: UserEnt,
    updateDto: UpdateUserDto,
    query?: QueryRunner,
  ): Promise<UserEnt> {
    entity.department = updateDto.departmentEnt;
    entity.first_name = updateDto.first_name;
    entity.email = updateDto.email;
    entity.last_name = updateDto.last_name;
    entity.password = updateDto.password;
    entity.role = updateDto.roleEnt;
    entity.phonenumber = updateDto.phonenumber;
    entity.username = updateDto.username;

    if (query) return await query.manager.save(entity);
    return await this.dataSource.manager.save(entity);
  }

  //delete
  async _deleteEntity(entity: UserEnt, query?: QueryRunner): Promise<UserEnt> {
    if (query) return await query.manager.remove(entity);
    return await this.dataSource.manager.remove(entity);
  }

  //pagination
  async _paginationEntity(pageDto: UserPageDto): Promise<PageDto<UserEnt>> {
    console.log(11111);

    const queryBuilder = this.dataSource.manager
      .createQueryBuilder(UserEnt, 'user')
      .select([
        'user.id',
        'user.username',
        'user.first_name',
        'user.last_name',
      ]);
    console.log(22222222);
    if (pageDto.base) {
      const row = pageDto.base.row;
      const skip = PublicFunc.skipRow(pageDto.base.page, pageDto.base.row);
      queryBuilder.skip(skip).take(row);
    }

    if (pageDto.filter) {
      if (pageDto.filter.username) {
        queryBuilder.andWhere('user.username LIKE :username', {
          username: `%${pageDto.filter.username}%`,
        });
      }
      if (pageDto.filter.first_name) {
        queryBuilder.andWhere('user.first_name LIKE :first_name', {
          first_name: `%${pageDto.filter.first_name}%`,
        });
      }
      if (pageDto.filter.username) {
        queryBuilder.andWhere('user.last_name LIKE :last_name', {
          last_name: `%${pageDto.filter.last_name}%`,
        });
      }
    }
    console.log(333333333);
    if (pageDto.field) {
      const mapper = UserMapperPagination[pageDto.field];
      if (!mapper)
        throw new Error(
          `${JSON.stringify({
            section: 'public',
            value: 'Column Not Exist',
          })}`,
        );
      queryBuilder.addOrderBy(
        `${UserMapperPagination[pageDto.field]}`,
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
