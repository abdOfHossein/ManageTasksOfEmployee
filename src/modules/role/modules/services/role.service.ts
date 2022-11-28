import { Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateRoleDto } from '../dtos/create.role.dto';
import { UpdateRoleDto } from '../dtos/update.role.dto';
import { RoleEnt } from '../entities/role.entity';
import { RolePageDto } from '../paginations/role.page.dto';
import { RoleRepo } from '../repositories/role.repository';
import { RoleCUDto } from '../result/role.c.u.dto';
import { RoleGDto } from '../result/role.g.dto';

@Injectable()
export class RoleService {
  constructor(private dataSource: DataSource, private roleRepo: RoleRepo) {}

  //create
  async _create(createDt: CreateRoleDto, query?: QueryRunner) {
    try {
      return await this.roleRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create err in Service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: RoleEnt) {
    return new RoleCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    return await this.roleRepo._findOneEntity(searchDto, options);
  }
  _resultGetOneDto(ent: RoleEnt) {
    return new RoleGDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    const roleEnt = await this.dataSource
      .getRepository(RoleEnt)
      .findOne({ where: { id: searchDto } });
    const result = await this.roleRepo._deleteEntity(roleEnt);
    return this._resultDeleteDto(result);
  }
  _resultDeleteDto(ent: RoleEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: RolePageDto) {
    return await this.roleRepo._paginationEntity(pageDto);
  }
}
