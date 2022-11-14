import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { UserEnt } from 'src/modules/user/modules/entities/user.entity';

import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateDepartmentDto } from '../dtos/create.department.dto';
import { UpdateDepartmentDto } from '../dtos/update.department.dto';
import { DepartmentEnt } from '../entities/department.entity';
import { DepartmentPageDto } from '../paginations/department.page.dto';
import { DepartmentRepo } from '../repositories/department.repository';
import { DepartmentCUDto } from '../result/department.c.u.dto';
import { DepartmentGDto } from '../result/department.g.dto';
@Injectable()
export class DepartmentService {
  constructor(
    private departmentRepo: DepartmentRepo,
    private dataSource: DataSource,
  ) {}

  //create
  async _create(createDt: CreateDepartmentDto, query?: QueryRunner) {
    try {
      return await this.departmentRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create department err in service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: DepartmentEnt) {
    return new DepartmentCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    try {
      return await this.departmentRepo._findOneEntity(searchDto, options);
    } catch (e) {
      console.log('readOne department err in service', e);
      throw e;
    }
  }
  _resultGetOneDto(ent: DepartmentEnt) {
    return new DepartmentGDto(ent);
  }

  //update
  async _update(
    Department_Id: string,
    updateDt: UpdateDepartmentDto,
    query?: QueryRunner,
  ) {
    try {
      const uerEnt = <DepartmentEnt>await this._getOne(Department_Id);
      return await this.departmentRepo._updateEntity(uerEnt, updateDt, query);
    } catch (e) {
      console.log('update department err in service', e);
      throw e;
    }
  }
  _resultUpdateDto(ent: DepartmentEnt) {
    return new DepartmentCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    try {
      const departmentEnt: any = await this._getOne(searchDto);
      if (!departmentEnt) {
        throw new BadGatewayException({ message: 'department does not exits' });
      }
      await this.dataSource
        .getRepository(UserEnt)
        .delete({ department: departmentEnt });
      const result = await this.departmentRepo._deleteEntity(departmentEnt);
      return this._resultDeleteDto(result);
    } catch (e) {
      console.log('delete department err in service', e);
      throw e;
    }
  }
  _resultDeleteDto(ent: DepartmentEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: DepartmentPageDto) {
    try {
      return await this.departmentRepo._paginationEntity(pageDto);
    } catch (e) {
      console.log('pagination department err in service', e);
      throw e;
    }
  }
}
