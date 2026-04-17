import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { user, pass, email } = await req.json();

    const { error } = await supabase
      .from('usuarios')
      .insert([
        { 
          nombre: user, 
          contraseña: pass, 
          email: email || `${user}@example.com` // Email por si no lo pides en el formulario
        }
      ]);

    if (error) {
      return Response.json({ ok: false, mensaje: error.message }, { status: 400 });
    }

    return Response.json({ ok: true, mensaje: "Usuario registrado en la DB" });

  } catch (err) {
    return Response.json({ ok: false, mensaje: "Error de registro" }, { status: 500 });
  }
}