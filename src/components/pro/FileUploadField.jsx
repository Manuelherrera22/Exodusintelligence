import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const FileUploadField = ({ label, acceptedFormats = ["pdf", "jpg", "png"] }) => {
    const { t } = useTranslation('pro_modules');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const inputRef = useRef(null);
    const { toast } = useToast();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const extension = selectedFile.name.split('.').pop().toLowerCase();
            if (acceptedFormats.includes(extension)) {
                setFile(selectedFile);
            } else {
                toast({
                    variant: "destructive",
                    title: "Formato de archivo no válido",
                    description: `Por favor, sube un archivo ${acceptedFormats.join(', ')}.`,
                });
            }
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                     toast({
                        title: "¡Éxito!",
                        description: `El archivo "${file.name}" se ha subido.`,
                        className: 'bg-green-500/10 border-green-500/50 text-white',
                    });
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setUploadProgress(0);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const triggerFileSelect = () => {
        inputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">{label}</label>
            <div 
                className={cn(
                    "relative flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    "border-slate-600 hover:border-fuchsia-500/80 bg-slate-800/50 hover:bg-slate-800",
                    { "border-fuchsia-500": file }
                )}
                onClick={!file ? triggerFileSelect : undefined}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={acceptedFormats.map(f => `.${f}`).join(',')}
                />

                {!file && (
                    <div className="text-center text-slate-400">
                        <UploadCloud className="mx-auto h-8 w-8" />
                        <p className="mt-1 text-sm">Arrastra o haz clic para subir</p>
                        <p className="text-xs">{t('docs_verification.formats_accepted')}</p>
                    </div>
                )}
                
                {file && !isUploading && uploadProgress < 100 && (
                     <div className="flex items-center gap-3 text-white p-2">
                        <File className="h-8 w-8 text-fuchsia-400" />
                        <div className="text-left">
                            <p className="text-sm font-semibold truncate max-w-[150px]">{file.name}</p>
                            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={handleRemoveFile}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                 {(isUploading || uploadProgress > 0) && (
                    <div className="absolute inset-0 bg-slate-800/90 flex flex-col items-center justify-center p-4">
                        <Progress value={uploadProgress} className="w-full h-2 mb-2 [&>div]:bg-fuchsia-500" />
                        <p className="text-sm text-fuchsia-300 font-semibold">
                            {uploadProgress < 100 ? `Subiendo... ${uploadProgress}%` : `¡Completo!`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploadField;