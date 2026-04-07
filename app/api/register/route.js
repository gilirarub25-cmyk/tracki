export async function POST(req) {
    const { user, pass } = await req.json();
  
    if (!user || !pass) {
      return Response.json({ error: "Faltan user y pass" }, { status: 400 });
    }
  
    const usuarioYaExiste = user === "alvaro";
  
    if (usuarioYaExiste) {
      return Response.json({ ok: false, mensaje: "El usuario ya existe" }, { status: 409 });
    }
  
    return Response.json({ ok: true, mensaje: `Usuario '${user}' registrado correctamente` }, { status: 201 });
  }