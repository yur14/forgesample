const express = require('express');
const {
    DerivativesApi,
    JobPayload,
    JobPayloadInput,
    JobPayloadOutput,
    JobSvfOutputPayload
} = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');

let router = express.Router();

//let authClient = new AuthenticationClient(config.client_id, config.client_secret);
// Middleware for obtaining a token for each request.Промежуточное ПО для получения токена на каждый запрос.
router.use(async (req, res, next) => {
    req.oauth_token = await getInternalToken();
    req.oauth_client = getClient();
    next();
});

// POST /api/forge/modelderivative/jobs - отправляет новое задание на перевод для данного объекта URN.
// Тело запроса должно быть действительным JSON в виде { "objectName": "<translated-object-urn>" }.
router.post('/jobs', async (req, res, next) => {
    let job = new JobPayload();
    job.input = new JobPayloadInput();
    job.input.urn = req.body.objectName;
    job.output = new JobPayloadOutput([
        new JobSvfOutputPayload()
    ]);
    job.output.formats[0].type = 'svf';
    job.output.formats[0].views = ['2d', '3d'];
    try {
        // Submit a translation job using [DerivativesApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/DerivativesApi.md#translate).
        // Отправьте задание на перевод, используя
        await new DerivativesApi().translate(job, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
});

module.exports = router;
