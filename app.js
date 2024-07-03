document.getElementById('drop-area').addEventListener('drop', handleDrop, false);
document.getElementById('drop-area').addEventListener('dragover', handleDragOver, false);

async function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i]);
    }
}

function handleDragOver(e) {
    e.preventDefault();
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (data.url) {
        const link = document.createElement('a');
        link.href = data.url;
        link.innerText = data.url;
        document.body.appendChild(link);
        document.body.appendChild(document.createElement('br'));
    }
}
