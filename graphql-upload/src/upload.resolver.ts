import {
  Resolver,
  Mutation,
  Args,
  Query,
  ArgsType,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import Upload from 'graphql-upload/Upload.mjs';
import { Readable } from 'stream';

@ArgsType()
export class UploadInputArgs {
  @Field(() => GraphQLUpload)
  file!: Promise<Upload>;
}

@ObjectType()
export class UploadResponse {
  @Field(() => String)
  content!: String;
}

@Resolver()
export class UploadResolver {
  @Query(() => String)
  async hello(): Promise<string> {
    return 'Hello World!';
  }

  @Mutation(() => UploadResponse)
  async uploadFile(@Args() { file }: UploadInputArgs): Promise<any> {
    const { createReadStream } = await (file as any);
    const buffer = await this.streamToBuffer(createReadStream());
    return { content: buffer.toString('utf8') };
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    const buffer: Uint8Array[] = [];

    return new Promise((resolve, reject) =>
      stream
        .on('error', (error) => reject(error))
        .on('data', (data) => buffer.push(data))
        .on('end', () => resolve(Buffer.concat(buffer))),
    );
  }
}
