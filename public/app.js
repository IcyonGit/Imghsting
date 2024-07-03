document.getElementById('drop-area').addEventListener('drop', handleDrop, false);
document.getElementById('drop-area').addEventListener('dragover', handleDragOver, false);
document.getElementById('copy-button').addEventListener('click', copyToClipboard, false);

async function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    // Use Promise.all to handle multiple file uploads concurrently and wait for all to complete
    await Promise.all(Array.from(files).map(file => uploadFile(file)));
    // Show the link display section after files are uploaded
    document.getElementById('link-display').classList.remove('hidden');
}

function handleDragOver(e) {
    e.preventDefault();
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/.netlify/functions/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.url) {
            const linkInput = document.getElementById('image-link');
            linkInput.value = data.url;
        }
    } catch (error) {
        console.error('Upload failed:', error);
    }
}


function copyToClipboard() {
    const copyText = document.getElementById('image-link');
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    alert('Copied the link: ' + copyText.value);
}
