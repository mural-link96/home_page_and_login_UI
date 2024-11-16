document.addEventListener('DOMContentLoaded', (event) => {
    const dropzone = document.getElementById('dropzone');
    const segmentButton = document.getElementById('segmentButton');
    const originalImage = document.getElementById('originalImage');
    const segmentedImage = document.getElementById('segmentedImage');

    if (dropzone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropzone.classList.add('border-blue-500', 'border-4');
        }

        function unhighlight(e) {
            dropzone.classList.remove('border-blue-500', 'border-4');
        }

        dropzone.addEventListener('drop', handleDrop, false);
        dropzone.addEventListener('click', () => document.getElementById('fileInput').click());
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.addEventListener('change', handleImageUpload);

    if (segmentButton) {
        segmentButton.addEventListener('click', segmentImage);
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleImageUpload({ target: { files: [file] } });
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage.src = e.target.result;
                originalImage.classList.remove('hidden');
                
                // Update the dropzone to show the uploaded image
                dropzone.innerHTML = `
                    <img src="${e.target.result}" alt="Uploaded image" class="max-h-32 mx-auto" />
                    <p class="mt-2">File: ${file.name}</p>
                `;
                
                segmentButton.disabled = false;
            }
            reader.readAsDataURL(file);
        }
    }

    async function segmentImage() {
        if (!originalImage.src) {
            alert('Please upload an image first.');
            return;
        }

        segmentButton.disabled = true;
        segmentButton.textContent = 'Segmenting...';
        
        try {
            const response = await fetch('/api/segment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: originalImage.src }),
            });
            
            if (!response.ok) {
                throw new Error('Segmentation failed');
            }
            
            const data = await response.json();
            segmentedImage.src = data.segmentedImage;
            segmentedImage.classList.remove('hidden');
        } catch (error) {
            console.error('Error segmenting image:', error);
            alert('Error segmenting image. Please try again.');
        } finally {
            segmentButton.disabled = false;
            segmentButton.textContent = 'Segment It';
        }
    }
});

// Utility function to handle logout
function logout() {
    fetch('/logout', {
        method: 'GET',
    }).then(response => {
        if (response.ok) {
            window.location.href = '/';
        }
    });
}