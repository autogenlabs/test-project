module.exports = {
    apps: [{
        script  : 'app.js',
        watch   : '.',
        ignore_watch: [
            "node_modules",
            "logs",
            ".git",
        ],
        exp_backoff_restart_delay: 5000,
        env_dev : {
            name                                 : 'api-boilerplate-development',
            NODE_ENV                             : 'development',
            PORT                                 : 4444,
            JWT_SECRET                           : "mysercethwt",
            JWT_ACCESS_EXPIRATION_MINUTES        : 44,
            JWT_REFRESH_EXPIRATION_DAYS          : 1,
            JWT_RESET_PASSWORD_EXPIRATION_MINUTES: 44,
            JWT_VERIFY_EMAIL_EXPIRATION_MINUTES  : 44,
            SMTP_HOST                            : 'ep-bitter-dream-a4lezj98-pooler.us-east-1.aws.neon.tech',
            SMTP_PORT                            : 587,
            SMTP_USERNAME                        : 'd019868211d229',
            SMTP_PASSWORD                        : 'uG3zdt1YMWlq',
            EMAIL_FROM                           : 'fms@fms.fms',
            DATABASE_URL                         : 'postgres://default:2CliBZwps7GE@ep-bitter-dream-a4lezj98.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require',
        },
        env_test: {
            name        : "api-boilerplate-test",
            PORT        : 4445,
            NODE_ENV    : "test",
            TOKEN_SECRET: "Malatya44"
        },
        env_prod: {
            name        : "api-boilerplate-prod",
            PORT        : 4446,
            NODE_ENV    : "production",
            TOKEN_SECRET: "Malatya44"
        },
    }],
};
