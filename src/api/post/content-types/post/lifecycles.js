// Declarative Approach for LifeCycle Hooks
module.exports = {
    beforeCreate: async (event) => {
        // find the Admin who is about to create the post
        const { params } = event;
        const adminUserId = params.data.createdBy;

        // find the corresponding Author
        // in the below operation, we didnt use service layer bcoz there doesnt appear to be any way in service where we can apply filter that involves a relation. Hence we used entity service which allows this
        const author = (await strapi.entityService.findMany("api::author.author", {
            filters: {
                admin_user: adminUserId
            }
        }))[0];
        console.log('author',author);   // remove

        // update the data payload of the request for creating the new post by adding the Author to the 'authors' relation field
        console.log("before zzz",params.data.authors.connect); // remove
        params.data.authors.connect = [...params.data.authors.connect, author.id];
        console.log("after zzz",params.data.authors.connect); // remove
    }
}