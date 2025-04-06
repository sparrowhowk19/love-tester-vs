document.addEventListener('DOMContentLoaded', () => {
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result-display');
    const percentageSpan = document.getElementById('percentage');
    const percentageCircle = document.querySelector('.percentage-circle');
    const resultMessage = document.getElementById('result-message');

    // --- New Elements for Photo Upload ---
    const photo1Input = document.getElementById('photo1');
    const photo2Input = document.getElementById('photo2');
    const photo1Label = document.querySelector('label[for="photo1"]'); // The icon label
    const photo2Label = document.querySelector('label[for="photo2"]'); // The icon label
    // --- End New Elements ---


    calculateBtn.addEventListener('click', () => {
        const name1 = name1Input.value.trim().toLowerCase();
        const name2 = name2Input.value.trim().toLowerCase();

        if (!name1 || !name2) {
            alert('Please enter both names!');
            alert('Please enter both names!');
            return;
        }

        // Add loading state
        calculateBtn.classList.add('loading');
        calculateBtn.disabled = true; // Disable button during load
        resultDisplay.style.display = 'none'; // Hide previous result immediately

        // Simulate calculation delay for visual effect (optional, remove for instant result)
        setTimeout(() => {
            // Simple, fun calculation (not scientific!)
            const combinedNames = name1 + name2;
            let hash = 0;
            for (let i = 0; i < combinedNames.length; i++) {
                hash = (hash << 5) - hash + combinedNames.charCodeAt(i);
                hash |= 0; // Convert to 32bit integer
            }

            // Seeded random number generator based on names
            const seed = Math.abs(hash);
            const random = Math.sin(seed) * 10000;
            const percentage = Math.floor((random - Math.floor(random)) * 101); // 0-100

            displayResult(percentage);

            // Remove loading state after displaying result
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
        }, 500); // 500ms delay
    });

    function displayResult(percentage) {
        resultDisplay.style.display = 'block';

        // --- Animation Synchronization ---
        const countUpDurationMs = percentage * 20; // Total time for number count-up
        const countUpDurationSec = countUpDurationMs / 1000;

        // 1. Reset circle fill and text
        percentageCircle.style.transition = 'none'; // Disable transition for reset
        percentageCircle.style.setProperty('--percentage', '0%');
        percentageSpan.textContent = '0%';

        // Trigger reflow to apply the reset styles immediately
        void percentageCircle.offsetWidth; 

        // 2. Set the transition duration to match the count-up and re-enable transition
        percentageCircle.style.transition = `background ${countUpDurationSec}s ease-out`;
        
        // 3. Start the circle fill animation by setting the final percentage
        percentageCircle.style.setProperty('--percentage', `${percentage}%`);

        // 4. Animate percentage number count-up (starts slightly after circle begins filling)
        let currentPercentage = 0;
        const interval = setInterval(() => {
            if (currentPercentage >= percentage) {
                clearInterval(interval);
                percentageSpan.textContent = `${percentage}%`; // Ensure final value is exact
            } else {
                currentPercentage++;
                percentageSpan.textContent = `${currentPercentage}%`;
            }
        }, 20); // Interval speed (20ms per percentage point)
        // --- End Animation Synchronization ---


        // Display fun message
        let message = '';
        if (percentage < 20) {
            message = "Hmm, maybe just friends? 🤔";
        } else if (percentage < 50) {
            message = "Potential spark! Worth exploring? 😉";
        } else if (percentage < 80) {
            message = "Strong connection vibes! ✨";
        } else if (percentage < 95) {
            message = "Wow! Serious sparks flying! 🔥";
        } else {
            message = "Soulmate alert! 💖💯";
        }
        resultMessage.textContent = message;

        // Reset animations for percentage and message
        percentageSpan.style.animation = 'none';
        resultMessage.style.animation = 'none';
        
        // Trigger reflow to restart animation
        void percentageSpan.offsetWidth; 
        void resultMessage.offsetWidth;

        percentageSpan.style.animation = 'scaleUp 0.5s ease-out';
        resultMessage.style.animation = 'slideInUp 0.6s ease-out 0.3s backwards';
    }

    // Placeholder for Crush Quiz functionality if uncommented in HTML
    // const quizBtn = document.getElementById('quiz-btn');
    // if (quizBtn) {
    //     quizBtn.addEventListener('click', () => {
    //         alert('Crush Quiz coming soon!');
    //     });
    // }

    // --- New Photo Upload Logic ---
    function handlePhotoUpload(event, labelElement) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                // Update the label's background to show the preview
                labelElement.style.backgroundImage = `url('${e.target.result}')`;
                labelElement.style.backgroundSize = 'cover';
                labelElement.style.backgroundPosition = 'center';
                labelElement.style.color = 'transparent'; // Hide the camera icon text
                labelElement.textContent = ''; // Remove the camera icon text content
            }

            reader.readAsDataURL(file);
        } else {
            // Optional: Reset if the file is not an image or selection is cancelled
            labelElement.style.backgroundImage = 'none';
            labelElement.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'; // Reset background color
            labelElement.style.color = '#fff'; // Show icon color
            labelElement.textContent = '📷'; // Reset icon text
            alert('Please select a valid image file.');
        }
    }

    photo1Input.addEventListener('change', (event) => {
        handlePhotoUpload(event, photo1Label);
    });

    photo2Input.addEventListener('change', (event) => {
        handlePhotoUpload(event, photo2Label);
    });
    // --- End New Photo Upload Logic ---

});
