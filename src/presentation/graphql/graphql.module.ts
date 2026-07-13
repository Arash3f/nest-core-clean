import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { AuthGraphqlModule } from "@presentation/graphql/modules/auth/auth.module"
import { UserGraphqlModule } from "@presentation/graphql/modules/user/user.module"
import type { ErrorResponseBody } from "@presentation/http/common/filters/core-exception.type"
import type { Request, Response } from "express"
import type { GraphQLFormattedError } from "graphql"

@Module({
  imports: [
    AuthGraphqlModule,
    UserGraphqlModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      sortSchema: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      formatError: (formattedError: GraphQLFormattedError) => {
        const originalError = formattedError.extensions?.originalError as
          | ErrorResponseBody
          | undefined

        if (!originalError) return formattedError

        return {
          ...formattedError,
          message: originalError.message,
          extensions: originalError,
        }
      },
    }),
  ],
})
export class GraphqlPresentationModule {}
