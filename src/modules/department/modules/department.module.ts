import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { DepartmentEnt } from './entities/department.entity';
import { DepartmentRepo } from './repositories/department.repository';
import { DepartmentService } from './services/department.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([DepartmentEnt])
  ],
  providers: [DepartmentService, DepartmentRepo],
  exports: [DepartmentService],
})
export class DepartmentModule {}
