import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    bucket?: string;
    folder?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label,
    bucket = 'project-images',
    folder = 'uploads',
    className = ""
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = folder ? `${folder}/${fileName}` : fileName;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (error: any) {
            console.error('Error uploading image:', error.message);
            alert('Erro ao fazer upload da imagem: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="block text-sm font-bold text-text-main-light dark:text-gray-300">{label}</label>}

            <div className="flex flex-col gap-4">
                {/* Preview Area */}
                <div className="relative group w-full aspect-video md:w-48 md:h-32 bg-gray-100 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all hover:border-primary/50">
                    {value ? (
                        <>
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 bg-white rounded-full text-gray-800 hover:scale-110 transition-transform"
                                    title="Trocar imagem"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform"
                                    title="Remover imagem"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-3xl">
                                {isUploading ? 'sync' : 'add_photo_alternate'}
                            </span>
                            <span className="text-xs font-medium">
                                {isUploading ? 'Enviando...' : 'Adicionar Foto'}
                            </span>
                        </button>
                    )}
                </div>

                {/* Hidden Input and Direct Link */}
                <div className="flex-1 space-y-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="Ou cole o link direto (https://...)"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:bg-black/20 dark:border-white/10 dark:text-white text-xs"
                        />
                    </div>
                    {!value && !isUploading && (
                        <p className="text-[10px] text-gray-500 italic">
                            Suporta PNG, JPG, WEBP.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
