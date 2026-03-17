import 'dotenv/config'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import Fastify from 'fastify'
import { z } from 'zod' // Adicionado

const app = Fastify({
  logger: true
}).withTypeProvider<ZodTypeProvider>() // Movido para a instância global

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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