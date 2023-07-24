module.exports = {
    FIREBASE_CONFIG: {
        auth_provider_x509_cert_url:
      process.env.REACT_APP_SAK_AUTH_PROVIDER_X509_CERT_URL,
        auth_uri: process.env.REACT_APP_SAK_AUTH_URI,
        client_x509_cert_url: process.env.REACT_APP_SAK_X509_CERT_URL,
        client_email: process.env.REACT_APP_SAK_CLIENT_EMAIL,
        client_id: process.env.REACT_APP_SAK_CLIENT_ID,
        private_key: process.env.REACT_APP_SAK_PRIVATE_KEY.replace(/\\n/g, '\n'),
        private_key_id: process.env.REACT_APP_SAK_PRIVATE_KEY_ID,
        project_id: process.env.REACT_APP_SAK_PROJECT_ID,
        token_uri: process.env.REACT_APP_SAK_TOKEN_URI,
        type: process.env.REACT_APP_SAK_TYPE,
    },
};
