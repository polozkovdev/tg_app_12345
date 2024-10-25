window.Telegram.WebApp.ready();

const user = window.Telegram.WebApp.initDataUnsafe?.user;
const locale = user?.language_code || 'en';
const userId = user?.id;
const userName = user?.first_name || "User";

const botToken = '7665863259:AAHMSDEXaAyHVtjwu6pAufLLiWJsP9kos5U';

function sendMessageToUser(message) {
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: userId,
      text: message
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log('Message sent:', data);
      } else {
        console.error('Error sending message:', data);
      }
    })
    .catch(error => console.error('Error:', error));
}

function getGreetingMessage(name, visits, locale) {
  if (locale === 'ru' || locale === 'by') {
    return `Привет, ${name}! Вы посетили эту страницу ${visits} раз(а).`;
  }
  return `Hello, ${name}! You have visited this page ${visits} times.`;
}

function detectDebugging() {
  if (window.location.search || window.location.hash) {
    window.history.pushState({}, document.title, window.location.pathname);

    const message = locale === 'ru' ? 'Нельзя подсматривать!' : 'No peeking!';
    alert(message);
  }
}

function main() {
  if (user && userId) {
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount = parseInt(visitCount) + 1;

    localStorage.setItem('visitCount', visitCount);

    const greetingMessage = getGreetingMessage(userName, visitCount, locale);

    const greetingElement = document.getElementById('greeting');
    greetingElement.textContent = greetingMessage;

    sendMessageToUser(greetingMessage);

    detectDebugging();
  }
}

main();
