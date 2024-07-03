const fetch = require('node-fetch');
const { Octokit } = require('@octokit/rest');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const form = new FormData();
    form.append('file', event.body);

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const content = Buffer.from(form.getBuffer()).toString('base64');

    try {
        const response = await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: fileName,
            message: `Upload ${fileName}`,
            content: content,
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
