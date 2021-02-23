var { PubSub } =require ( 'graphql-subscriptions' );
const pubsub = new PubSub(); //create a PubSub instance
const CHANNEL_ADDED_TOPIC = 'newChannel';

const express =require('express') ;
const cors =require('cors') ;
const {
  graphqlExpress,
  graphiqlExpress,
} =require('apollo-server-express') ;
const bodyParser =require('body-parser') ;
const { execute, subscribe } =require('graphql') ;
const { createServer } =require('http') ;
const { SubscriptionServer } =require('subscriptions-transport-ws') ;




const { schema } =require('./src/schema') ;
const resolver=require( './src/resolvers');


const PORT = 7779;
const server = express();

// server.use('*', cors({ origin: 'http://localhost:7800' }));

server.use(bodyParser.json())
server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema 
}));

server.use(
  '/graphql',
  graphqlExpress({
    schema
  })
);

server.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
  })
);

const ws = createServer(server);
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
    onConnect: () => console.log("Client connected!")
  }, {
    server: ws,
    path: '/subscriptions',
  });
});

