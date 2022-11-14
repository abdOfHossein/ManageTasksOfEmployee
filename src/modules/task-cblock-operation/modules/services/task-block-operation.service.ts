import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { TaskEnt } from 'src/modules/task/modules/entities/task.entity';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateTaskBlockOperationDto } from '../dtos/create.task-block-operation.dto';
import { UpdateTaskBlockOperationDto } from '../dtos/update.task-block-operation.dto';
import { TaskBlockOperationEnt } from '../entities/task-block-operation.entity';
import { TaskBlockOperationPageDto } from '../paginations/task-block-operation.page.dto';
import { TaskBlockOperationRepo } from '../repositories/task-block-operation.repository';
import { TaskBlockOperationCUDto } from '../result/task-block-operation.c.u.dto';
import { TaskBlockOperationGDto } from '../result/task-block-operation.g.dto';

@Injectable()
export class TaskBlockOperationService {
  constructor(
    private taskBlockOperationRepo: TaskBlockOperationRepo,
    private dataSource: DataSource,
  ) {}

  //create
  async _create(createDt: CreateTaskBlockOperationDto, query?: QueryRunner) {
    try {
      const task = await this.dataSource
        .getRepository(TaskEnt)
        .findOne({ where: { id: createDt.id_task } });
      createDt.taskEnt = task;
      return await this.taskBlockOperationRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create TaskBlockOperation err in service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: TaskBlockOperationEnt) {
    return new TaskBlockOperationCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    try {
      return await this.taskBlockOperationRepo._findOneEntity(
        searchDto,
        options,
      );
    } catch (e) {
      console.log('readOne TaskBlockOperation err in service', e);
      throw e;
    }
  }
  _resultGetOneDto(ent: TaskBlockOperationEnt) {
    return new TaskBlockOperationGDto(ent);
  }

  //update
  async _update(
    TaskBlockOperation_Id: string,
    updateDt: UpdateTaskBlockOperationDto,
    query?: QueryRunner,
  ) {
    try {
      const task = await this.dataSource
      .getRepository(TaskEnt)
      .findOne({ where: { id: updateDt.id_task } });
      updateDt.taskEnt = task;
      const uerEnt = <TaskBlockOperationEnt>(
        await this._getOne(TaskBlockOperation_Id)
      );
      return await this.taskBlockOperationRepo._updateEntity(
        uerEnt,
        updateDt,
        query,
      );
    } catch (e) {
      console.log('update TaskBlockOperation err in service', e);
      throw e;
    }
  }
  _resultUpdateDto(ent: TaskBlockOperationEnt) {
    return new TaskBlockOperationCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    try {
      const taskBlockOperationEnt: any = await this._getOne(searchDto);
      if (!taskBlockOperationEnt) {
        throw new BadGatewayException({
          message: 'TaskBlockOperation does not exits',
        });
      }

      const result = await this.taskBlockOperationRepo._deleteEntity(
        taskBlockOperationEnt,
      );
      return this._resultDeleteDto(result);
    } catch (e) {
      console.log('delete TaskBlockOperation err in service', e);
      throw e;
    }
  }
  _resultDeleteDto(ent: TaskBlockOperationEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: TaskBlockOperationPageDto) {
    try {
      return await this.taskBlockOperationRepo._paginationEntity(pageDto);
    } catch (e) {
      console.log('pagination TaskBlockOperation err in service', e);
      throw e;
    }
  }
}
