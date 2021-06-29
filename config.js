// Autodesk Forge configuration
module.exports = {
    // Set environment variables or hard-code here
    credentials: {
        //client_id: process.env.FORGE_CLIENT_ID,
        //client_secret: process.env.FORGE_CLIENT_SECRET,
        client_id:'w1LVScfNEaKvIomQAwK6RMWOP1rgplYn',
        client_secret:'GAswYri5ZtWp2S7P',
        callback_url: process.env.FORGE_CALLBACK_URL
    },
    
    scopes: {
        // Required scopes for the server-side application
        internal: ['bucket:create', 'bucket:read', 'data:read', 'data:create', 'data:write'],
        // Required scope for the client-side viewer
        public: ['viewables:read']
    }
};
