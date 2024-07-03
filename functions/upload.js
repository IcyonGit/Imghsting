const { Octokit } = require('@octokit/rest');
const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    const boundary = event.headers['content-type'].split('=')[1];
    const formData = event.body.split(`--${boundary}`);
    const fileData = formData.find(part => part.includes('Content-Disposition: form-data; name="file";'));

    if (!fileData) {
        return { statusCode: 400, body: 'File not found' };
    }

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const fileContent = fileData.split('\r\n\r\n')[1].split('\r\n--')[0];

    const contentBuffer = Buffer.from(fileContent, 'binary').toString('base64');

    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: fileName,
            message: `Upload ${fileName}`,
            content: contentBuffer,
        });

        const fileUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/main/${fileName}`;
        return {
            statusCode: 200,
            body: JSON.stringify({ url: fileUrl }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
