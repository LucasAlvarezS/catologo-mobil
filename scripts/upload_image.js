
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple .env parser
const envPath = path.resolve(__dirname, '../.env');
const envConfig = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
        acc[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes
    }
    return acc;
}, {});

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Or SERVICE_ROLE_KEY if needed, but ANON might work if bucket is public

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage() {
    const filePath = path.resolve(__dirname, '../images/tarjetaHites.png');
    
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = 'assets/tarjetaHites.png';

    console.log('Uploading to Supabase Storage...');

    const { data, error } = await supabase.storage
        .from('telefonos')
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('Error uploading:', error);
        process.exit(1);
    }

    const { data: publicUrlData } = supabase.storage
        .from('telefonos')
        .getPublicUrl(fileName);

    console.log('Upload successful!');
    console.log('Public URL:', publicUrlData.publicUrl);
}

uploadImage();
