import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { TaskEnt } from 'src/modules/task/modules/entities/task.entity';
import { StatusTaskEnum } from 'src/modules/task/modules/enums/status-task.enum';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateRelTaskDto } from '../dtos/create.rel-task.dto';
import { UpdateRelTaskDto } from '../dtos/update.rel-task.dto';
import { RelTaskEnt } from '../entities/rel-task.entity';
import { RelTaskPageDto } from '../paginations/rel-task.page.dto';
import { RelTaskRepo } from '../repositories/rel-task.repository';
import { RelTaskCUDto } from '../result/rel-task.c.u.dto';
import { RelTaskGDto } from '../result/rel-task.g.dto';


@Injectable()
export class RelTaskService {
  constructor(private relTaskRepo: RelTaskRepo, private dataSource: DataSource) {}

  //create
  async _create(createDt: CreateRelTaskDto, query?: QueryRunner) {
    try {
      const taskSrc=await this.dataSource.getRepository(TaskEnt).findOne({where:{id:createDt.id_src}})
      createDt.srcEnt=taskSrc
      const taskRef=await this.dataSource.getRepository(TaskEnt).findOne({where:{id:createDt.id_ref}})
      createDt.refEnt=taskRef
      return await this.relTaskRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create RelTask err in service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: RelTaskEnt) {
    return new RelTaskCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    try {
      return await this.relTaskRepo._findOneEntity(searchDto, options);
    } catch (e) {
      console.log('readOne RelTask err in service', e);
      throw e;
    }
  }
  _resultGetOneDto(ent: RelTaskEnt) {
    return new RelTaskGDto(ent);
  }

  //update
  async _update(RelTask_Id: string, updateDt: UpdateRelTaskDto, query?: QueryRunner) {
    try {
      
      const relTaskEnt = <RelTaskEnt>await this._getOne(RelTask_Id);
      const taskSrc=await this.dataSource.getRepository(TaskEnt).findOne({where:{id:updateDt.id_src}})
      updateDt.srcEnt=taskSrc
      await this.dataSource.getRepository(TaskEnt).update({id:updateDt.id_src},{status:StatusTaskEnum.FORWARD})
      const taskRef=await this.dataSource.getRepository(TaskEnt).findOne({where:{id:updateDt.id_ref}})
      updateDt.refEnt=taskRef
      return await this.relTaskRepo._updateEntity(relTaskEnt, updateDt, query);
    } catch (e) {
      console.log('update RelTask err in service', e);
      throw e;
    }
  }
  _resultUpdateDto(ent: RelTaskEnt) {
    return new RelTaskCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    try {
      const relTaskEnt: any = await this._getOne(searchDto);
      if (!relTaskEnt) {
        throw new BadGatewayException({ message: 'RelTask does not exits' });
      }

      const result = await this.relTaskRepo._deleteEntity(relTaskEnt);
      return this._resultDeleteDto(result);
    } catch (e) {
      console.log('delete RelTask err in service', e);
      throw e;
    }
  }
  _resultDeleteDto(ent: RelTaskEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: RelTaskPageDto) {
    try {
      return await this.relTaskRepo._paginationEntity(pageDto);
    } catch (e) {
      console.log('pagination RelTask err in service', e);
      throw e;
    }
  }
}
