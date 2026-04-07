export async function POST(req) {
  const { user, pass } = await req.json();

  if (!user || !pass) {
    return Response.json({ error: "Faltan user y pass" }, { status: 400 });
  }

  const usuarioValido = user === "alvaro" && pass === "hola";

  if (usuarioValido) {
    return Response.json({ ok: true, mensaje: "Inicio de sesión correcto" });
  } else {
    return Response.json({ ok: false, mensaje: "Usuario o contraseña incorrectos" }, { status: 401 });
  }
}