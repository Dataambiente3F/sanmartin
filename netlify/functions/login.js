// netlify/functions/login.js

exports.handler = async function(event, context) {
  // 1. Obtenemos la contraseña que el usuario envió desde el frontend.
  // El 'event.body' es un string, así que lo parseamos para convertirlo en un objeto.
  const { password } = JSON.parse(event.body);

  // 2. Obtenemos la contraseña correcta y segura desde las Variables de Entorno de Netlify.
  const correctPassword = process.env.MI_CONTRASENA_SECRETA;

  // 3. Comparamos las contraseñas.
  if (password === correctPassword) {
    // 4. Si son iguales, devolvemos una respuesta exitosa.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "¡Login exitoso!" })
    };
  } else {
    // 5. Si son diferentes, devolvemos un error de "No autorizado".
    return {
      statusCode: 401, // 401 significa "Unauthorized"
      body: JSON.stringify({ message: "Contraseña incorrecta." })
    };
  }
};
