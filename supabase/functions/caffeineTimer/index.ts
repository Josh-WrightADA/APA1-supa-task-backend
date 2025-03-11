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
    // GET - Read caffeine entries
    if (req.method === 'GET') {
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      // If path includes an ID, get specific entry
      if (path && path !== 'caffeineTimer') {
        const { data, error } = await supabase
          .from('caffeine_entries')
          .select('*')
          .eq('id', path)
          .eq('user_id', user?.id)
          .single();
          
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers });
      }
      
      // Otherwise return all entries for user
      const { data, error } = await supabase
        .from('caffeine_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('consumed_at', { ascending: false });
        
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }
    
    // POST - Create new caffeine entry
    if (req.method === 'POST') {
      const { amount, type, consumed_at } = await req.json();
      
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('caffeine_entries')
        .insert([{ 
          user_id: user?.id,
          amount: amount || 0,
          beverage_type: type || 'coffee',
          consumed_at: consumed_at || new Date().toISOString()
        }])
        .select();
        
      if (error) throw error;
      return new Response(JSON.stringify(data[0]), { headers });
    }
    
    // PUT - Update caffeine entry
    if (req.method === 'PUT') {
      const { id, amount, type, consumed_at } = await req.json();
      
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('caffeine_entries')
        .update({ 
          amount: amount,
          beverage_type: type,
          consumed_at: consumed_at
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select();
        
      if (error) throw error;
      return new Response(JSON.stringify(data[0]), { headers });
    }
    
    // DELETE - Delete caffeine entry
    if (req.method === 'DELETE') {
      const { id } = await req.json();
      
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
      
      if (userError) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('caffeine_entries')
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
