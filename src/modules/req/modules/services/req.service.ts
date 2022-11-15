import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { ProjectEnt } from 'src/modules/project/modules/entities/project.entity';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateReqDto } from '../dtos/create.req.dto';
import { UpdateReqDto } from '../dtos/update.req.dto';
import { ReqEnt } from '../entities/req.entity';
import { ReqPageDto } from '../paginations/req.page.dto';
import { ReqRepo } from '../repositories/req.repository';
import { ReqCUDto } from '../result/req.c.u.dto';
import { ReqGDto } from '../result/req.g.dto';

@Injectable()
export class ReqService {
  constructor(private reqRepo: ReqRepo, private dataSource: DataSource) {}

  //create
  async _create(createDt: CreateReqDto, query?: QueryRunner) {
    try {
      const project=await this.dataSource.getRepository(ProjectEnt).findOne({where:{id:createDt.project_id}})
      createDt.projectEnt=project
      return await this.reqRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create Req err in service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: ReqEnt) {
    return new ReqCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    try {
      return await this.reqRepo._findOneEntity(searchDto, options);
    } catch (e) {
      console.log('readOne Req err in service', e);
      throw e;
    }
  }
  _resultGetOneDto(ent: ReqEnt) {
    return new ReqGDto(ent);
  }

  //update
  async _update(Req_Id: string, updateDt: UpdateReqDto, query?: QueryRunner) {
    try {
      const project=await this.dataSource.getRepository(ProjectEnt).findOne({where:{id:updateDt.project_id}})
      updateDt.projectEnt=project
      const reqEnt = <ReqEnt>await this._getOne(Req_Id);
      return await this.reqRepo._updateEntity(reqEnt, updateDt, query);
    } catch (e) {
      console.log('update Req err in service', e);
      throw e;
    }
  }
  _resultUpdateDto(ent: ReqEnt) {
    return new ReqCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    try {
      const rreqEnt: any = await this._getOne(searchDto);
      if (!rreqEnt) {
        throw new BadGatewayException({ message: 'Req does not exits' });
      }

      const result = await this.reqRepo._deleteEntity(rreqEnt);
      return this._resultDeleteDto(result);
    } catch (e) {
      console.log('delete Req err in service', e);
      throw e;
    }
  }
  _resultDeleteDto(ent: ReqEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: ReqPageDto) {
    try {
      return await this.reqRepo._paginationEntity(pageDto);
    } catch (e) {
      console.log('pagination Req err in service', e);
      throw e;
    }
  }
}
