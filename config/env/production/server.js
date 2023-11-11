module.exports = ({env}) => ({
    url: env("PUBLIC_SERVER_URL", "")     // replaced by earlier value: env("RENDER_EXTERNAL_URL", "") which used to get set automatically by render.com site as env variable
})