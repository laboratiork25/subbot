import makeWASocket, { useMultiFileAuthState, WASocket } from '@realvare/based'

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock: WASocket = makeWASocket({ auth: state, printQRInTerminal: true })

  // salva credenziali quando cambiano
  sock.ev.on('creds.update', saveCreds)

  // autoresponder DM: risponde quando qualcuno scrive in privato
  sock.ev.on('messages.upsert', async (event) => {
    for (const m of event.messages) {
      const jid = m.key?.remoteJid
      const fromMe = m.key?.fromMe
      const isGroup = jid?.endsWith('@g.us')

      // ignora messaggi inviati da sé, chat di gruppo e messaggi di stato
      if (fromMe || isGroup || jid === 'status@broadcast') continue

      // invia risposta automatica
      await sock.sendMessage(jid!, {
        text: 'Ciao! Grazie per il messaggio, risponderà un operatore il prima possibile.'
      })
    }
  })
}

start().catch(console.error)
