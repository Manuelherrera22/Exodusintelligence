import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const MigrationFormWithPreview = () => {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "Juan Pérez",
    edad: 30,
    nacionalidad: "Colombiana",
    estado_civil: "Soltero",
    nivel_educativo: "Universitario",
    ocupacion_actual: "Ingeniero de software",
    idioma_certificado: "Inglés",
    nivel_idioma: "Avanzado",
    ahorros_estimados: 15000,
    familiares_en_el_exterior: true,
    pais_familia: "Canadá",
    intencion_migratoria: "Trabajo",
    pais_destino_deseado: "Canadá",
    disponibilidad_para_viajar: "Inmediata",
    preferencia_migratoria: "Trabajo",
    nivel_tecnologico: "Alto",
    flexibilidad_geografica: "Alta",
    perfil_emprendedor: true,
    salud: "Buena",
    tiene_pasaporte: true,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "edad" || name === "ahorros_estimados"
          ? Number(value) || 0
          : value,
    }));
  };
  
  const handleBooleanChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'true',
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setResultado(null);
    setLoading(true);
    console.log("Enviando payload:", formData);
    try {
      const response = await fetch(
        "https://guddorljktfdcakburbr.supabase.co/functions/v1/migration-score-calculate",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            // El token de Supabase es necesario si la función tiene seguridad a nivel de servicio
            // "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("Error response from function:", data);
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }
      setResultado(data);
      toast({ title: "Éxito", description: "Análisis completado." });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "nombre", placeholder: "Nombre" },
    { name: "edad", placeholder: "Edad", type: "number" },
    { name: "nacionalidad", placeholder: "Nacionalidad" },
    { name: "estado_civil", placeholder: "Estado civil" },
    { name: "nivel_educativo", placeholder: "Nivel educativo" },
    { name: "ocupacion_actual", placeholder: "Ocupación actual" },
    { name: "idioma_certificado", placeholder: "Idioma certificado" },
    { name: "nivel_idioma", placeholder: "Nivel idioma" },
    { name: "ahorros_estimados", placeholder: "Ahorros estimados", type: "number" },
    { name: "pais_familia", placeholder: "País donde están los familiares" },
    { name: "intencion_migratoria", placeholder: "Intención migratoria" },
    { name: "pais_destino_deseado", placeholder: "País destino deseado" },
    { name: "disponibilidad_para_viajar", placeholder: "Disponibilidad para viajar" },
    { name: "preferencia_migratoria", placeholder: "Preferencia migratoria" },
    { name: "nivel_tecnologico", placeholder: "Nivel tecnológico" },
    { name: "flexibilidad_geografica", placeholder: "Flexibilidad geográfica" },
    { name: "salud", placeholder: "Salud" },
  ];
  
  const booleanFields = [
      { name: "familiares_en_el_exterior", label: "¿Familiares en el exterior?" },
      { name: "perfil_emprendedor", label: "¿Perfil emprendedor?" },
      { name: "tiene_pasaporte", label: "¿Tiene pasaporte?" },
  ];

  return (
    <div className="p-8 bg-gray-900 text-white max-w-4xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Formulario de Prueba de Perfil Migratorio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {fields.map(field => (
          <div key={field.name}>
            <Label htmlFor={field.name} className="capitalize">{field.placeholder}</Label>
            <Input 
              id={field.name}
              type={field.type || "text"} 
              name={field.name} 
              placeholder={field.placeholder} 
              value={formData[field.name] || ''}
              onChange={handleInputChange} 
              className="bg-gray-800 border-gray-700"
            />
          </div>
        ))}
        {booleanFields.map(field => (
            <div key={field.name} className="flex flex-col justify-center space-y-2">
                <Label>{field.label}</Label>
                <div className="flex items-center space-x-4">
                    <Button size="sm" variant={formData[field.name] === true ? 'secondary' : 'outline'} onClick={() => handleBooleanChange(field.name, 'true')}>Sí</Button>
                    <Button size="sm" variant={formData[field.name] === false ? 'secondary' : 'outline'} onClick={() => handleBooleanChange(field.name, 'false')}>No</Button>
                </div>
            </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4 my-6">
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Ocultar JSON" : "Ver JSON antes de enviar"}
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Enviando..." : "Enviar para análisis"}
        </Button>
      </div>

      {showPreview && (
        <pre className="mt-4 bg-gray-950 text-green-400 p-4 rounded-md overflow-x-auto text-sm">
          {JSON.stringify(formData, null, 2)}
        </pre>
      )}

      {resultado && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-bold text-green-400">Resultado:</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default MigrationFormWithPreview;