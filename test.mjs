import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ehkdlpkiqkpuoyqcbpac.supabase.co', 'sb_publishable_aV9zj9aE-4uHgpigK-LNfw_ZXYW67eO');

async function test() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (
        business_name
      )
    `)
    .order('created_at', { ascending: false });
    
  console.log('Error:', error);
  console.log('Data count:', data?.length);
}
test();
