// Waitlist form enhancement
// Works with Mailchimp's embed subscribe endpoint
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
      // Mailchimp requires JSONP for cross-origin — use no-cors fetch as fire-and-forget
      const formData = new URLSearchParams(new FormData(form));
      const action = form.action.replace('/post', '/post-json') + '&c=__cb';
      await fetch(action + '&' + formData.toString(), { mode: 'no-cors' });

      emailInput.value = '';
      successMsg.hidden = false;
      submitBtn.textContent = 'Done!';
      // Track conversion in Plausible
      if (window.plausible) {
        plausible('Waitlist Signup');
      }
      setTimeout(() => {
        submitBtn.textContent = 'Notify me';
        submitBtn.disabled = false;
      }, 3000);
    } catch (err) {
      // Fallback: submit the form normally
      form.target = '_blank';
      form.submit();
      submitBtn.textContent = 'Notify me';
      submitBtn.disabled = false;
    }
  });
})();
