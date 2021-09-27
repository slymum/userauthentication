const httpContext = require('express-http-context');
//logger format
const logger = require('tracer').colorConsole(
    {
        format: [
            "{{timestamp}} <{{title}}>  {{message}} (in {{file}}:{{line}})", // default format
            {
                error: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}" // error format
            }],
        dateformat: "yyyy-mm-dd'T'HH:MM:ss.L"
    });

module.exports = logger;
