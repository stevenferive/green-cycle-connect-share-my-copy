
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // Simular carga de la página
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validatePassword = (password: string): string => {
    if (password.includes("=")) {
      return "La contraseña no puede contener el símbolo '='";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target; // destructuring
    
    if (id === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
    
    setCredentials(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar contraseña antes de enviar
    const passwordValidationError = validatePassword(credentials.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast({
        title: "Error de validación",
        description: passwordValidationError,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await login(credentials);
      
      if (result.success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: `¡Bienvenido/a de nuevo!`,
        });
        navigate("/explore");
      } else {
        toast({
          title: "Error",
          description: result.message || "Credenciales inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#EEFFCD] to-[#C8F8B1] flex items-center justify-center p-4 overflow-hidden">
      
      <div className="relative w-full max-w-md">
        {/* Círculo decorativo centrado detrás del formulario */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-[#8AD763] opacity-20 transition-all duration-1000 ease-out ${
          isPageLoaded ? 'scale-100 opacity-20' : 'scale-0 opacity-0'
        }`}></div>
        
        {/* Rectángulo en blanco arriba del formulario */}
        <div className={`bg-gradient-to-r from-[#FFFDE4] to-[#FFF6C7] w-full h-[160px] relative rounded-t-[30px] flex items-center justify-center transition-all duration-700 ease-out transform ${
          isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <img 
            src="/leaf.png" 
            alt="Hoja decorativa" 
            className={`h-[350px] w-[350px] object-contain transition-all duration-1000 ease-out delay-300 transform ${
              isPageLoaded ? 'scale-100 rotate-0' : 'scale-0 rotate-12'
            }`}
          />
        </div>
        
        <Card className={`w-full relative z-10 -mt-8 bg-[#FFFFF3] rounded-[30px] border-0 shadow-none transition-all duration-700 ease-out delay-200 transform ${
          isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-heading text-center text-gray-800">¡Te damos la bienvenida a GreenCycle!</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 px-6">
              <div className={`space-y-2 transition-all duration-500 ease-out delay-400 transform ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}>
              
              <Input 
                id="email" 
                type="email" 
                placeholder="Correo electrónico" 
                value={credentials.email}
                onChange={handleChange}
                required 
              />
            </div>
              <div className={`space-y-2 transition-all duration-500 ease-out delay-500 transform ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}>
              <div className="flex justify-between">
                <Link to="/recover-password" className="text-sm text-green hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Contraseña" 
                value={credentials.password}
                onChange={handleChange}
                required 
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
              <div className={`transition-all duration-500 ease-out delay-600 transform ${
                isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}>
            <Button 
              type="submit" 
                  className="w-full bg-[#F7A41C] hover:bg-[#F7A41C]/80"
              disabled={isLoading || !!passwordError}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
              </div>
          </form>
        </CardContent>
          <CardFooter className={`flex flex-col space-y-4 transition-all duration-500 ease-out delay-700 transform ${
            isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
          }`}>
          <div className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-green hover:underline">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default Login;
