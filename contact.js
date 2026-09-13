document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const statusEl = document.getElementById('contact-status');
  const AJAX = 'https://st333inqfn29.azurewebsites.net/api/inquire';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && gotcha.value) return;
    const payload = {};
    new FormData(form).forEach((value, key) => {
      if (key === '_gotcha' || key === '_next') return;
      payload[key] = value;
    });
    payload._captcha = 'false';
    const submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = 'Sending…';
    }
    try {
      const res = await fetch(AJAX, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const bodyText = await res.text();
      let json = {};
      try { json = JSON.parse(bodyText); } catch (err) {}
      console.log('inquire', res.status, bodyText);
      const ok = res.ok && (json.success === true || json.success === 'true');
      if (!ok) {
        const raw = (json && (json.message || json.error)) || bodyText || ('HTTP ' + res.status);
        if (statusEl) statusEl.textContent = String(raw).trim() || 'Could not send. Please try again.';
        return;
      }
      form.hidden = true;
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "Sent. I'll email you.";
      }
    } catch (err) {
      console.log('inquire', err);
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = (err && err.message) || 'Could not send. Please try again.';
      }
    } finally {
      if (submit) submit.disabled = false;
    }
  });
});
