import { corsHeaders } from '../_shared/cors.ts';

const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();

    if (!audio) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: audio (base64)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, return a message that voice transcription requires additional setup
    // In a production environment, you would integrate with a speech-to-text service
    // like Google Cloud Speech-to-Text, OpenAI Whisper, or similar
    
    return new Response(
      JSON.stringify({ 
        transcript: '',
        error: 'Voice transcription is not yet configured. Please type your question instead.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

    // Example implementation with a speech-to-text API:
    /*
    const response = await fetch('https://speech-to-text-api-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${speechApiKey}`,
      },
      body: JSON.stringify({
        audio: audio,
        language: 'en-US',
      }),
    });

    const data = await response.json();
    const transcript = data.transcript || '';

    return new Response(
      JSON.stringify({ transcript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    */
  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
