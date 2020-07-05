const postResolvers = require('./post');
const userResolvers = require('./user');
const commentsResolvers = require('./comments');

module.exports = {
  Post: {
    likeCount(parent) {
      return parent.likes.length;
    },
    commentCount(parent) {
      return parent.comments.length;
    },
  },
  Query: {
    ...postResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },

  Subscription: {
    ...postResolvers.Subscription,
  },
};
