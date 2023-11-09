'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async exampleAction(ctx) {
      await strapi.service("api::post.post").exampleService({ myParam: "example" });
      try {
        ctx.body = 'ok';
      } catch (err) {
        ctx.body = err;
      }
    },
  
    // // Solution 1: fetched all posts and filtered them afterwards
    // async find(ctx) {
    //   // fetching all posts (including premium ones)
    //   const { data, meta } = await super.find(ctx);
    //   if(ctx.state.user) {
    //     return { data, meta };
    //   }
    //   // not authenticated
    //   const filteredData = data.filter((post) => !post.attributes.premium)
    //   return { data: filteredData, meta };
    // },

    // // Solution 2: rewrite the action to fetch only needed posts
    // async find(ctx) {
    //   // if the request is authenticated
    //   const isRequestingNonPremium = ctx.query.filters && ctx.query.filters['premium'] == false;
    //   if(ctx.state.user) {
    //     return await super.find(ctx);
    //   }

    //   // if the request is public
    //   const { query } = ctx;
    //   const filteredPosts = await strapi.service("api::post.post").find({
    //     ...query,
    //     filters: {
    //       // ...query.filters,    // commented bcoz giving compilation error
    //       premium: false
    //     }
    //   });
    //   const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);
    //   return this.transformResponse(sanitizedPosts);
    // },

    async find(ctx) {
      // if the request is authenticated or explicitly asking for public content only
      const isRequestingNonPremium = ctx.query.filters && ctx.query.filters['premium'] == false;
      if(ctx.state.user) {
        return await super.find(ctx);
      }

      // if the request is public
      const publicPosts = await strapi.service("api::post.post").findPublic(ctx.query);
      const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);
      return this.transformResponse(sanitizedPosts);

    },
  
    // // Method 3: Replacing a core action with proper sanitization
    // async findOne(ctx) {
    //     console.log("ctx params",ctx.params);
    //     console.log("ctx query",ctx.query);
    //     const { id } = ctx.params;
    //     const { query } = ctx;

    //     const entity = await strapi.service('api::post.post').findOne(id, query);
    //     console.log("entity",entity);
    //     const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    //     console.log("sanitizedEntity", sanitizedEntity);
  
    //   return this.transformResponse(sanitizedEntity);
    // }

    // Method 3: Replacing a core action with proper sanitization
    async findOne(ctx) {
      if(ctx.state.user) {
        return await super.findOne(ctx);
      }
      const { id } = ctx.params;
      const { query } = ctx;
      const postIfPublic = await strapi.service("api::post.post").findOneIfPublic({
        id, query
      });
      const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx);
      return this.transformResponse(sanitizedEntity);
    },

    async likePost(ctx) {
      console.log("entered controller");  // remove
      const user = ctx.state.user;  // user trying to like the post
      const postId = ctx.params.id; // the post that's being liked
      const { query } = ctx;
      const updatedPost = await strapi.service("api::post.post").likePost({
        postId, userId: user.id, query
      });
      const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
      return this.transformResponse(sanitizedEntity);
    }
}));
