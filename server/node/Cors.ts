'use strict';

export module NodeHelpers {
    export class Cors {
        public static EnableCorsOnExpress(app) {
            app.use(function (req:any, res:any, next:any) {
                var oneof = false;
                if (req.headers.origin) {
                    res.header('Access-Control-Allow-Origin', req.headers.origin);
                    oneof = true;
                }
                if (req.headers['access-control-request-method']) {
                    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
                    oneof = true;
                }
                if (req.headers['access-control-request-headers']) {
                    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
                    oneof = true;
                }
                if (oneof) {
                    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
                }

                // intercept OPTIONS method
                if (oneof && req.method == 'OPTIONS') {
                    res.send(200);
                }
                else {
                    next();
                }
            });
        }
    }
}
