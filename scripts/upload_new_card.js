
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
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage() {
    const filePath = path.resolve(__dirname, '../public/images/tarjetaHites_new.png');
    
    if (!fs.existsSync(filePath)) {
        console.error('Error: No se encontró el archivo. Por favor guarda la imagen en:', filePath);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = 'assets/tarjetaHites_new.png';

    console.log('Subiendo nueva imagen a Supabase Storage...');

    const { data, error } = await supabase.storage
        .from('telefonos')
        .upload(fileName, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('Error subiendo:', error);
        process.exit(1);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('telefonos')
        .getPublicUrl(fileName);

    console.log('Imagen subida exitosamente!');
    console.log('URL Pública:', publicUrl);
}

uploadImage();
