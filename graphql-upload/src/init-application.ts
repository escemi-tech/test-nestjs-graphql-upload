import { INestApplication } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

export function initNestApplication(app: INestApplication) {
  app.use(graphqlUploadExpress());
}
