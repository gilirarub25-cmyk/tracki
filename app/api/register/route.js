import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { user, pass, email } = await req.json();

    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        { 
          nombre: user, 
          contraseña: pass, 
          email: email 
        }
      ])
      .select();

    if (error) {
      return Response.json({ ok: false, mensaje: error.message }, { status: 400 });
    }

    return Response.json({ ok: true, mensaje: "Usuario creado con éxito", data });
  } catch (err) {
    return Response.json({ ok: false, mensaje: "Error al registrar" }, { status: 500 });
  }
}