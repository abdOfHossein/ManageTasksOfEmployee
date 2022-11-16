import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwaggerService } from 'src/config/swagger/service/swagger.service';
import { DataSource } from 'typeorm';
import appConfiguration from '../../config/configs/app-configuration';
import { DepartmentRlCoreModule } from '../department-rl/department-rl-core/department-rl-core.module';
import { DepartmentCoreModule } from '../department/department-core/department-core.module';
import { HashModule } from '../hash/hash.module';
import { ProjectCoreModule } from '../project/task-core/project-core.module';
import { RedisModule } from '../redis/redis.module';
import { RelTaskCoreModule } from '../rel-task/task-core/rel-task-core.module';
import { ReqCoreModule } from '../req/task-core/req-core.module';
import { RoleCoreModule } from '../role/user-core/role-core.module';
import { TaskBlockOperationCoreModule } from '../task-cblock-operation/task-core/task-block-operation-core.module';
import { TaskCoreModule } from '../task/task-core/task-core.module';
import { UserCoreModule } from '../user/user-core/user-core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [appConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        // ...defaultDatabaseOptions,
        name: 'connection_postgres',
        type: 'postgres',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_DATABASE || 'task',
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '774936188',
        entities: ['dist/**/*.entity.js', '**/*.entity.js'],
        migrations: ['dist/migrations/*{.ts,.js}'],
        synchronize: true,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UserCoreModule,
    DepartmentCoreModule,
    TaskCoreModule,
    TaskBlockOperationCoreModule,
    RelTaskCoreModule,
    ProjectCoreModule,
    ReqCoreModule,
    RoleCoreModule,
    DepartmentRlCoreModule,
    RedisModule.forRoot('127.0.0.1', 6379),
    HashModule,
  ],
  controllers: [AppController],
  providers: [AppService, SwaggerService],
})
export class AppModule {}
