export async function POST(req) {
  const { image } = await req.json();
  console.log("Imagen recibida:", image?.substring(0, 30), "...");

  const letters = ["A", "B", "C", "D", "E"];
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];

  console.log("Letra devuelta:", randomLetter);

  return new Response(JSON.stringify({ letter: randomLetter }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}