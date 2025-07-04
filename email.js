function getTelegramUserId() {
  if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user && user.id) {
      return user.id;
    }
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  Telegram.WebApp.ready();
  const id = getTelegramUserId();
  const startParam = Telegram.WebApp.initDataUnsafe?.start_param;
  console.log("tg-id:", id);
  window.tgUserId = id;
  window.tgUserStartParam = startParam;
});

document.getElementById('email-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const errorEl = document.getElementById('email-error');

  try {
    const find_email = await fetch(`https://ndb.fut.ru/api/v2/tables/maiff22q0tefj6t/records/count?where=(tg-id,eq,${window.tgUserId})`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      }
    });

    const data_found_email = await find_email.json();

    if (data_found_email.count === 0) {
      errorEl.textContent = 'You have not submitted the reg.';
      return;
    }

    const res = await fetch(`https://ndb.fut.ru/api/v2/tables/maiff22q0tefj6t/records/count?where=(tg-id,eq,${window.tgUserId})~and(Результат КОТ,neq,-1)`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'xc-token': 'crDte8gB-CSZzNujzSsy9obQRqZYkY3SNp8wre88'
      }
    });

    const data = await res.json();

    if (data.count > 0) {
      errorEl.textContent = 'You have already submitted the test.';
      return;
    }

    localStorage.setItem('test_email', window.tgUserId);
    window.location.href = 'test.html';
  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Server error. Please try again.';
  }
});
