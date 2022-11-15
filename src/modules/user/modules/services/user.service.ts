import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';
import { LoginUserDto } from '../dtos/login.user.dto';
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UserEnt } from '../entities/user.entity';
import { UserPageDto } from '../paginations/user.page.dto';
import { UserRepo } from '../repositories/user.repository';
import { UserCUDto } from '../result/user.c.u.dto';
import { UserGDto } from '../result/user.g.dto';

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource, private userRepo: UserRepo) {}

  //register
  async _create(createDt: CreateUserDto, query?: QueryRunner) {
    try {
      const departmentEnt = await this.dataSource
        .getRepository(DepartmentEnt)
        .findOne({ where: { id: createDt.id_department } });
      const roleEnt = await this.dataSource
        .getRepository(RoleEnt)
        .findOne({ where: { id: createDt.id_role } });
      if (!departmentEnt || !roleEnt) {
        throw new BadGatewayException({
          message: 'there is no department for this user',
        });
      }

      createDt.departmentEnt = departmentEnt;
      createDt.roleEnt = roleEnt;
      return await this.userRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('register err in Service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: UserEnt) {
    return new UserCUDto(ent);
  }

  //login
  async _login(user: any) {
    try {
      return await this.userRepo._loginEntity(user);
    } catch (e) {
      console.log('login err in Service ', e);
    }
  }
  _resultLoginDto(ent: UserEnt) {
    return new UserGDto(ent);
  }

  //validate user
  async _validateUser(loginUserDto: LoginUserDto, options?: FindOneOptions) {
    try {
      return await this.userRepo.__validateUserEntity(loginUserDto, options);
    } catch (e) {
      console.log('_validateUser err in Service ', e);
    }
  }
  _resultValidateUserDto(ent: UserEnt) {
    return new UserGDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.userRepo._findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: UserEnt) {
    return new UserGDto(ent);
  }

  //update
  async _update(User_Id: string, updateDt: UpdateUserDto, query?: QueryRunner) {
    const departmentEnt = await this.dataSource
      .getRepository(DepartmentEnt)
      .findOne({ where: { id: updateDt.id_department } });

    const roleEnt = await this.dataSource
      .getRepository(RoleEnt)
      .findOne({ where: { id: updateDt.id_role } });
    if (!departmentEnt || !roleEnt) {
      throw new BadGatewayException({
        message: 'there is no department for this user',
      });
    }

    updateDt.roleEnt = roleEnt;
    updateDt.departmentEnt = departmentEnt;
    const uerEnt = <UserEnt>await this._getOne(User_Id);
    return await this.userRepo._updateEntity(uerEnt, updateDt, query);
  }
  _resultUpdateDto(ent: UserEnt) {
    return new UserCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    const userEnt: any = await this._getOne(searchDto);
    if (!userEnt) {
      throw new BadGatewayException({ message: 'user does not exits' });
    }
    const result = await this.userRepo._deleteEntity(userEnt);

    return this._resultDeleteDto(result);
  }
  _resultDeleteDto(ent: UserEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: UserPageDto) {
    return await this.userRepo._paginationEntity(pageDto);
  }
}
