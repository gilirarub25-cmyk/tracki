import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { user, pass } = await req.json();

    const { data, error } = await supabase
      .from('usuarios') 
      .select('*')
      .eq('nombre', user)
      .eq('contraseña', pass)
      .single();

    if (error || !data) {
      return Response.json({ ok: false, mensaje: "Usuario o clave incorrectos" }, { status: 401 });
    }

    return Response.json({ ok: true, mensaje: "Login correcto", usuario: data });
  } catch (err) {
    return Response.json({ ok: false, mensaje: "Error en el servidor" }, { status: 500 });
  }
}