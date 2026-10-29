// Set your Discord webhook URL in the credential/state configuration
const discordWebhookUrl = 'https://discord.com/api/webhooks/1552624370965291039/7eo161MxYeZA3-7lOnbXQ1WD4_CDgUJbw9fAumxSOGAKjncEqw_4DAOOHPw6iX9ZlDey';

post(discordWebhookUrl, {
  content: $.catPoem.poemText,
});
