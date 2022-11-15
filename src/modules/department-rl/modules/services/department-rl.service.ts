import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { DepartmentEnt } from 'src/modules/department/modules/entities/department.entity';
import { ReqEnt } from 'src/modules/req/modules/entities/req.entity';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateDepartmentRlDto } from '../dtos/create.department-rl.dto';
import { UpdateDepartmentRlDto } from '../dtos/update.department-rl.dto';
import { DepartmentRlEnt } from '../entities/department-rl.entity';
import { DepartmentRlPageDto } from '../paginations/department-rl.page.dto';
import { DepartmentRlRepo } from '../repositories/department-rl.repository';
import { DepartmentRlCUDto } from '../result/department-rl.c.u.dto';
import { DepartmentRlGDto } from '../result/department-rl.g.dto';

@Injectable()
export class DepartmentRlService {
  constructor(
    private DepartmentRlRepo: DepartmentRlRepo,
    private dataSource: DataSource,
  ) {}

  //create
  async _create(createDt: CreateDepartmentRlDto, query?: QueryRunner) {
    try {
      return await this.DepartmentRlRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create DepartmentRl err in service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: DepartmentRlEnt) {
    return new DepartmentRlCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    try {
      return await this.DepartmentRlRepo._findOneEntity(searchDto, options);
    } catch (e) {
      console.log('readOne DepartmentRl err in service', e);
      throw e;
    }
  }
  _resultGetOneDto(ent: DepartmentRlEnt) {
    return new DepartmentRlGDto(ent);
  }

  //update
  async _update(
    DepartmentRl_Id: string,
    updateDt: UpdateDepartmentRlDto,
    query?: QueryRunner,
  ) {
    try {
      const req = await this.dataSource
        .getRepository(ReqEnt)
        .findOne({ where: { id: updateDt.req_id } });
      updateDt.reqEnt = req;
      const department = await this.dataSource
        .getRepository(DepartmentEnt)
        .findOne({ where: { id: updateDt.department_id } });
      updateDt.departmentEnt = department;

      const DepartmentRlEnt = <DepartmentRlEnt>(
        await this._getOne(DepartmentRl_Id)
      );
      return await this.DepartmentRlRepo._updateEntity(
        DepartmentRlEnt,
        updateDt,
        query,
      );
    } catch (e) {
      console.log('update DepartmentRl err in service', e);
      throw e;
    }
  }
  _resultUpdateDto(ent: DepartmentRlEnt) {
    return new DepartmentRlCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    try {
      const departmentRlEnt: any = await this._getOne(searchDto);
      if (!departmentRlEnt) {
        throw new BadGatewayException({
          message: 'DepartmentRl does not exits',
        });
      }

      // delete relation => Reqs
      await this.dataSource
        .getRepository(ReqEnt)
        .delete({ department_rls: departmentRlEnt });

      const result = await this.DepartmentRlRepo._deleteEntity(departmentRlEnt);
      return this._resultDeleteDto(result);
    } catch (e) {
      console.log('delete DepartmentRl err in service', e);
      throw e;
    }
  }
  _resultDeleteDto(ent: DepartmentRlEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: DepartmentRlPageDto) {
    try {
      return await this.DepartmentRlRepo._paginationEntity(pageDto);
    } catch (e) {
      console.log('pagination DepartmentRl err in service', e);
      throw e;
    }
  }
}
