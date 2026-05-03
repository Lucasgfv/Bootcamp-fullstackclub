import 'dotenv/config'
import Fastify, { fastify } from 'fastify'

import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

const app = Fastify({
  logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: "/", //rota raiz
    schema: {
        description: "Hello World",
        tags: ["Hello World"],
        response: {
            200: z.object({
                message: z.string(),
            }),
        },
    },
    handler: (req, res) => {
        res.send({message: "Hello World"})
    }
});

    
  
try {
  await app.listen({ port: Number (process.env.PORT || 8081)})
} catch (err) {
  app.log.error(err)
  process.exit(1)
}