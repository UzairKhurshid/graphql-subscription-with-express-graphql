const { PubSub } =require('graphql-subscriptions') ;


const pubsub = new PubSub(); //create a PubSub instance
const CHANNEL_ADDED_TOPIC = 'newChannel';

const channels = [{
  id: 1,
  name: 'soccer',
}, {
  id: 2,
  name: 'baseball',
}];

let nextId = 3;

const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return channels.find(channel => channel.id == id);
    },
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: nextId++, name: args.name };
      channels.push(newChannel);
      pubsub.publish('channelAdded', { channelAdded: newChannel });  // publish to a topic
      return newChannel;
    },
  },
  Subscription: {
    channelAdded: {  // create a channelAdded subscription resolver function.
      subscribe: () => pubsub.asyncIterator('channelAdded')  // subscribe to changes in a topic
    }
  }
};


module.exports={resolvers}
