window.startCamera = async () => {
    const video = document.getElementById('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            video.srcObject = stream;
        } catch (err) {
            console.error("Camera access denied: ", err);
        }
    }
};

window.capturePhoto = () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Simple filter demo (Grayscale) - user mentioned filters
    // context.filter = 'grayscale(100%)';
    // context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
};
