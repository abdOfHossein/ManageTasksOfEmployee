import { Injectable } from '@nestjs/common';
import { SuccessDto } from 'src/common/result/success.dto';
import { FindOneOptions, QueryRunner } from 'typeorm';
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
  constructor(private userRepo: UserRepo) {}

  //register
  async _create(createDt: CreateUserDto, query?: QueryRunner) {
    try {
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
  async _login(loginUserDto: LoginUserDto, options?: FindOneOptions) {
    try {
      return await this.userRepo._loginEntity(loginUserDto, options);
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
    const uerEnt = <UserEnt>await this._getOne(User_Id);
    return await this.userRepo._updateEntity(uerEnt, updateDt, query);
  }
  _resultUpdateDto(ent: UserEnt) {
    return new UserCUDto(ent);
  }

  //delete
  async _delete(searchDto: string, query?: QueryRunner) {
    const userEnt = await this._getOne(searchDto);
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
