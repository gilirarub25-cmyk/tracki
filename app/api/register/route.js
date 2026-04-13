import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { user, pass, email } = await req.json(); 

  const { error } = await supabase
    .from('usuarios')
    .insert([
      { 
        nombre: user, 
        contraseña: pass, 
        email: email || `${user}@test.com` 
      }
    ]);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 400 });
  }

  return Response.json({ ok: true, mensaje: "Usuario guardado en la DB real" });
}