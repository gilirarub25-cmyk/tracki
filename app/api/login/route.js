import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { user, pass } = await req.json();

    // Buscamos en la tabla 'usuarios' de Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombre', user)
      .eq('contraseña', pass)
      .single();

    if (error || !data) {
      return Response.json({ ok: false, mensaje: "Usuario o clave incorrectos" }, { status: 401 });
    }

    return Response.json({ 
      ok: true, 
      mensaje: "¡Login real desde Supabase!", 
      usuario: data.nombre 
    });

  } catch (err) {
    return Response.json({ ok: false, mensaje: "Error de servidor" }, { status: 500 });
  }
}