// import { app } from './app';

// app.get<{
//   Params: { id: string };
//   Reply: { hello: string };
// }>('/test/:id', async (request, reply) => {
//   const id = request.params.id;
//   request.log.debug({ test: 'asdf', tester: app.tester }, 'Hello');
//   // reply.send({ hello: id });
//   return { hello: 'asdf' };
// });

// app.post<{
//   Params: { id: string };
//   Reply: { howdy: string };
//   Body: {
//     goodbye: string;
//   };
// }>(
//   '/test/:id',
//   {
//     schema: {
//       response: {
//         200: {
//           type: 'object',
//           properties: {
//             howdy: {
//               type: 'string',
//             },
//           },
//         },
//       },
//       body: {
//         required: ['goodbye'],
//         type: 'object',
//         properties: {
//           goodbye: { type: 'string' },
//         },
//       },
//     },
//   },
//   async (request, reply) => {
//     const { goodbye } = request.body;

//     request.log.debug({ goodbye }, 'Goodbye');

//     return {
//       howdy: goodbye,
//     };
//   },
// );
