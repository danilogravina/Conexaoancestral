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
    const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>(value && !value.includes('supabase.co') ? 'url' : 'upload');
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
            setUploadMethod('upload');
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
        <div className={`space-y-3 ${className}`}>
            {label && <label className="block text-sm font-bold text-text-main-light dark:text-gray-300">{label}</label>}

            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => setUploadMethod('upload')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${uploadMethod === 'upload' ? 'bg-white dark:bg-black/40 text-primary shadow-sm' : 'text-gray-500'}`}
                >
                    Subir Arquivo
                </button>
                <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${uploadMethod === 'url' ? 'bg-white dark:bg-black/40 text-primary shadow-sm' : 'text-gray-500'}`}
                >
                    Link Externo (URL)
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start">
                {/* Preview Area / Upload Zone */}
                {uploadMethod === 'upload' ? (
                    <div
                        onClick={() => !value && fileInputRef.current?.click()}
                        className={`relative group w-full aspect-video md:w-64 md:h-40 bg-gray-100 dark:bg-white/5 rounded-xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden 
                            ${value ? 'border-primary/30' : 'border-gray-300 dark:border-white/10 hover:border-primary/50 cursor-pointer'}`}
                    >
                        {value ? (
                            <>
                                <img src={value} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 bg-white rounded-full text-gray-800 hover:scale-110 transition-transform shadow-lg"
                                        title="Trocar imagem"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">sync</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform shadow-lg"
                                        title="Remover imagem"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <span className="material-symbols-outlined text-4xl animate-bounce-slow">
                                    {isUploading ? 'sync' : 'upload'}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {isUploading ? 'Enviando...' : 'Selecionar Arquivo'}
                                </span>
                                <p className="text-[10px] text-gray-500">PNG, JPG ou WEBP</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="flex-1 w-full space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder="https://exemplo.com/imagem.jpg"
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:bg-black/20 dark:border-white/10 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                            {value && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                        {value && (
                            <div className="w-48 aspect-video rounded-lg overflow-hidden border border-gray-200">
                                <img src={value} alt="Preview URL" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
