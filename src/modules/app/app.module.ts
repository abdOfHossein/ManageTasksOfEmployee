import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwaggerService } from 'src/config/swagger/service/swagger.service';
import { DataSource } from 'typeorm';
import { DepartmentCoreModule } from '../department/department-core/department-core.module';
import { TaskCoreModule } from '../task/task-core/task-core.module';
import { UserCoreModule } from '../user/user-core/user-core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService, SwaggerService],
})
export class AppModule {}
