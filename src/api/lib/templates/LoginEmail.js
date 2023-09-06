
export const LoginEmail = ({ 
  restaurantName,
  deviceId,
  platform,
  short_name,
  locationFormat,
  family,
  deviceName,
  version
}) => {

  return`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .device-details {
        margin-bottom: 20px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Inicio de sesión en ${restaurantName}</h2>
      </div>
      <div class="device-details">
        <p>Has iniciado sesión en ${restaurantName} desde el dispositivo ${deviceName} (${platform} - ${version}).</p>
        <p>Detalles del dispositivo:</p>
        <ul>
          <li>ID de dispositivo: ${deviceId}</li>
          <li>Nombre de dispositivo: ${deviceName}</li>
          <li>Modelo de dispositivo: ${family}</li>
          <li>Versión de plataforma: ${version}</li>
          <li>Tipo de plataforma: ${platform}</li>
          <li>Formato de ubicación: ${locationFormat || 'No disponible'}</li>
          <li>Nombre corto: ${short_name}</li>
        </ul>
      </div>
      <div class="footer">
        <p>Si no reconoces este inicio de sesión o tienes alguna preocupación, por favor contáctanos.</p>
        <p>¡Disfruta tu experiencia en ${restaurantName}!</p>
        <p>Saludos,<br>El equipo de ${restaurantName}</p>
      </div>
    </div>
  </body>
  </html>
`
}
