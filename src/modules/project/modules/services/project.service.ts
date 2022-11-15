import { BadGatewayException, Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { ReqEnt } from 'src/modules/req/modules/entities/req.entity';
import { DataSource, FindOneOptions, QueryRunner } from 'typeorm';
import { CreateProjectDto } from '../dtos/create.project.dto';
import { UpdateProjectDto } from '../dtos/update.project.dto';
import { ProjectEnt } from '../entities/project.entity';
import { ProjectPageDto } from '../paginations/project.page.dto';
import { ProjectRepo } from '../repositories/project.repository';
import { ProjectCUDto } from '../result/project.c.u.dto';
import { ProjectGDto } from '../result/project.g.dto';

@Injectable()
export class ProjectService {
  constructor(
    private projectRepo: ProjectRepo,
    private dataSource: DataSource,
  ) {}

  //create
  async _create(createDt: CreateProjectDto, query?: QueryRunner) {
    try {
      return await this.projectRepo._createEntity(createDt, query);
    } catch (e) {
      console.log('create Project err in service', e);
      throw e;
    }
  }
  _resultCreateDto(ent: ProjectEnt) {
    return new ProjectCUDto(ent);
  }

  //readOne
  async _getOne(searchDto: string, options?: FindOneOptions) {
    try {
      return await this.projectRepo._findOneEntity(searchDto, options);
    } catch (e) {
      console.log('readOne Project err in service', e);
      throw e;
    }
  }
  _resultGetOneDto(ent: ProjectEnt) {
    return new ProjectGDto(ent);
  }

  //update
  async _update(
    Project_Id: string,
    updateDt: UpdateProjectDto,
    query?: QueryRunner,
  ) {
    try {
      const projectEnt = <ProjectEnt>await this._getOne(Project_Id);
      return await this.projectRepo._updateEntity(projectEnt, updateDt, query);
    } catch (e) {
      console.log('update Project err in service', e);
      throw e;
    }
  }
  _resultUpdateDto(ent: ProjectEnt) {
    return new ProjectCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    try {
      const projectEnt: any = await this._getOne(searchDto);
      if (!projectEnt) {
        throw new BadGatewayException({ message: 'Project does not exits' });
      }

      // delete relation => Reqs
      await this.dataSource
        .getRepository(ReqEnt)
        .delete({ project: projectEnt });

      const result = await this.projectRepo._deleteEntity(projectEnt);
      return this._resultDeleteDto(result);
    } catch (e) {
      console.log('delete Project err in service', e);
      throw e;
    }
  }
  _resultDeleteDto(ent: ProjectEnt) {
    return new SuccessDto(true);
  }

  //pagination
  async _pagination(pageDto: ProjectPageDto) {
    try {
      return await this.projectRepo._paginationEntity(pageDto);
    } catch (e) {
      console.log('pagination Project err in service', e);
      throw e;
    }
  }
}
