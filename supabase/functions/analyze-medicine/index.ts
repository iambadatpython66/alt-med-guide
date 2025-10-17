// Edge runtime types are available globally

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  medicineName?: string;
  imageBase64?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting medicine analysis...');
    const { medicineName, imageBase64 }: AnalyzeRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    let messages: any[] = [];
    
    const systemPrompt = `You are a pharmaceutical expert AI assistant. Your task is to analyze medicine information and suggest safe, effective alternatives.

When analyzing:
1. Identify the active ingredient(s)
2. Understand the therapeutic category
3. Suggest 3-4 alternative medicines with similar efficacy
4. Consider both generic and branded options
5. Include important notes about each alternative

For each alternative medicine, provide:
- Medicine name
- Active ingredient
- Typical dosage
- Manufacturer (if known)
- Similarity match percentage (how similar to original)
- Important notes or considerations

Format your response as a JSON object with this structure:
{
  "originalMedicine": "detected or provided medicine name",
  "activeIngredient": "main active ingredient",
  "therapeuticCategory": "category like pain relief, antibiotic, etc",
  "alternatives": [
    {
      "name": "Alternative Medicine Name",
      "activeIngredient": "Active ingredient",
      "dosage": "Typical dosage",
      "manufacturer": "Manufacturer name",
      "similarity": "95% Match",
      "notes": "Important information"
    }
  ]
}

Be medically accurate and emphasize that users should consult healthcare professionals.`;

    if (imageBase64) {
      console.log('Processing image-based analysis');
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this medicine image and suggest alternatives. Identify the medicine name, active ingredients, and provide alternatives.' },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ];
    } else if (medicineName) {
      console.log('Processing text-based analysis for:', medicineName);
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze the medicine "${medicineName}" and suggest alternatives. Provide comprehensive information about alternatives including active ingredients and important notes.` }
      ];
    } else {
      throw new Error('Either medicineName or imageBase64 must be provided');
    }

    console.log('Calling Gemini AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits depleted. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    console.log('Analysis complete:', result.originalMedicine);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-medicine function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Please try again or contact support if the issue persists.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
