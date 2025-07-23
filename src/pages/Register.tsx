import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { UserCredentials } from "@/lib/auth-service";
import { useAuth } from "@/lib/auth-context";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<UserCredentials>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "confirm-password") {
      setConfirmPassword(value);
    } else if (id === "first-name") {
      setFormData(prev => ({ ...prev, firstName: value }));
    } else if (id === "last-name") {
      setFormData(prev => ({ ...prev, lastName: value }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente",
        });
        navigate("/explore");
      } else {
        toast({
          title: "Error",
          description: result.message || "Ha ocurrido un error al registrarte",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al registrarte",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#EEFFCD] to-[#C8F8B1] relative p-4 overflow-y-auto flex flex-col items-center justify-center">
      {/* Círculo decorativo detrás del formulario */}
      <div 
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#B7F09A] opacity-20 transition-transform duration-1000 ${
          isPageLoaded ? 'scale-100' : 'scale-0'
        }`}
      ></div>

      {/* Rectángulo superior */}
      <div 
        className={`bg-gradient-to-r from-[#FFFDE4] to-[#FFF6C7] w-full max-w-md h-[160px] relative rounded-t-[30px] flex items-center justify-center transition-all duration-800 delay-300 ${
          isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <img 
          src="/leaf.png" 
          alt="Hoja decorativa" 
          className={`h-[300px] w-[300px] object-contain transition-all duration-1000 delay-500 ${
            isPageLoaded ? 'scale-100 rotate-0' : 'scale-0 rotate-12'
          }`}
        />
      </div>

      {/* Formulario de registro */}
      <Card className="w-full max-w-md bg-[#FFFFF3] rounded-[30px] border-0 shadow-none -mt-8 relative z-10">
        <CardHeader className="space-y-1 pt-8">
          <CardTitle 
            className={`text-2xl font-heading text-center transition-all duration-600 delay-700 text-gray-800 ${
              isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}
          >
            ¡Únete a GreenCycle!
          </CardTitle>

        </CardHeader>
        <CardContent className="px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div 
              className={`grid grid-cols-2 gap-4 transition-all duration-600 delay-900 ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
            >
              <div className="space-y-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input 
                  id="first-name" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Apellido</Label>
                <Input 
                  id="last-name" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div 
              className={`space-y-2 transition-all duration-600 delay-1000 ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
            >
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="tu@email.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div 
              className={`space-y-2 transition-all duration-600 delay-1100 ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
            >
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <div 
              className={`space-y-2 transition-all duration-600 delay-1200 ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
            >
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
            <div 
              className={`flex items-center space-x-2 transition-all duration-600 delay-1300 ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
            >
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Acepto los{" "}
                <Link to="/terms" className="text-green hover:underline">
                  términos y condiciones
                </Link>
              </label>
            </div>
            <Button 
              type="submit" 
              className={`w-full bg-[#F7A41C] hover:bg-[#F7A41C]/80 transition-all duration-600 delay-1400 ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Registrarme"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div 
            className={`text-center text-sm transition-all duration-600 delay-1500 ${
              isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
            }`}
          >
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-green hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
