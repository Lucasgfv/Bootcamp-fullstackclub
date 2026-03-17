import 'dotenv/config'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import Fastify from 'fastify'
import { z } from 'zod' // Adicionado
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';




const app = Fastify({
  logger: true
}).withTypeProvider<ZodTypeProvider>() // Movido para a instância global

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Bootcamp API',
      description: 'API para bootcamp',
      version: '1.0.0',
    },
    servers: [{
        description: 'Development server',
        url: 'http://localhost:8080',
    }
],
  },
  transform: jsonSchemaTransform,

  // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
  //
  // transform: createJsonSchemaTransform({
  //   skipList: [ '/documentation/static/*' ]
  // })
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.route({
  method: 'GET',
  url: "/",
  schema: {
    description: "Hello world endpoint",
    tags: ["Hello"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: async () => { // Corrigido: ":" e "async"
    return {
      message: 'hello world'
    }
  }
});

try {
  await app.listen({ port: Number(process.env.PORT) || 8080 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}