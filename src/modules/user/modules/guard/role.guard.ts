import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnt } from 'src/modules/role/modules/entities/role.entity';
import { RoleTypeEnum } from 'src/modules/role/modules/enum/role.enum';
import { DataSource } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      console.log(request);
      const user = request.user;
      console.log(user.roles.id);
      const role = await this.dataSource.getRepository(RoleEnt).findOne({
        where: {
          id: user.roles.id,
        },
      })
      if (role.role_type == RoleTypeEnum.ADMIN) {
          console.log('here');
          
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
