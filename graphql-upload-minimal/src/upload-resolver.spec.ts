import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { contentType } from 'mime-types';
import { extname } from 'path';
import * as supertest from 'supertest';
import { AppModule } from './app.module';
import { initNestApplication } from './init-application';

describe('UploadResolver', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    initNestApplication(app);

    await app.init();

    httpServer = app.getHttpServer();
  });

  const graphql = (query: string, variables: { [x: string]: any } = {}) => {
    const map = Object.assign(
      {},
      Object.keys(variables).map((key) => [`variables.${key}`]),
    );

    const operationsVariables = Object.assign(
      {},
      ...Object.keys(variables).map((key) => ({ [key]: null })),
    );

    const request = supertest(httpServer)
      .post('/graphql')
      .set('Apollo-Require-Preflight', 'true')
      .set('Content-Type', 'multipart/form-data')
      .field(
        'operations',
        JSON.stringify({ query, variables: operationsVariables }),
      )
      .field('map', JSON.stringify(map));

    Object.values(variables).forEach((value, i) => {
      if (contentType(extname(value))) {
        request.attach(`${i}`, value);
      } else {
        request.field(`${i}`, value);
      }
    });

    return request;
  };

  describe('Upload', () => {
    it('should return a file content after uploading one', async () => {
      const res = await graphql(
        /* GraphQL */ `
          mutation ($file: Upload!) {
            uploadFile(file: $file) {
              content
            }
          }
        `,
        { file: __dirname + '/test.csv' },
      );

      expect(res.body.errors).toBeUndefined();

      expect(res.body.data.uploadFile.content).toEqual(
        readFileSync(__dirname + '/test.csv').toString(),
      );
    }, 60000);
  });
});
