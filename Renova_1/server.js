const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const MAILO_API_KEY = process.env.MAILO_API_KEY || 'YOUR_MAILO_API_KEY';
const TO_EMAIL = 'Arturooropezaprieto3@gmail.com';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'landing')));
app.use('/theme', express.static(path.join(__dirname, 'theme')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/brand', express.static(path.join(__dirname, 'brand')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'propuesta.html'));
});

app.get('/propuesta', (req, res) => {
  res.redirect(301, '/');
});

app.get('/aviso-privacidad', (req, res) => {
  res.sendFile(path.join(__dirname, 'aviso-privacidad.html'));
});

async function sendEmailWithMailo(to, subject, htmlContent) {
  const response = await fetch('https://api.mailo.io/v1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MAILO_API_KEY}`
    },
    body: JSON.stringify({
      to: to,
      subject: subject,
      html: htmlContent
    })
  });
  return response.ok;
}

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Por favor completa los campos requeridos'
    });
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
      <h2 style="color: #006B54;">Nuevo contacto desde Renova</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
      <p style="color: #666; font-size: 12px;">Enviado el: ${new Date().toLocaleString('es-MX')}</p>
    </div>
  `;

  try {
    const emailSent = await sendEmailWithMailo(TO_EMAIL, `Nuevo contacto de ${name}`, emailHtml);
    if (!emailSent) {
      console.log('Mailo no configurado - guardando en logs');
    }
  } catch (error) {
    console.log('Error enviando email:', error.message);
  }

  console.log('Contacto recibido:', {
    timestamp: new Date().toISOString(),
    hasEmail: !!email,
    hasPhone: !!phone,
    messageLength: message.length
  });

  res.json({
    success: true,
    message: '¡Gracias por tu mensaje! Te contactaremos pronto.',
    data: { timestamp: new Date().toISOString() }
  });
});

app.post('/api/whatsapp', (req, res) => {
  const { name, phone, service } = req.body;

  const safeName = String(name || '').slice(0, 100).replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ]/gi, '');

  console.log('Solicitud WhatsApp:', {
    timestamp: new Date().toISOString(),
    hasName: !!name,
    hasPhone: !!phone,
    service: service || 'paneles solares'
  });

  const whatsappUrl = `https://wa.me/5214436942217?text=${encodeURIComponent(
    `Hola, me llamo ${safeName}. Estoy interesado en: ${service || 'paneles solares'}`
  )}`;

  res.json({
    success: true,
    whatsappUrl
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'propuesta.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║   ☀️  RENOVA - Servidor Activo              ║
║                                              ║
║   Local:     http://localhost:${PORT}          ║
║   Red:       http://0.0.0.0:${PORT}            ║
║                                              ║
║   Ctrl+C para detener                        ║
║                                              ║
╚══════════════════════════════════════════════╝
  `);
});