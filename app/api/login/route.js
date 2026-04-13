import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { user, pass } = await req.json();

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('nombre', user)      
    .eq('contraseña', pass)  
    .single();

  if (usuario) {
    return Response.json({ 
      ok: true, 
      mensaje: "Inicio de sesión correcto",
      user: usuario.nombre 
    });
  } else {
    return Response.json({ 
      ok: false, 
      mensaje: "Usuario o contraseña incorrectos" 
    }, { status: 401 });
  }
}