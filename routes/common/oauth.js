const { AuthClientTwoLegged } = require('forge-apis');

const config = require('../../config');

/**
 * Initializes a Forge client for 2-legged authentication.
 * Инициализирует клиент Forge для двусторонней аутентификации.
 * @param {string[]} scopes List of resource access scopes.scopes Список областей доступа к ресурсам.
 * @returns {AuthClientTwoLegged} 2-legged authentication client.Двухсторонний клиент аутентификации.
 */

//let authClient = new AuthenticationClient(config.client_id, config.client_secret);

function getClient(scopes) {
    const { client_id, client_secret } = config.credentials;
    return new AuthClientTwoLegged(client_id, client_secret, scopes || config.scopes.internal);
}

let cache = new Map();
async function getToken(scopes) {
    const key = scopes.join('+');
    if (cache.has(key) && cache.get(key).expires_at > Date.now()) {
        return cache.get(key);
    }
    const client = getClient(scopes);
    let credentials = await client.authenticate();
    credentials.expires_at = Date.now() + credentials.expires_in * 1000;
    cache.set(key, credentials);
    return credentials;
}

/**
 * Retrieves a 2-legged authentication token for preconfigured public scopes.
 * Получает двухсторонний токен аутентификации для предварительно настроенных общедоступных областей.
 * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
 */
async function getPublicToken() {
    return getToken(config.scopes.public);
}

/**
 * Retrieves a 2-legged authentication token for preconfigured internal scopes.
 * Получает двухсторонний токен аутентификации для предварительно настроенных внутренних областей.
 * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
 */
async function getInternalToken() {
    return getToken(config.scopes.internal);
}

module.exports = {
    getClient,
    getPublicToken,
    getInternalToken
};
