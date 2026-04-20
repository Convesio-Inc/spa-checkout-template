export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/config') {
      return new Response(
        JSON.stringify({
          apiKey: env.CPAY_API_KEY,
          clientKey: env.CPAY_CLIENT_KEY,
          environment: env.CPAY_ENVIRONMENT ?? 'test',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>
