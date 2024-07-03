import { Octokit } from '@octokit/rest';

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
        return { statusCode: 500, body: 'Server configuration error' };
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const body = JSON.parse(event.body);
    const contentBuffer = Buffer.from(body.fileContent, 'base64');

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: `images/${fileName}`, // Store in an 'images' directory
            message: `Upload ${fileName}`,
            content: contentBuffer.toString('base64'),
        });

        const fileUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/main/images/${fileName}`;
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