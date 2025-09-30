import makeWASocket, { useMultiFileAuthState, WASocket } from '@realvare/based'

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock: WASocket = makeWASocket({ auth: state, printQRInTerminal: true })

  sock.ev.on('creds.update', saveCreds)

  // assicurarsi che la connessione sia aperta e svuotare eventuali code
  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      sock.ev.flush()
    }
  })

  // risponde automaticamente ai DM
  sock.ev.on('messages.upsert', async ({ type, messages }) => {
    for (const m of messages) {
      const jid = m.key?.remoteJid
      const fromMe = m.key?.fromMe
      const isGroup = jid?.endsWith('@g.us')
      if (fromMe || isGroup || jid === 'status@broadcast') continue

      await sock.sendMessage(jid!, {
        text: 'Ciao! Grazie per il messaggio, risponderà un operatore a breve.'
      })
    }
  })
}

start().catch(console.error)
