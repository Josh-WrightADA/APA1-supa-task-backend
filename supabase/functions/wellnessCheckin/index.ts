// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  const headers = { "Content-Type": "application/json" };
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();
  
  try {
    // GET - Read wellness check-ins
    if (req.method === 'GET') {
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      // If path includes an ID, get specific check-in
      if (path && path !== 'wellnessCheckin') {
        const { data, error } = await supabase
          .from('wellness_checkins')
          .select('*')
          .eq('id', path)
          .eq('user_id', user?.id)
          .single();
          
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers });
      }
      
      // Otherwise return all check-ins for user
      const { data, error } = await supabase
        .from('wellness_checkins')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }
    
    // POST - Create new wellness check-in
    if (req.method === 'POST') {
      const { energy_level, mood, caffeine_craving, notes } = await req.json();
      
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('wellness_checkins')
        .insert([{ 
          user_id: user?.id,
          energy_level,
          mood,
          caffeine_craving,
          notes,
          created_at: new Date().toISOString()
        }])
        .select();
        
      if (error) throw error;
      return new Response(JSON.stringify(data[0]), { headers });
    }
    
    // PUT - Update wellness check-in
    if (req.method === 'PUT') {
      const { id, energy_level, mood, caffeine_craving, notes } = await req.json();
      
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('wellness_checkins')
        .update({ 
          energy_level,
          mood,
          caffeine_craving,
          notes
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select();
        
      if (error) throw error;
      return new Response(JSON.stringify(data[0]), { headers });
    }
    
    // DELETE - Delete wellness check-in
    if (req.method === 'DELETE') {
      const { id } = await req.json();
      
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('wellness_checkins')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers });
    }
    
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405, 
      headers 
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers 
    });
  }
})
