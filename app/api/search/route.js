export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
  
    if (!query) {
      return Response.json({ error: "Falta el parámetro query" }, { status: 400 });
    }
  
    const resultados = [
      { id: 1, nombre: `Receta de ${query} al horno` },
      { id: 2, nombre: `Receta de ${query} con tomate` },
    ];
  
    return Response.json({ ok: true, query, resultados });
  }
  
  export async function POST(req) {
    const { query } = await req.json();
  
    if (!query) {
      return Response.json({ error: "Falta el campo query" }, { status: 400 });
    }
  
    const resultados = [
      { id: 1, nombre: `Receta de ${query} al horno` },
      { id: 2, nombre: `Receta de ${query} con tomate` },
    ];
  
    return Response.json({ ok: true, query, resultados });
  }