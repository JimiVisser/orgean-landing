// Waitlist form enhancement
// Works with Buttondown's embed subscribe endpoint
// Falls back gracefully if JS is disabled (form posts directly)

(function () {
  const form = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('email-input');
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('https://buttondown.com/api/emails/embed-subscribe/orgean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email: email }),
      });

      if (response.ok || response.status === 303) {
        emailInput.value = '';
        successMsg.hidden = false;
        submitBtn.textContent = 'Done!';
        setTimeout(() => {
          submitBtn.textContent = 'Notify me';
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      // Fallback: submit the form normally
      form.target = '_blank';
      form.submit();
      submitBtn.textContent = 'Notify me';
      submitBtn.disabled = false;
    }
  });
})();
