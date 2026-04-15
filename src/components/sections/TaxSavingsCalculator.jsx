import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TaxSavingsCalculator = () => {
  const { toast } = useToast();
  const [income, setIncome] = useState('');
  const [country, setCountry] = useState('');
  const [savings, setSavings] = useState(null);

  const calculateSavings = (e) => {
    e.preventDefault();
    if (!income || !country) {
      toast({
        title: "Datos incompletos",
        description: "Por favor, ingresa tus ingresos y país actual.",
        variant: "destructive",
      });
      return;
    }

    const incomeNum = parseFloat(income);
    // Simplified calculation logic
    const taxRates = { 'Argentina': 0.35, 'Colombia': 0.30, 'México': 0.32, 'Chile': 0.40, 'Otro': 0.25 };
    const currentTax = incomeNum * (taxRates[country] || 0.25);
    // Assuming 0% tax on foreign income in destination
    const estimatedSavings = currentTax; 
    setSavings(estimatedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
  };

  return (
    <section className="py-24 px-4 bg-slate-900">
      <div className="max-w-2xl mx-auto bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-8 shadow-2xl shadow-yellow-500/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-8">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Calculadora de Ahorros Fiscales</h2>
            <p className="text-gray-300 mt-2">Estima cuánto podrías ahorrar en impuestos al optimizar tu residencia fiscal.</p>
          </div>

          <form onSubmit={calculateSavings} className="space-y-6">
            <div>
              <Label htmlFor="income" className="text-gray-300">Ingresos Anuales (USD)</Label>
              <Input
                id="income"
                type="number"
                placeholder="Ej: 100000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-gray-300">País de Residencia Fiscal Actual</Label>
              <Select onValueChange={setCountry}>
                <SelectTrigger id="country" className="w-full mt-2">
                  <SelectValue placeholder="Selecciona tu país..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Colombia">Colombia</SelectItem>
                  <SelectItem value="México">México</SelectItem>
                  <SelectItem value="Chile">Chile</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-bold">
              Calcular Ahorro Estimado
            </Button>
          </form>

          {savings !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center bg-green-900/30 border border-green-500/30 rounded-lg p-6"
            >
              <p className="text-lg text-gray-200">Ahorro fiscal anual estimado:</p>
              <p className="text-4xl font-bold text-green-400 my-2">{savings}</p>
              <p className="text-xs text-gray-400 mb-4">Este es un cálculo simplificado. El ahorro real depende de múltiples factores.</p>
              <Button onClick={() => toast({title: "Solicitud enviada"})} variant="link" className="text-yellow-400">
                Solicita un análisis gratuito y detallado <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TaxSavingsCalculator;