sock.ev.on('connection.update', ({ connection }) => {
  if (connection === 'open') {
    // svuota eventuali aggiornamenti pendenti
    sock.ev.flush()
  }
})

sock.ev.on('messages.upsert', async ({ type, messages }) => {
  for (const m of messages) {
    const jid = m.key?.remoteJid
    const fromMe = m.key?.fromMe
    const isGroup = jid?.endsWith('@g.us')
    if (fromMe || isGroup || jid === 'status@broadcast') continue

    // a volte il contenuto arriva dopo un retry: inviare comunque un saluto
    await sock.sendMessage(jid!, { text: 'Ciao! Grazie per il messaggio, risponderemo a breve.' })
  }
})
