import { supabase } from '@/lib/customSupabaseClient';

/**
 * Retrieves the chat memory for the authenticated user.
 * 
 * @returns {Promise<Array>} The array of messages, or empty array if none.
 */
export async function getKaiMemory() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('kai_memory')
      .select('messages')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user has no memory yet.
        return [];
      }
      console.error('Error fetching KAI memory:', error);
      return [];
    }

    return data?.messages || [];
  } catch (err) {
    console.error('Failed to get KAI memory:', err);
    return [];
  }
}

/**
 * Saves or updates the chat memory for the authenticated user.
 * Strips base64 image data before saving to keep JSONB size small.
 * 
 * @param {Array} messages - The array of OpenAI message objects
 * @param {Object} extractedData - Any new extracted profile data
 */
export async function saveKaiMemory(messages, extractedData = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Clean messages to avoid saving huge base64 images to DB
    const cleanedMessages = messages.map(msg => {
      // If it has attachmentPreview (custom local property), omit it in DB
      const cleanMsg = { ...msg };
      delete cleanMsg.attachmentPreview;

      // Check if message content is an array (multimodal content)
      if (Array.isArray(cleanMsg.content)) {
        cleanMsg.content = cleanMsg.content.map(part => {
          if (part.type === 'image_url') {
            return {
              type: 'text',
              text: '[El usuario adjuntó un documento/imagen en la conversación pasada. KAI ya lo revisó.]'
            };
          }
          return part;
        });
      }
      return cleanMsg;
    });

    const { error } = await supabase
      .from('kai_memory')
      .upsert(
        {
          user_id: session.user.id,
          messages: cleanedMessages,
          extracted_data: extractedData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error saving KAI memory:', error);
    }
  } catch (err) {
    console.error('Failed to save KAI memory:', err);
  }
}
