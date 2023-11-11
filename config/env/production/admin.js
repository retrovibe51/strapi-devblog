module.exports = ({env}) => {

    return {
        /* We are assuming that if PUBLIC_ADMIN_URL isn't set (which will be a separate dedicated public url for it), then the admin panel should be
            served by the same strapi server (which serves the API), which means it will fall back to the 'dashboard' configuration */
        url: env("PUBLIC_ADMIN_URL", "/dashboard"),
        serveAdminPanel: (env("PUBLIC_ADMIN_URL") === undefined)
    }

}