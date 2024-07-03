document.getElementById('drop-area').addEventListener('drop', handleDrop, false);
document.getElementById('drop-area').addEventListener('dragover', handleDragOver, false);
document.getElementById('copy-button').addEventListener('click', copyToClipboard, false);

async function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const links = await Promise.all(Array.from(files).map(file => uploadFile(file)));
    const linkDisplay = document.getElementById('link-display');
    linkDisplay.classList.remove('hidden');
    // Handle multiple file uploads
    links.forEach(link => {
        if (link) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = link;
            linkDisplay.appendChild(input);
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.onclick = () => copyToClipboard(input);
            linkDisplay.appendChild(copyButton);
        }
    });
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', { // Assuming the Netlify function is accessible at this endpoint
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Upload failed:', error);
    }
}

function copyToClipboard(input) {
    input.select();
    navigator.clipboard.writeText(input.value);
    alert('Copied the link: ' + input.value);
}

document.getElementById('drop-area').addEventListener('drop', handleDrop, false);
document.getElementById('drop-area').addEventListener('dragover', handleDragOver, false);