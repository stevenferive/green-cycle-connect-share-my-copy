
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  MessageCircle, 
  Bug, 
  Lightbulb, 
  Clock, 
  Send,
  ShoppingCart,
  DollarSign,
  User,
  Shield,
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ticketForm, setTicketForm] = useState({ subject: '', description: '', email: '' });
  const [bugReport, setBugReport] = useState({ title: '', description: '', steps: '' });
  const [suggestion, setSuggestion] = useState({ title: '', description: '', category: '' });
  const { toast } = useToast();

  // Categorías de FAQ
  const faqCategories = [
    { id: 'compras', label: 'Compras', icon: ShoppingCart, color: 'bg-blue-100 text-blue-800' },
    { id: 'ventas', label: 'Ventas', icon: DollarSign, color: 'bg-green-100 text-green-800' },
    { id: 'cuenta', label: 'Cuenta', icon: User, color: 'bg-purple-100 text-purple-800' },
    { id: 'seguridad', label: 'Seguridad', icon: Shield, color: 'bg-red-100 text-red-800' },
    { id: 'pagos', label: 'Pagos', icon: CreditCard, color: 'bg-orange-100 text-orange-800' }
  ];

  // Preguntas frecuentes
  const faqs = [
    {
      category: 'compras',
      question: '¿Cómo puedo realizar una compra?',
      answer: 'Para realizar una compra, navega por los productos, selecciona el que te interesa, contacta al vendedor a través del chat y acuerden los detalles de la transacción.'
    },
    {
      category: 'compras',
      question: '¿Puedo devolver un producto?',
      answer: 'Las devoluciones dependen de la política del vendedor. Te recomendamos contactar directamente al vendedor para discutir las condiciones de devolución.'
    },
    {
      category: 'ventas',
      question: '¿Cómo publico un producto?',
      answer: 'Ve a "Mis Productos" en el menú, presiona el botón "+" y completa toda la información requerida incluyendo fotos, descripción y precio.'
    },
    {
      category: 'ventas',
      question: '¿Cuánto cuesta publicar?',
      answer: 'Publicar productos en nuestra plataforma es completamente gratuito. Solo cobramos una pequeña comisión cuando se completa una venta.'
    },
    {
      category: 'cuenta',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a Menú > Configuración > Seguridad y selecciona "Cambiar contraseña". Necesitarás tu contraseña actual para confirmar el cambio.'
    },
    {
      category: 'cuenta',
      question: '¿Puedo eliminar mi cuenta?',
      answer: 'Sí, puedes eliminar tu cuenta desde Menú > Privacidad y Seguridad > Eliminar cuenta. Ten en cuenta que esta acción es irreversible.'
    },
    {
      category: 'seguridad',
      question: '¿Cómo reporto un usuario sospechoso?',
      answer: 'En el perfil del usuario, toca los tres puntos y selecciona "Reportar usuario". Describe el motivo del reporte y nuestro equipo lo revisará.'
    },
    {
      category: 'pagos',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos transferencias bancarias, pagos móviles y efectivo. Los métodos específicos dependen del acuerdo entre comprador y vendedor.'
    }
  ];

  // Filtrar FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ticket enviado",
      description: "Hemos recibido tu solicitud. Te responderemos en 24-48 horas.",
    });
    setTicketForm({ subject: '', description: '', email: '' });
  };

  const handleSubmitBugReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reporte enviado",
      description: "Gracias por reportar este problema. Nuestro equipo técnico lo revisará.",
    });
    setBugReport({ title: '', description: '', steps: '' });
  };

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Sugerencia enviada",
      description: "¡Gracias por tu sugerencia! La evaluaremos para futuras actualizaciones.",
    });
    setSuggestion({ title: '', description: '', category: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/menu">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-green">Ayuda y Soporte</h1>
              <p className="text-muted-foreground">Estamos aquí para ayudarte</p>
            </div>
          </div>

          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contacto</TabsTrigger>
              <TabsTrigger value="report">Reportar</TabsTrigger>
              <TabsTrigger value="suggest">Sugerir</TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-green" />
                    Preguntas Frecuentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Búsqueda */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar en preguntas frecuentes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Categorías */}
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={selectedCategory === 'all' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory('all')}
                    >
                      Todas
                    </Badge>
                    {faqCategories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'secondary'}
                        className={`cursor-pointer ${selectedCategory === category.id ? '' : category.color}`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <category.icon className="h-3 w-3 mr-1" />
                        {category.label}
                      </Badge>
                    ))}
                  </div>

                  {/* Lista de FAQs */}
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No se encontraron preguntas que coincidan con tu búsqueda.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Enviar Ticket */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-green" />
                      Enviar Ticket de Soporte
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Tiempo de respuesta: 24-48 horas
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Email de contacto</label>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={ticketForm.email}
                          onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Asunto</label>
                        <Input
                          placeholder="Describe brevemente tu problema"
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Descripción detallada</label>
                        <Textarea
                          placeholder="Proporciona todos los detalles posibles sobre tu problema..."
                          value={ticketForm.description}
                          onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Ticket
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contacto Directo */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contacto Directo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-sm text-muted-foreground">soporte@ecoexchange.com</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Horario de atención</h4>
                        <p className="text-sm text-muted-foreground">
                          Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                          Sábados: 10:00 AM - 2:00 PM
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Tiempo de respuesta promedio</h4>
                        <p className="text-sm text-muted-foreground">24-48 horas</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Guías de ayuda rápida</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Cómo comprar productos
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Cómo vender productos
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Consejos de seguridad
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Report Tab */}
            <TabsContent value="report" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-red-500" />
                    Reportar Problema Técnico
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ¿Encontraste un error o mal funcionamiento? Ayúdanos a mejorarlo.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitBugReport} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Título del problema</label>
                      <Input
                        placeholder="Ejemplo: No puedo subir fotos de productos"
                        value={bugReport.title}
                        onChange={(e) => setBugReport({...bugReport, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descripción del problema</label>
                      <Textarea
                        placeholder="Describe qué estaba ocurriendo cuando encontraste el problema..."
                        value={bugReport.description}
                        onChange={(e) => setBugReport({...bugReport, description: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Pasos para reproducir</label>
                      <Textarea
                        placeholder="1. Voy a la sección de productos&#10;2. Presiono el botón '+'&#10;3. Selecciono una foto&#10;4. La foto no se carga..."
                        value={bugReport.steps}
                        onChange={(e) => setBugReport({...bugReport, steps: e.target.value})}
                        rows={4}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Bug className="h-4 w-4 mr-2" />
                      Enviar Reporte
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suggest Tab */}
            <TabsContent value="suggest" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Sugerir Mejora o Nueva Función
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tus ideas nos ayudan a mejorar. ¡Comparte tu sugerencia!
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Título de la sugerencia</label>
                      <Input
                        placeholder="Ejemplo: Agregar filtro por distancia"
                        value={suggestion.title}
                        onChange={(e) => setSuggestion({...suggestion, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Categoría</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={suggestion.category}
                        onChange={(e) => setSuggestion({...suggestion, category: e.target.value})}
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="navegacion">Navegación y UX</option>
                        <option value="productos">Gestión de productos</option>
                        <option value="comunicacion">Comunicación y chat</option>
                        <option value="seguridad">Seguridad</option>
                        <option value="notificaciones">Notificaciones</option>
                        <option value="otra">Otra</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descripción detallada</label>
                      <Textarea
                        placeholder="Explica tu idea, cómo funcionaría y por qué sería útil..."
                        value={suggestion.description}
                        onChange={(e) => setSuggestion({...suggestion, description: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Enviar Sugerencia
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
