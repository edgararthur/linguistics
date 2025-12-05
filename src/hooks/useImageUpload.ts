import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseImageUploadResult {
    uploadImage: (file: File, bucket?: string) => Promise<string>;
    uploading: boolean;
    error: string | null;
}

export const useImageUpload = (): UseImageUploadResult => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File, bucket: string = 'leadership-images'): Promise<string> => {
        try {
            setUploading(true);
            setError(null);

            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload file
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (err: any) {
            console.error('Error uploading image:', err);
            const message = err.message || 'Failed to upload image';
            setError(message);
            throw new Error(message);
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading, error };
};
