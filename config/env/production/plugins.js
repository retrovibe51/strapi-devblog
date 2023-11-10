module.exports = ({ env }) => ({
    email: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.example.com'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
        secure: true
      },
      settings: {
        defaultFrom: 'weinschel@smartshore.nl',
        defaultReplyTo: 'weinschel@smartshore.nl',
      },
    },
});