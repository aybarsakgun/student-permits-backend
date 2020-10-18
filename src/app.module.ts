import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import typeOrmConfig from './ormconfig';
import { SchoolsModule } from './schools/schools.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'build'),
      exclude: ['/auth/*', '/graphql'],
    }),
    AuthModule,
    UsersModule,
    SchoolsModule,
    ClassesModule,
    ServicesModule,
  ],
})
export class AppModule {}
