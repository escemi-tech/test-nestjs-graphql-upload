import { INestApplication } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

export function initNestApplication(app: INestApplication) {
  app.use(graphqlUploadExpress());
}
