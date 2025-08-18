exports.handler = async function(event, context) {
  const { clave } = JSON.parse(event.body || "{}");

  const claveCorrecta = process.env.MI_CONTRASENA_SECRETA;

  if (clave === claveCorrecta) {
    return {
      statusCode: 200,
      body: JSON.stringify({ acceso: true })
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ acceso: false, mensaje: "Clave incorrecta" })
    };
  }
};
