export async function sendEmailDev(to: string, subject: string, url: string) {
  // MVP: não envia e-mail; só imprime no terminal.
  console.log('\n================ EMAIL DEV ================');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Link:', url);
  console.log('==========================================\n');
}
