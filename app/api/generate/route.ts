import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { diff } = await request.json();

  if (!diff?.trim()) {
    return Response.json({ error: "diff is required" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Generate a conventional commit message for this git diff. Use the format:

type(scope): subject

body (2-3 sentences max explaining what and why)

Valid types: feat, fix, docs, style, refactor, test, chore. Keep the subject under 72 characters. Be concise and specific.

Git diff:
${diff}`,
        },
      ],
    });

    const text =
      message.content.find((b) => b.type === "text")?.text ?? "";
    return Response.json({ message: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "API call failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
