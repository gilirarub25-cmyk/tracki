/**
 * lib/supabase.ts
 * ---------------------------------------------------------------------------
 * Cliente Supabase compartido (patrón Singleton).
 *
 * Este módulo crea una única instancia del cliente de Supabase que será
 * importada por todos los componentes de la aplicación. Centralizar la
 * configuración garantiza que toda la aplicación comparte la misma sesión
 * de autenticación y la misma conexión.
 *
 * Las variables de entorno con prefijo NEXT_PUBLIC_ son inyectadas por
 * Next.js en el bundle del cliente. Es seguro exponer la `anon_key` ya
 * que la autorización real se delega a las políticas de Row Level Security
 * configuradas en PostgreSQL.
 *
 * @see https://supabase.com/docs/reference/javascript/initializing
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Instancia única (singleton) del cliente Supabase.
 * Se exporta para ser reutilizada en hooks, contextos y páginas.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
