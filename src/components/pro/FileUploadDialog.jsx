import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FileUploadDialog = ({ isOpen, setIsOpen, onUpload, stepTitle }) => {
    const { t } = useTranslation('my_migration_route');
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);
    const { toast } = useToast();
    const acceptedFormats = ['pdf', 'jpg', 'png'];

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!acceptedFormats.includes(extension)) {
                toast({
                    variant: "destructive",
                    title: t('upload_dialog.upload_error'),
                    description: `Formato no válido: ${file.name}`,
                });
                return false;
            }
            return true;
        });
        setFiles(prev => [...prev, ...validFiles]);
    };

    const handleRemoveFile = (fileName) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
    };

    const handleUploadClick = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        
        // Simulate upload process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onUpload(files);
        setIsUploading(false);
        setIsOpen(false);
        setFiles([]); // Clear files after upload
        toast({
            title: t('upload_dialog.upload_success'),
            className: 'bg-green-500/10 border-green-500/50 text-white',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('upload_dialog.title')} "{stepTitle}"</DialogTitle>
                    <DialogDescription>{t('upload_dialog.description')}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div 
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-slate-600 hover:border-fuchsia-500/80 bg-slate-800/50 hover:bg-slate-800"
                        onClick={() => inputRef.current?.click()}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            accept={acceptedFormats.map(f => `.${f}`).join(',')}
                        />
                        <div className="text-center text-slate-400">
                            <UploadCloud className="mx-auto h-8 w-8" />
                            <p className="mt-1 text-sm">{t('upload_dialog.button_add')}</p>
                            <p className="text-xs">{t('upload_dialog.formats_accepted')}</p>
                        </div>
                    </div>
                    {files.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {files.map(file => (
                                <div key={file.name} className="flex items-center justify-between bg-slate-800 p-2 rounded-md">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <File className="h-5 w-5 text-fuchsia-400 flex-shrink-0" />
                                        <p className="text-sm truncate">{file.name}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => handleRemoveFile(file.name)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>{t('upload_dialog.button_cancel')}</Button>
                    <Button onClick={handleUploadClick} disabled={isUploading || files.length === 0} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">
                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('upload_dialog.button_upload')} ({files.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FileUploadDialog;