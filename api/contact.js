// Vercel Serverless Function: /api/contact

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { name, email, subject, message, type } = req.body || {};

    // Validaciones básicas
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    // Construir payload
    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      type: String(type || 'general').trim(),
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || '',
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
    };

    // Optional: reenviar a un webhook si está configurado
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.error('Error enviando al webhook:', e);
        // No interrumpir al usuario; seguimos devolviendo success
      }
    }

    // TODO: aquí podrías integrar nodemailer, Resend, SendGrid, etc.

    return res.status(200).json({ message: 'Mensaje recibido. ¡Gracias por contactarnos!' });
  } catch (error) {
    console.error('Error en /api/contact:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
